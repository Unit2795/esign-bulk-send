import React from 'react';
import './EditableCell.sass';

export default function EditableCell(
    {
      colEdge,
      rowIndex,
      colIndex,
      changeCellValue,
      blank,
      valid
    } :
    {
      colEdge: any,
      rowIndex: number,
      colIndex: number,
      changeCellValue: (newValue: string, row: number, col: number) => void,
      valid: boolean,
      blank: boolean,
    }
) {
  let [edit, setEdit] = React.useState(false);

  return (
    <td style={{
      background: valid ? (blank ? "rgba(0, 0, 255, 0.3)" : "transparent") : "rgba(255, 0, 0, 0.3)"
    }} onClick={event => {
      setEdit(true);
    }}>
      {edit ? (
        <textarea
          style={{
            background: "transparent",
            width: '100%',
            border: '0',
            margin: '0'
          }}
          autoFocus
          onBlur={event => {
            let val = event.target.value;
            changeCellValue(val, rowIndex, colIndex);
            setEdit(false);
          }}
          defaultValue={colEdge}
          id={`cell-${rowIndex}-${colIndex}`}/>
      ) : (
        <div>{colEdge}</div>
      )}
    </td>
  );
}
