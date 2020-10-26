import React from 'react';
import {MAPPING_TYPES, setState, STAGE, store, useSelector} from "../../lib/store";
import ProvideToken from "./ProvideToken/ProvideToken";
import ChooseTemplatesFiles from "./ChooseTemplatesFiles/ChooseTemplatesFiles";
import Button from "@material-ui/core/Button";
import {CreateMapping} from "./CreateMapping/CreateMapping";
import Transmit from "./Transmit/Transmit";
import {template} from "../../lib/esign-genie/template";
import Loading from "./Loading/Loading";
import Cookies from 'js-cookie';

export default function Stage() {
  const cookieName = 'esg-access-token';

  let {stage, token, templates, spreadsheet, sendProgress, loading, folderName, dev, mappings, mappingToColumn} = useSelector(s => s);

  async function authorizer() {
    let tokenCookie = Cookies.get(cookieName);
    if (typeof tokenCookie !== "undefined")
    {
      store.dispatch(setState({
        stage: STAGE.CHOOSE_TEMPLATES_AND_FILES,
        token: tokenCookie
      }));
    }
    else
    {
      let url = new URL(window.location.href);
      let code = url.searchParams.get('code');

      if (code && code.length === 32 && token === "")
      {
        store.dispatch(setState({
          loading: true
        }));

        let options = {
          "method": "post",
          "body": JSON.stringify({
            authCode: code,
            redirectURL: dev ? "https://localhost:3001" : "https://bulk.djoz.us"
          })
        };

        let res = await fetch("https://xsovmd3uyg.execute-api.us-east-1.amazonaws.com/Prod/authorize", options);

        let data = await res.text();

        Cookies.set(cookieName, data);

        store.dispatch(setState({
          stage: STAGE.CHOOSE_TEMPLATES_AND_FILES,
          token: data,
          loading: false
        }));

        window.location.replace(window.location.pathname);
      }
    }
  }

  React.useEffect(function () {
    authorizer();
  }, []);

  React.useEffect(function () {
    if (stage === STAGE.CHOOSE_TEMPLATES_AND_FILES)
    {
      template.readAll(token);
    }
    else if (stage === STAGE.CREATE_MAPPING)
    {
      template.readFields(token, templates, spreadsheet);
    }
    else if (stage === STAGE.TRANSMIT)
    {
      template.createFolder(token, templates, spreadsheet, folderName, mappings, mappingToColumn);
    }
  }, [stage]);

  let returnJSX;
  if (loading)
  {
    returnJSX = <Loading/>;
  }
  else if (stage === STAGE.CHOOSE_TEMPLATES_AND_FILES)
  {
    returnJSX = <ChooseTemplatesFiles/>;
  }
  else if (stage === STAGE.CREATE_MAPPING)
  {
    returnJSX = <CreateMapping/>;
  }
  else if (stage === STAGE.TRANSMIT)
  {
    returnJSX = <Transmit/>;
  }
  else
  {
    returnJSX = <ProvideToken/>;
  }

  let minStage = STAGE.PROVIDE_TOKEN;
  let maxStage = STAGE.TRANSMIT;


  function disableIncrease(): boolean {
    let disable: boolean = false;

    if (stage === STAGE.PROVIDE_TOKEN)
    {
      disable = (token.length !== 32)
    }
    else if (stage === STAGE.CHOOSE_TEMPLATES_AND_FILES)
    {
      disable = (spreadsheet.rows.length <= 0 || templates.selected.length <= 0);
    }
    else if (stage === STAGE.CREATE_MAPPING)
    {
      // Are all party's required fields (fname, lname, email) included and valid?
      for (let p = 0; p < mappings.length && !disable; p++)
      {
        let {type, party, label} = mappings[p];
        if (party !== -1)
        {
          if ((type === MAPPING_TYPES.email || type === MAPPING_TYPES.fname || type === MAPPING_TYPES.lname) && mappingToColumn[p] === null)
          {
            disable = true;
          }
        }
      }

      // TODO refactor validation

      /*disable = (mappedParties.length < maxPartyCount);*/
    }

    return (stage >= maxStage) || (disable);
  }

  function disableDecrease(): boolean {
    let disable = false;


    if (sendProgress !== -1)
    {
      disable = true;
    }
    else if (stage === STAGE.CHOOSE_TEMPLATES_AND_FILES && token.length === 32)
    {
      disable = true;
    }

    return (stage <= minStage) || (disable);
  }


  return(
    <div className={'stage-container'}>
      <nav>
        <Button style={{
          width: '40%',
          height: '64px',
          borderRadius: 0
        }} disabled={disableDecrease()} variant="contained" color="primary" onClick={event => {
          store.dispatch(setState({
            stage: (stage - 1)
          }));
        }}>
          Previous
        </Button>
        <Button disabled={token === ""} variant="contained" color="secondary" style={{
          width: '20%',
          height: '64px',
          borderRadius: 0
        }} onClick={event => {
          store.dispatch(setState({
            token: "",
            stage: STAGE.PROVIDE_TOKEN,
            interruptTransmit: true
          }));

          Cookies.remove(cookieName);
        }}>Logout</Button>
        <Button style={{
          width: '40%',
          height: '64px',
          borderRadius: 0
        }} disabled={disableIncrease()} variant="contained" color="primary" onClick={event => {
          store.dispatch(setState({
            stage: (stage + 1)
          }));
        }}>
          Next
        </Button>
      </nav>
      {returnJSX}
    </div>
  );
}