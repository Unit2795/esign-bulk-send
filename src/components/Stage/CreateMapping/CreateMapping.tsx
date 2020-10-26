import React from 'react';
import {MAPPING_TYPES, setState, store, useSelector} from "../../../lib/store";
import Button from "@material-ui/core/Button";
import {mapping} from "../../../lib/mapping/mapping";
import './CreateMapping.sass';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {validation} from "../../../lib/validation/validation";
import moment from "moment";
import FolderNaming from "./FolderNaming/FolderNaming";
import MappingFile from "./MappingFile/MappingFile";
import TableEditor from "./TableEditor/TableEditor";


export const CreateMapping = React.memo(function CreateMapping() {
  return (
    <div className={'mapping-body'} style={{
      textAlign: 'center',
      marginTop: '64px'
    }}>
      <FolderNaming/>
      <MappingFile/>
      <TableEditor/>
      {/*<h2>Map Columns/Values</h2>
      <div style={{
        maxWidth: '100vw',
        overflow: 'auto'
      }}>
        <EditablePreview badValidity={badValidity} blankCells={blankCells} unmappedCols={unmappedCols}/>
      </div>*/}
    </div>
  );
})