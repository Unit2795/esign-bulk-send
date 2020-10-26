import React from 'react';
import TextField from "@material-ui/core/TextField";
import {setState, store, useSelector} from "../../../../lib/store";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function FolderNaming() {
  let {spreadsheet, folderName} = useSelector(s => s);

  let nameRef = React.useRef();
  let [autocompleteVal, setAutocompleteVal] = React.useState<string | null>(null);

  return (
    <Card style={{
      margin: '64px'
    }}>
      <CardContent>
        <h2>Folder Name</h2>
        <TextField
          style={{
            width: '90%',
            maxWidth: '520px'
          }}
          defaultValue={folderName}
          inputRef={nameRef}
          helperText={"Use ${Column Name} to use columns to populate folder names for each row."}
          variant={'outlined'}
          onBlur={event => {
            store.dispatch(setState({
              folderName: event.target.value
            }))
          }}/>
        <Autocomplete
          openOnFocus
          getOptionLabel={(option) => {
            return option;
          }}
          value={autocompleteVal}
          renderInput={(params) => <TextField {...params} label="Search Columns" variant="outlined" helperText={"Example: File #${File Number} - ${Department} - Approval"}/>}
          style={{
            width: '90%',
            margin: "16px auto auto auto",
            maxWidth: '520px'
          }}
          options={spreadsheet.cols}
          onChange={(event, newValue) => {
            setAutocompleteVal(newValue);
            if (newValue !== null)
            {
              // @ts-ignore
              let newVal = nameRef.current.value + `\$\{${newValue}\}`;
              // @ts-ignore
              nameRef.current.value = newVal;
              store.dispatch(setState({
                folderName: newVal
              }));
              setTimeout(function () {
                setAutocompleteVal(null);
              }, 10);
            }
          }}/>
      </CardContent>
    </Card>
  );
}