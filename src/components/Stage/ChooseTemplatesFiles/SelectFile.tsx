import React from 'react';
import CardContent from "@material-ui/core/CardContent";
import {validation} from "../../../lib/validation/validation";
import {setState, store, useSelector} from "../../../lib/store";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {XLSXParser} from "../../../lib/excel/XLSXParser";

export default function SelectFile() {
  let { spreadsheet } = useSelector(s => s);

  return (
    <Card style={{
      width: '90%',
      margin: '64px auto'
    }}>
      <CardHeader title={"Select File"}/>
      <CardContent>
        <input type={'file'} onChange={event => {
          // @ts-ignore
          if (validation.fileIsBlobType(event.target.files[0], ['xlsx', 'csv', 'tsv', 'ods']))
          {
            // @ts-ignore
            let success = XLSXParser.importFile(event.target.files[0]);
            if (!success)
            {
              event.target.value = '';
            }
          }
          else
          {
            store.dispatch(setState({
              spreadsheet: {
                rows: [],
                cols: [],
                ...spreadsheet
              }
            }));
          }
        }}/>
        {(spreadsheet.cols.length + spreadsheet.rows.length) > 1 ? (
          <div>
            <h3>{spreadsheet.rows.length} row{spreadsheet.rows.length > 1 ? 's' : ''}/folder{spreadsheet.rows.length > 1 ? 's' : ''}</h3>
            <hr/>
            <h3>{spreadsheet.cols.length} columns: </h3>
          </div>
        ) : null}
        {
          spreadsheet.cols.map((edge, index) => {
            return(<p>{edge}</p>);
          })
        }
      </CardContent>
    </Card>
  );
}