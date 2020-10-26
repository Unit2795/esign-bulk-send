import {COLUMN_ESIGN_MAPPING, MAPPING_TYPES, setState, store} from "../store";

export class mapping
{
  static nameGenerator(incomingString: string, row: any)
  {
    let formedExample = "";
    let splitString = incomingString.split("${");
    for (let x = 0; x < splitString.length; x++)
    {
      if (splitString.length === 1)
      {
        formedExample += splitString[0];
      }
      else
      {
        let endSplit = splitString[x].split("}")
        if (endSplit.length === 1)
        {
          formedExample += endSplit[0];
        }
        else
        {
          let colName = endSplit[0];

          formedExample += row[colName] + endSplit[1];
        }
      }
    }
    return formedExample;
  }

  static importJson(file: Blob)
  {
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = (event) => {
      if (event.target !== null && typeof event.target.result === "string")
      {
        let data = JSON.parse(event.target.result);

        /* EDGE CASE
            When importing a mapping whose fields differ from the active templates, we need to ensure that the proper fields
            are maintained while importing whatever mappings we can. Therefore, we need to add missing parties/fields and
            clip excess parties/fields.
        */

        let {mappingToColumn, mappings, spreadsheet} = store.getState();

        let currentMappingToColumnsNew: (string|null)[] = data.fieldsToColumns;
        let currentMappables: COLUMN_ESIGN_MAPPING[] = data.eSignGenieFields;

        let mappingToColumnsNew: (string|null)[] = mappingToColumn;

        let labelArr = [];


        // Iterate over the current mappings and place them into easily indexed arrays.
        for (let x = 0; x < mappingToColumn.length; x++)
        {
          let {label} = mappings[x];

          labelArr.push(label);
        }

        // Iterate over the imported mappings and determine if any of them are utilized in the current template selection.
        for (let m = 0; m < currentMappables.length; m++)
        {
          let {label} = currentMappables[m];
          let colName = currentMappingToColumnsNew[m];

          // Since the label is a unique value, if it is found in the selected templates array
          if (labelArr.includes(label) && colName !== null)
          {

            /*
              Even if a mapping exists, the column it is associated with may not exist in the currently loaded spreadsheet.

              Assuming the label is found and the column is too, create the association.
            */
            if (spreadsheet.cols.includes(colName))
            {
              // Gather the index of the label so that the current value can be socketed into template mappings
              let index = labelArr.indexOf(label);

              // Graft the current column name into column mapping array
              mappingToColumnsNew[index] = colName;
            }
          }
        }

        store.dispatch(setState({
          mappingToColumn: mappingToColumnsNew
        }))
      }
      else
      {
        alert('File import error')
      }
    }
  }
}