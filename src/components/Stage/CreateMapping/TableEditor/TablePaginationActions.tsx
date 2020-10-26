import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TextField from '@material-ui/core/TextField';


export default function TablePaginationActions(
  {
    count,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    rowCountOptions
  } :
  {
    count: number,
    page: number,
    rowsPerPage: number,
    onChangePage: (event: any, newPage: number) => void,
    onChangeRowsPerPage: (event: any) => void,
    rowCountOptions: number[]
  }
) {
  const handleFirstPageButtonClick = (event: any) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onChangePage(event, (page - 1));
  };

  const handleNextButtonClick = (event: any) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{
      margin: '12px auto'
    }}>
      <div>
        <span>Rows per page: </span>
        <select defaultValue={rowsPerPage} onChange={event => {
          onChangeRowsPerPage(event);
        }}>
          {
            rowCountOptions.map((edge, index) => {
              return (<option value={edge}>{edge}</option>)
            })
          }
        </select> &nbsp;
        <span>{(rowsPerPage * page) + 1} - {((rowsPerPage * (page + 1)) > count) ? count : (rowsPerPage * (page + 1))} of {count}</span>
      </div>
      <div>
        <TextField
          onKeyUp={event => {
            if (event.key === "Enter")
            {
              // @ts-ignore
              let val = (event.target.value - 1);
              let maxPage = (count / rowsPerPage) - 1;
              let returnVal = 0;
              if (val > maxPage)
              {
                returnVal = maxPage;
                // @ts-ignore
                event.target.value = maxPage;
              }
              else if (val >= 0)
              {
                returnVal = val;
              }
              else
              {
                returnVal = 0;
                // @ts-ignore
                event.target.value = 1;
              }
              onChangePage(event, returnVal);
            }
          }}
          defaultValue={page + 1}
          inputProps={{
            min: 1,
            max: (count / rowsPerPage) + 1
          }}
          type={'number'}
          label={'Skip to page'}/>
      </div>
      <div>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}>
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
          <LastPageIcon />
        </IconButton>
      </div>
    </div>
  );
}