import {endpoint} from "./endpoint";
import {COLUMN_ESIGN_MAPPING, MAPPING_TYPES, setState, SPREADSHEET, store, TEMPLATE} from "../store";
import {validation} from "../validation/validation";
import {mapping} from "../mapping/mapping";
import Cookies from "js-cookie";

export class template
{
  static async sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

   /*Takes an old permission and compares it to a new one, if the new one is greater, perform a promotion.
   In the case of "SIGN_ONLY" and "FILL_FIELDS_ONLY", perform a combination into "FILL_FIELDS_AND_SIGN"

   Simulation:
   (V = VIEW_ONLY, S = SIGN_ONLY, F = FILL_FIELDS_ONLY, X = FILL_FIELDS_AND_SIGN)

   Situations which require promotion:
   Old | New | Output
   V | S | S
   V | F | F
   V | X | X

   S | F | X
   F | S | X

   S | X | X
   F | X | X
   */
  static permissionCombinator(oldPerm: string, newPerm: string)
  {
    // If permission is view only, and new is not, assume immediate promotion.
    if (oldPerm === "VIEW_ONLY" && newPerm !== "VIEW_ONLY")
    {
      return newPerm
    }
    // If sign and fill come up together, assume immediate promotion.
    else if ((oldPerm === "SIGN_ONLY" && newPerm === "FILL_FIELDS_ONLY") || (oldPerm === "FILL_FIELDS_ONLY" && newPerm === "SIGN_ONLY") || (oldPerm !== "FILL_FIELDS_AND_SIGN" && newPerm === "FILL_FIELDS_AND_SIGN"))
    {
      return "FILL_FIELDS_AND_SIGN";
    }
    else
    {
      return oldPerm
    }
  }

  static async createFolder(token: string, templates: TEMPLATE, spreadsheet: SPREADSHEET, folderName: string, mappings: COLUMN_ESIGN_MAPPING[], mappingToColumn: (string | null)[])
  {
    /* EDGE CASE
        When logging out during a transmit, the transmit must be interrupted. If this occurred but the user logs back in
        and attempts to transmit again, if this value isn't cleared the transmit will instantly cancel.
     */
    store.dispatch(setState({
      interruptTransmit: false
    }))

    let success = 0;
    let error = 0;
    store.dispatch(setState({
      sendProgress: 0
    }));
    for (let i = 0; i < spreadsheet.rows.length; i++)
    {
      let thisRow = spreadsheet.rows[i];

      let fields = {};
      let parties = [];

      // First, populate parties with default data, so it's easy to target them in any order and populate them.
      for (let p = 0; p < templates.biggestPartySize; p++)
      {
        let newParty = {
          "firstName": "",
          "lastName": "",
          "emailId": "",
          "sequence": (p+1),
          "permission": "VIEW_ONLY",
          "allowNameChange":false
        };

       parties.push(newParty);
      }

      for (let m = 0; m < mappings.length; m++)
      {
        let {type, party, label} = mappings[m];
        let colName: any = mappingToColumn[m];

        // If the map to column name is not null, it's assumed this field maps to a column
        if (colName !== null)
        {
          if (party !== -1)
          {
            if (type === MAPPING_TYPES.email)
            {
              parties[party]['emailId'] = thisRow[colName];
            }
            else if (type === MAPPING_TYPES.fname)
            {
              parties[party]['firstName'] = thisRow[colName];
            }
            else if (type === MAPPING_TYPES.lname)
            {
              parties[party]['lastName'] = thisRow[colName];
            }
            else if (type === MAPPING_TYPES.dialingCode)
            {
              let value = thisRow[colName];
              if (typeof value !== "undefined" && value.trim().length > 0)
              {
                // @ts-ignore
                parties[party].dialingCode = value;
              }
            }
            else if (type === MAPPING_TYPES.phone)
            {
              let value = thisRow[colName];
              if (typeof value !== "undefined" && value.trim().length > 0)
              {
                // @ts-ignore
                parties[party].mobileNumber = value;
              }
            }
          }
          else
          {
            let returnVal = thisRow[colName];

            if (typeof returnVal !== "string")
            {
              returnVal = JSON.stringify(returnVal);
            }
            // @ts-ignore
            fields[label] = returnVal;
          }
        }
      }

      /*for (let f = 0; f < mappedFields.column.length; f++)
      {
        let returnVal = thisRow[mappedFields.column[f]];
        if (typeof returnVal !== "string")
        {
          returnVal = JSON.stringify(returnVal);
        }

        // @ts-ignore
        fields[mappedFields.field[f]] = returnVal;
      }*/

      // First, compare the row's parties to the mapped size
      /*for (let p = 0; p < mappedParties.length; p++)
      {
        // @ts-ignore
        let thisEmail = thisRow[mappedParties[p].email];
        // @ts-ignore
        let thisFname = thisRow[mappedParties[p].fname];
        // @ts-ignore
        let thisLname = thisRow[mappedParties[p].lname];

        let newParty = {
          "firstName": thisFname,
          "lastName": thisLname,
          "emailId": thisEmail,
          "sequence": (p+1),
          "permission": "VIEW_ONLY",
          "allowNameChange":false
        };

        if (mappedParties[p].phone !== null)
        {
          // @ts-ignore
          newParty.mobileNumber = thisRow[mappedParties[p].phone];
        }

        if (mappedParties[p].dialingCode !== null)
        {
          // @ts-ignore
          newParty.dialingCode = thisRow[mappedParties[p].dialingCode];
        }

        // If an email is provided for the party, assume this row has this party.
        if (typeof thisEmail !== "undefined" && thisEmail.trim().length > 3 && thisEmail.includes("@"))
        {
          parties.push(newParty)
        }
      }*/

      // Iterate over the selected templates
      for (let t = 0; t < templates.selected.length; t++){
          // The send will fail without permissions applied, we need to evaluate the highest set of permissions in the available templates and apply them to each party.
          for (let x = 0; x < templates.permissions[t].length; x++)
          {
            let newPermission = templates.permissions[t][x];
            let currentPermission = parties[x].permission;
            let outputPermission = this.permissionCombinator(currentPermission, newPermission);
            if (currentPermission !== outputPermission)
            {
              parties[x].permission = outputPermission;
            }
          }
      }


      let body = {
        "folderName": mapping.nameGenerator(folderName, thisRow),
        "templateIds": templates.selected,
        "fields": fields,
        "parties": parties,
        "sendNow": true,
        "themeColor": "#009933"
      };


      let options = {
        "method": "post",
        "headers": {
          "Authorization": "Bearer " + Cookies.get('esg-access-token'),
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
      }

      console.log(options);

      await this.sleep(5000);
      if (store.getState().interruptTransmit)
      {

        return;
      }
      console.log('did not interrupt')
      let result = await fetch("https://cors-anywhere.herokuapp.com/https://www.esigngenie.com/esign/api/templates/createFolder", options);

      let data = await result.json();

      if (data.result === "success")
      {
        success += 1;
      }
      else
      {
        error += 1;
      }

      store.dispatch(setState({
        sendProgress: parseInt(String(((i + 1) / spreadsheet.rows.length) * 100)),
        result: {
          success,
          error
        }
      }));

      console.log(data);
    }
  }

  static async readFields(token: string, templates: TEMPLATE, spreadsheet: SPREADSHEET)
  {
    store.dispatch(setState({
      loading: true
    }));

    let options = {
      "method": "get",
      "headers": {
        "Authorization": "Bearer " + token
      }
    };

    let newMaxParties = 1;

    // Assuming the field is not already present, add it to detected fields. (For duplicates between templates or within a single template.
    let detectedFields: any[] = [];
    // Array associated with each template's required permissions, used to apply correct permissions, which are required.
    let detectedPermissions = [];
    let detectedValidation = [];

    // Iterate over the active templates to fetch their fields and permissions
    for (let x = 0; x < templates.selected.length; x++)
    {
      console.log(templates.selected[x] + "---" + templates.id.indexOf(templates.selected[x]));
      let templateIndex = templates.id.indexOf(templates.selected[x]);
      let thisPartyCount = templates.data[templateIndex].partyCount;

      // Evaluate if the current template has a party requirement greater than the currently define one (needed for mapping)
      if (thisPartyCount > newMaxParties)
      {
        newMaxParties = thisPartyCount;
      }

      // Perform request
      let res = await fetch((endpoint.templates.get + "?templateId=" + templates.selected[x]), options);

      let jsonData = await res.json();

      // These fields do not accept a default value
      let ignoredFields = ["signfield", "initialfield", "accept", "decline", "imagefield", "attachmentfield"];


      for(let f = 0; f < jsonData.allfields.length; f++)
      {
        let thisField = jsonData.allfields[f];
        if (!ignoredFields.includes(thisField.fieldType) && !thisField.systemField)
        {
          let fieldName;
          if (thisField.fieldType === "checkboxfield")
          {
            fieldName = thisField[`cbname`]
          }
          else if (thisField.fieldType === "dropdownfield")
          {
            fieldName = thisField[`dropdownFieldName`];
          }
          else
          {
            fieldName = thisField[`${thisField.fieldType}Name`];
          }

          if (!detectedFields.includes(fieldName))
          {
            detectedFields.push(fieldName);

            let validationType = null;
            let validationValue = "";

            switch(thisField.fieldType) {
              case "dropdownfield":
                validationType = "dropdown";
                validationValue = thisField.dropdownOptions.split("~||~");
                break;
              case "datefield":
                validationType =  "date";
                validationValue = thisField.dateFormat;
                break;
              case "textfield":
                let charLimit = thisField.characterLimit;
                let valType = thisField.validation;
                validationType = "text";

                if (valType === "None" && charLimit === 0)
                {
                  validationType = null;
                }
                else if (valType !== "RegexValidation")
                {
                  validationValue = validation.formValidationRegex(charLimit, valType);
                }
                else if (valType === "RegexValidation")
                {
                  validationValue = decodeURI(thisField.customValidationValue);
                }
            }

            detectedValidation.push({
              type: validationType,
              value: validationValue
            });
          }
        }
      }

      let templatePermissions = [];
      // Fetch the permissions needed for active templates
      for (let p = 0; p < jsonData.template.templatePartyPermissions.length; p++)
      {
        templatePermissions.push(jsonData.template.templatePartyPermissions[p].templatePermissions);
      }
      detectedPermissions.push(templatePermissions);
    }

    /* NOTE
        First, let's add the default, always present, party "fields" that can be assigned to.
        These are pushed into a universally formatted array. It's much easier to refer to mappings in this way, and
        convert them for better human readability when importing/exporting mapping files. Separating party and field
        mappings introduces too much internal complexity as opposed to a uniformly formatted array of objects.
    */
    let currentMappables: COLUMN_ESIGN_MAPPING[] = store.getState().mappings;
    let mappables: COLUMN_ESIGN_MAPPING[] = [];

    let currentMappingToColumnsNew: (string|null)[] = store.getState().mappingToColumn;
    let mappingToColumnsNew: (string|null)[] = [];
    for (let b = 0; b < newMaxParties; b++)
    {
      let partyOffset = b * 5;

      for (let j = 0; j < 5; j++)
      {
        if (typeof currentMappingToColumnsNew[partyOffset + j] !== "undefined")
        {
          mappingToColumnsNew.push(currentMappingToColumnsNew[partyOffset + j]);
        }
        else
        {
          mappingToColumnsNew.push(null);
        }
      }

      mappables.push({
        type: MAPPING_TYPES.fname,
        party: b,
        label: `Recipient #${b + 1} First Name`
      });
      mappables.push({
        type: MAPPING_TYPES.lname,
        party: b,
        label: `Recipient #${b + 1} Last Name`
      });
      mappables.push({
        type: MAPPING_TYPES.email,
        party: b,
        label: `Recipient #${b + 1} Email`
      });
      mappables.push({
        type: MAPPING_TYPES.dialingCode,
        party: b,
        label: `Recipient #${b + 1} Phone Country Code`
      });
      mappables.push({
        type: MAPPING_TYPES.phone,
        party: b,
        label: `Recipient #${b + 1} Phone Number`
      });
    }

    for (let l = 0; l < detectedFields.length; l++)
    {
      // Required so as not to read party fields default columns
      let offset = mappables.length;

      if (typeof currentMappingToColumnsNew[offset] !== "undefined")
      {
        mappingToColumnsNew.push(currentMappingToColumnsNew[offset]);
      }
      else if (spreadsheet.cols.includes(detectedFields[l]))
      {
        mappingToColumnsNew.push(detectedFields[l]);
      }
      else
      {
        mappingToColumnsNew.push(null);
      }

      mappables.push({
        type: MAPPING_TYPES.field,
        party: -1,
        label: detectedFields[l]
      });
    }

    console.log(detectedFields);
    console.log(detectedPermissions);

    let newTemplates = {
      ...templates
    };

    newTemplates.fields = detectedFields;
    newTemplates.permissions = detectedPermissions;
    newTemplates.biggestPartySize = newMaxParties;

    store.dispatch(setState({
      templates: newTemplates,
      // @ts-ignore
      detectedValidation,
      mappings: mappables,
      mappingToColumn: mappingToColumnsNew,
      loading: false
    }));
  }

  static async readAll(token: string) {
    store.dispatch(setState({
      loading: true
    }));

    let options = {
      "method": "get",
      "headers": {
        "Authorization": "Bearer " + token
      }
    };

    let res = await fetch(endpoint.templates.list, options);

    let jsonParsed = await res.json();

    let data: any = [];
    let id: any = [];

    jsonParsed.templatesList.map((edge: any, index: any) => {
      id.push(edge.templateId);
      data.push({
        name: edge.templateName,
        partyCount: edge.numberOfParties
      });
      return null;
    });

    let currentSelection = store.getState().templates.selected

    let templates: TEMPLATE = {
      id,
      data,
      selected: currentSelection,
      biggestPartySize: 0,
      permissions: [],
      fields: []
    };

    store.dispatch(setState({
      templates,
      loading: false
    }));

    return;
  }
}