import React from 'react';
import {template} from "../../../lib/esign-genie/template";
import {setState, store, useSelector} from "../../../lib/store";
import Button from "@material-ui/core/Button";
import LinearProgress from '@material-ui/core/LinearProgress';

export default function Transmit() {
  let {sendProgress, interruptTransmit, result} = useSelector(s => s);

  return (
    <div className={'transmit-body'} style={{
      textAlign: "center"
    }}>
      <p style={{
        color: 'lime'
      }}><b>{result.success}</b> folder{result.success === 1 ? "" : "s"} created successfully</p>
      <p style={{
        color: "red"
      }}><b>{result.error}</b> error{result.error === 1 ? "" : "s"}</p>
      <h2>{sendProgress}% complete{interruptTransmit ? <span style={{color: "red"}}>(cancelled)</span>: ""}</h2>
      <LinearProgress variant="determinate" value={sendProgress} style={{
        display: sendProgress === -1 ? "none" : 'block'
      }}/>

      <Button disabled={interruptTransmit || (sendProgress === 100)} variant={'contained'} color={"secondary"} onClick={event => {
        store.dispatch(setState({
          interruptTransmit: true
        }));
      }} style={{
        marginTop: '64px'
      }}>Cancel Transmission</Button>
    </div>
  );
}