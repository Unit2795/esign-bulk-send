import * as XLSX from 'xlsx';
import {FIELD_MAPPING, PARTY_MAPPING, setState, store} from "../store";

export class XLSXParser
{
  static importFile(file: Blob): boolean
  {
    let proceed = false;

    if (file.size > 200000)
    {
      let kb = (file.size / 1000).toFixed(2);
      let mb = (file.size / 1000000).toFixed(2);
      proceed = window.confirm(`File size is ${kb}KB / ${mb}MB in size. While loading your browser may freeze.`)
    }
    else
    {
      proceed = true;
    }

    if (proceed)
    {
      store.dispatch(setState({
        loading: true
      }));

      let reader = new FileReader();
      reader.onload = async function(e) {
        if (e.target !== null) {
          let {result} = e.target;

          let options = {
            type: 'array',
            raw: true,
            cellText: false,
            cellDates: true,
            cellFormula: false,
            cellHTML: false,
            sheetStubs: false
          }

          // @ts-ignore
          const parsed = XLSX.read(result, options)

          let rows = XLSX.utils.sheet_to_json(parsed.Sheets[`${parsed.SheetNames[0]}`], {
            raw:false,
            dateNF:'mm/dd/yyyy'
          });
          // @ts-ignore
          let cols = Object.keys(rows[0]);

          store.dispatch(setState({
            loading: false,
            // @ts-ignore
            folderName: file.name.split(".")[0],
            // @ts-ignore
            spreadsheet: {
              rows,
              cols
            }
          }));
        }
        else
        {
          store.dispatch(setState({
            loading: false
          }));
          alert('File import error')
        }
      };
      reader.readAsArrayBuffer(file);
    }
    return false;
  }
}