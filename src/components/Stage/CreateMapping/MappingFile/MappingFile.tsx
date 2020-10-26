import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {mapping} from "../../../../lib/mapping/mapping";
import {useSelector} from "../../../../lib/store";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function MappingFile() {
  let {mappingToColumn, mappings, folderName} = useSelector(s => s);


  let [mappingName, setMappingName] = React.useState(folderName + " Mapping");

  return (
    <Card style={{
      margin: '64px'
    }}>
      <CardContent>
        <div>
          <h2>Mapping File</h2>
          <div style={{
            marginBottom: '12px'
          }}>
            <TextField
              style={{
                width: '90%',
                maxWidth: '520px'
              }}
              label={'Mapping File Name'}
              variant={"outlined"}
              value={mappingName}
              onChange={(event) => {
                setMappingName(event.target.value);
              }}/>
          </div>
          <a download={mappingName + ".json"} href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            eSignGenieFields: mappings,
            fieldsToColumns: mappingToColumn
          }))} style={{
            textDecoration: "none"
          }}>
            <Button variant={'contained'} color={"secondary"}>
              Save this mapping
            </Button>
          </a>
          <p style={{
            marginTop: '46px'
          }}>Provide a premade mapping</p>
          <input accept="application/JSON" type={'file'} onChange={event => {
            // @ts-ignore
            mapping.importJson(event.target.files[0]);
          }} style={{
            marginBottom: '64px'
          }}/>
        </div>
      </CardContent>
    </Card>
  );
}