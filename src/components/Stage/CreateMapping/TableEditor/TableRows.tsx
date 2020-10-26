import React from 'react';
import {setState, store, useSelector} from "../../../../lib/store";
import {TableRow} from "./TableRow";

export const TableRows = React.memo(function TableRowsJSX(
  {
    indexOffset,
    badValidity,
    blankCells,
    unmappedCols,
    activeRows,
    changeCellValue
  }:
  {
    indexOffset: number,
    unmappedCols: string[],
    blankCells: {
      rows: number[],
      columns: number[]
    },
    badValidity: {
      rows: number[],
      columns: number[]
    },
    activeRows: any[][],
    changeCellValue: (newValue: string, row: number, col: number) => void
  }
) {
  return (
    <tbody style={{
      fontSize: '10px',
      maxWidth: '100vw'
    }}>
    {
      activeRows.map((rowEdge, rowIndex) => {
        return(
          <TableRow
            unmappedCols={unmappedCols}
            blankCells={blankCells}
            badValidity={badValidity}
            row={rowEdge}
            rowIndex={rowIndex + indexOffset}
            changeCellValue={changeCellValue}/>
          );
      })
    }
    </tbody>
  );
});