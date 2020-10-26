import React from 'react';
import Grid from "@material-ui/core/Grid";
import './ChooseTemplatesFiles.sass';
import SelectTemplate from "./SelectTemplate";
import SelectFile from "./SelectFile";

export default function ChooseTemplatesFiles() {
  return (
    <Grid container className={'file-template-body'} style={{
      textAlign: 'center'
    }}>
      <Grid item xs={6}>
        <SelectTemplate/>
      </Grid>
      <Grid item xs={6}>
        <SelectFile/>
      </Grid>
    </Grid>
  );
}