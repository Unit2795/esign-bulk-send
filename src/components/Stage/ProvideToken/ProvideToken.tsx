import React from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {setState, STAGE, store} from "../../../lib/store";
import './ProvideToken.sass';
import LinearProgress from "@material-ui/core/LinearProgress";

export default function ProvideToken() {
  let [tokenInput, setTokenInput] = React.useState();

  return (
    <Grid container className="token-body">
      <Grid item md={6} style={{
        padding: '24px'
      }}>
        <h1>eSign Genie Tabular Bulk Send</h1>
        <p style={{
          textAlign: "left",
          textIndent: '32px'
        }}>Send thousands of documents using table data (XLSX, ODS, CSV, and TSV). Associate your columns with party information or pre-populate fields. Based on the number of parties provided in a row, templates with a matching party count are sent. If none are found, nothing is sent.</p>
      </Grid>
      <Grid item md={6} style={{
        padding: '24px'
      }}>
        <div>
          <h2>To get started, login</h2>
        </div>
        <a href={"https://www.esigngenie.com/esign/oauth2/authorize?client_id=714faa1b9b7a44d88d70cadf5ac58f7b&redirect_uri=https://localhost:3001&scope=read-write&response_type=code&state=state"} style={{
          textDecoration: 'none'
        }}>
          <Button style={{
            background: 'linear-gradient(#0b5a8e, #083c5e, #0b5a8e)',
            color: '#2ba0ee',
            fontFamily: "'Nunito', sans-serif",
            textShadow: '1px 1px #020f18'
          }} variant="contained" startIcon={<img src={"https://cdn.djoz.us/esign/icon-svg.svg"} height={"40px"} style={{
            paddingRight: '16px',
            borderRight: '#0f77bd solid 1px'
          }}/>}>
            Login with eSign Genie
          </Button>
        </a>
        {/*<div>
          <TextField fullWidth label={"Access Token"} variant={'outlined'} value={tokenInput} onChange={event => {
            setTokenInput(event.target.value);

            store.dispatch(setState({
              token: (event.target.value.length === 32) ? event.target.value : ""
            }));
          }}/>
        </div>*/}
      </Grid>
    </Grid>
  );
}