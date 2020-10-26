import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {STAGE, useSelector} from "../../../lib/store";

export default function Loading() {
  let {stage, templates} = useSelector(s => s);

  let message = "";

  if (stage === STAGE.PROVIDE_TOKEN)
  {
    message = "Authorizing with eSign Genie";
  }
  else if (stage === STAGE.CHOOSE_TEMPLATES_AND_FILES)
  {
    if (templates.id.length === 0)
    {
      message = "Fetching your templates";
    }
    else
    {
      message = "Loading table data";
    }
  }
  else if (stage === STAGE.CREATE_MAPPING)
  {
    message = "Retrieving template fields";
  }

  return (
    <div style={{
      marginTop: '64px',
      textAlign: 'center'
    }}>
      <h2>{message}</h2>
      <CircularProgress />
    </div>
  );
}