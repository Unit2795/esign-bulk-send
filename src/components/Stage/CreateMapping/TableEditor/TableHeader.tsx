import React from 'react';
import {PARTY_MAPPING_KEYS, setState, store, useSelector} from "../../../../lib/store";
import './TableHeader.sass';

import {MappingSelector} from "./MappingSelector";


export default function TableHeader() {
  let {spreadsheet, mappedFields, templates, mappedParties, mappingToColumn, mappings} = useSelector(s => s);

  let [selectorValues, setSelectorValues] = React.useState<(string|null)[]>([]);
  let [selectorOptions, setSelectorOptions] = React.useState<string[]>([]);

  // The value is a field label
  function changeHeaderMapping(value: any, col: string)
  {
    let newMappingsToColumn = [...mappingToColumn];
    if (value !== null)
    {
      let fieldIndex = selectorOptions.indexOf(value);
      newMappingsToColumn[fieldIndex] = col;
    }
    else
    {
      let colIndex = newMappingsToColumn.indexOf(col);
      newMappingsToColumn[colIndex] = null;
    }

    store.dispatch(setState({
      mappingToColumn: newMappingsToColumn
    }));
  }

  React.useEffect(function () {
    console.log('evaluating')
    // Generate selector values, since they must be unique, they can be indexed
    let newSelectorOptions = [];
    let newSelectorValues = [];

    for (let l = 0; l < mappings.length; l++)
    {
      let {label} = mappings[l];
      newSelectorOptions.push(label);
    }
    for (let v = 0; v < spreadsheet.cols.length; v++)
    {
      let colName = spreadsheet.cols[v];

      if (mappingToColumn.includes(colName))
      {
        let thisLabel = mappings[mappingToColumn.indexOf(colName)].label;
        newSelectorValues.push(thisLabel);
      }
      else
      {
        newSelectorValues.push(null);
      }
    }

    setSelectorOptions(newSelectorOptions);
    setSelectorValues(newSelectorValues);
  }, [mappingToColumn]);

  return (
    <thead className={'sticky-header'}>
      <tr>
        {
          spreadsheet.cols.map((edge, index) => {
            return(
              <th style={{
                overflow: "hidden",
                wordBreak: "break-all",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                <span>{edge}</span>
                <MappingSelector
                  col={edge}
                  value={selectorValues[index]}
                  options={selectorOptions}
                  changeHeaderMapping={changeHeaderMapping}
                  key={'col-mapper-' + edge}/>
              </th>
            )
          })
        }
      </tr>
    </thead>
  );
}