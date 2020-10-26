import React from 'react';
import EditableCell from "./EditableCell";
import {validation} from "../../../../lib/validation/validation";

export const TableRow = React.memo(function TableRowJSX(
    {
      row,
      rowIndex,
      changeCellValue,
      badValidity,
      blankCells,
      unmappedCols
    } :
    {
      unmappedCols: string[],
      blankCells: {
        rows: number[],
        columns: number[]
      },
      badValidity: {
        rows: number[],
        columns: number[]
      },
      row: any,
      rowIndex: number,
      changeCellValue: (newValue: string, row: number, col: number) => void
    }
) {
  return (
    <tr>
      {
        row.map((colEdge: any, colIndex: any) => {
          let isInvalid = false;
          let isBlank = false;

          let blankIndices = validation.getAllIndexes(blankCells.rows, rowIndex);

          for (let m = 0; m < blankIndices.length; m++)
          {
            if (blankCells.columns[blankIndices[m]] === colIndex)
            {
              isBlank = true;
            }
          }

          let badIndices = validation.getAllIndexes(badValidity.rows, rowIndex);

          for (let x = 0; x < badIndices.length; x++)
          {
            if (badValidity.columns[badIndices[x]] === colIndex)
            {
              isInvalid = true;
            }
          }

          return(
            <EditableCell
              blank={isBlank}
              valid={!isInvalid}
              colEdge={colEdge}
              rowIndex={rowIndex}
              colIndex={colIndex}
              changeCellValue={changeCellValue}/>
          );
        })
      }
    </tr>
  );
});