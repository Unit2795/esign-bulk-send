import React from 'react';
import Button from "@material-ui/core/Button";
import {MAPPING_TYPES, setState, store, useSelector} from "../../../../lib/store";
import {validation} from "../../../../lib/validation/validation";
import moment from "moment";
import TablePagination from '@material-ui/core/TablePagination';
import TableHeader from "./TableHeader";
import {TableRows} from "./TableRows";
import TablePaginationActions from "./TablePaginationActions";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function TableEditor() {
  let {mappingToColumn, mappings, detectedValidation, templates, spreadsheet} = useSelector(s => s);

  let [page, setPage] = React.useState(0);
  let [rowsPerPage, setRowsPerPage] = React.useState(25);

  // Store cells that will throw an error when provided to eSign Genie
  let [badValidity, setBadValidity] = React.useState<{
    rows: number[],
    columns: number[]
  }>({
    rows: [],
    columns: []
  });

  let [blankCells, setBlankCells] = React.useState<{
    rows: number[],
    columns: number[]
  }>({
    rows: [],
    columns: []
  });

  let [unmappedCols, setUnmappedCols] = React.useState<string[]>([]);

  let [validityChecked, setValidityChecked] = React.useState(false);


  function evaluateValidity() {
    let blankRows: any[] = [];
    let blankColumns: any[] = [];

    let invalidRows: any[] = [];
    let invalidColumns: any[] = [];

    let newUnmappedCols: string[] = [...spreadsheet.cols];

    // Iterate over each row and ensure provided party and field values are formatted properly
    for (let r = 0; r < spreadsheet.rows.length; r++) {
      let thisRow = spreadsheet.rows[r];

      for (let m = 0; m < mappings.length; m++) {
        let {type, label} = mappings[m];
        let colName: any = mappingToColumn[m];

        if(colName !== null) {
          if (newUnmappedCols.includes(colName)) {
            newUnmappedCols.splice(newUnmappedCols.indexOf(colName), 1);
          }

          // These party mappings are required. If they are invalid, transmission cannot take place.
          // TODO Refactor this by placing in a loop to reduce wetness
          // TEST Ensure validity with all possible values
          if (type === MAPPING_TYPES.fname) {
            // @ts-ignore
            if (typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0) {
              invalidRows.push(r);
              invalidColumns.push(spreadsheet.cols.indexOf(colName));
            }
          }
          if (type === MAPPING_TYPES.lname) {
            // @ts-ignore
            if (typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0) {
              invalidRows.push(r);
              invalidColumns.push(spreadsheet.cols.indexOf(colName));
            }
          }
          if (type === MAPPING_TYPES.email) {
            if (typeof thisRow[colName] === "undefined" || !validation.isEmailValid(thisRow[colName])) {
              invalidRows.push(r);
              invalidColumns.push(spreadsheet.cols.indexOf(colName));
            }
          }
          if (type === MAPPING_TYPES.dialingCode)
          {
            // @ts-ignore
            if (typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0) {
              blankRows.push(r);
              blankColumns.push(spreadsheet.cols.indexOf(colName));
            }
          }
          if (type === MAPPING_TYPES.phone)
          {
            // @ts-ignore
            if (typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0) {
              blankRows.push(r);
              blankColumns.push(spreadsheet.cols.indexOf(colName));
            }
          }
          if (type === MAPPING_TYPES.field)
          {
            let {type, value} = detectedValidation[templates.fields.indexOf(label)];

            // @ts-ignore
            if (type === "date")
            {
              // @ts-ignore
              if(typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0)
              {
                blankRows.push(r);
                blankColumns.push(spreadsheet.cols.indexOf(colName));
              }
              // @ts-ignore
              else if ((moment(thisRow[colName], value).format(value) !== thisRow[colName]))
              {
                invalidRows.push(r);
                invalidColumns.push(spreadsheet.cols.indexOf(colName));
              }
            }
            else if (type === "text")
            {
              // @ts-ignore
              let regexp = RegExp(value);
              // @ts-ignore
              if(typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0)
              {
                blankRows.push(r);
                blankColumns.push(spreadsheet.cols.indexOf(colName));
              }
              else if (!regexp.test(thisRow[colName]))
              {
                invalidRows.push(r);
                invalidColumns.push(spreadsheet.cols.indexOf(colName));
              }
            }
            else if (type === "dropdown")
            {
              // @ts-ignore
              if(typeof thisRow[colName] === "undefined" || thisRow[colName].trim() <= 0)
              {
                blankRows.push(r);
                blankColumns.push(spreadsheet.cols.indexOf(colName));
              }
              else if (!value.includes(thisRow[colName]))
              {
                invalidRows.push(r);
                invalidColumns.push(spreadsheet.cols.indexOf(colName));
              }
            }
          }
        }
      }
    }

    setUnmappedCols(newUnmappedCols);

    setBlankCells({
      columns: blankColumns,
      rows: blankRows
    });

    setBadValidity({
      columns: invalidColumns,
      rows: invalidRows
    });
  }

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function changeCellValue(newValue: string, row: number, col: number) {
    let rowsEdited = spreadsheet.rows;

    // @ts-ignore
    rowsEdited[row][spreadsheet.cols[col]] = newValue;

    // @ts-ignore
    console.log(rowsEdited[row][spreadsheet.cols[col]]);

    store.dispatch(setState({
      spreadsheet: {
        rows: rowsEdited,
        ...spreadsheet
      }
    }));
  }

  let [activeRows, setActiveRows] = React.useState([]);

  React.useEffect(function () {
    console.log('remap');
    let newRows: any = [];
    for (let m = (rowsPerPage * page); m < (rowsPerPage * (page + 1)) && m <= spreadsheet.rows.length - 1; m++)
    {
      let thisRow: any[] = [];
      spreadsheet.cols.map((edge: any, index: any) => {
        thisRow.push(spreadsheet.rows[m][edge]);
      })
      newRows.push(thisRow);
    }
    setActiveRows(newRows);
  }, [spreadsheet, rowsPerPage, page])


  return (
    <Card style={{
      margin: '64px'
    }}>
      <CardContent>
        <Button variant={'contained'} color={'secondary'} type={"button"} onClick={event => {
          evaluateValidity();
          setValidityChecked(true);
        }}>
          Check Validity
        </Button>
        {
          !validityChecked ? '' : (
            <p style={{
              color: 'red'
            }}>
              {badValidity.columns.length} invalid cell{badValidity.columns.length === 1 ? "" : "s"}
            </p>
          )
        }
        {
          !validityChecked ? '' : (
            <p style={{
              color: 'blue'
            }}>
              {blankCells.columns.length} blank cell{blankCells.columns.length === 1 ? "" : "s"}
            </p>
          )
        }
        {
          !validityChecked ? '' : (
            <p style={{
              color: 'green'
            }}>
              {unmappedCols.length} unmapped column{unmappedCols.length === 1 ? "" : "s"}
            </p>
          )
        }

        <TablePaginationActions
          count={spreadsheet.rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowCountOptions={[5, 25, 50, 100, 250]}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onChangePage={handleChangePage}/>
        <div style={{
          height: '90vh',
          maxWidth: '90vw',
          overflow: 'auto',
          margin: "auto"
        }}>
          <table className={'editor-table'}>
            <TableHeader/>
            <TableRows
              indexOffset={page * rowsPerPage}
              badValidity={badValidity}
              unmappedCols={unmappedCols}
              blankCells={blankCells}
              activeRows={activeRows}
              changeCellValue={changeCellValue}/>
          </table>
        </div>
        <TablePaginationActions
          count={spreadsheet.rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowCountOptions={[5, 25, 50, 100, 250]}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onChangePage={handleChangePage}/>
      </CardContent>
    </Card>
  );
}