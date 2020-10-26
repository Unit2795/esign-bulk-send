import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

function MappingSelectorJSX(
  {
    col,
    value,
    options,
    changeHeaderMapping
  } :
    {
      col: string,
      value: string | null,
      options: string[],
      changeHeaderMapping: (value: any, col: string) => void
    }) {

  let [controlledVal, setControlledVal] = React.useState<string | null>(null);

  React.useEffect(function () {
    if (typeof value !== "undefined")
    {
      setControlledVal(value);
    }
  }, [value]);

  return (
    <Autocomplete
      openOnFocus
      value={controlledVal}
      style={{
        marginTop: '12px',
        width: '100%',
        fontSize: '10px'
      }}
      renderInput={(params) => <TextField {...params} label="ESG Field" variant="outlined"/>}
      options={options}
      getOptionLabel={(option) => option}
      onChange={(event, value, reason, details) => {
        setControlledVal(value);
        changeHeaderMapping(value, col);
      }}/>
  );
}

export let MappingSelector = React.memo(MappingSelectorJSX);