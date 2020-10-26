import React from 'react';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {setState, store, useSelector} from "../../../lib/store";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";

export default function SelectTemplate() {
  let { templates } = useSelector(s => s);

  let [searchVal, setSearchVal] = React.useState("");
  let [slugs, setSlugs] = React.useState([""]);

  React.useEffect(function () {
    let newSlugs = templates.id.map((edge, index) => {
      return `${templates.data[index].name} ${edge}`;
    });

    // @ts-ignore
    setSlugs(newSlugs);
  }, [templates]);

  return (
    <Card style={{
      width: '90%',
      margin: '64px auto'
    }}>
      <CardHeader title={"Select Templates"}/>
      <CardContent>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3>Available Templates ({templates.id.length - templates.selected.length})</h3>
          </AccordionSummary>
          <AccordionDetails style={{
            display: 'block'
          }}>
            <TextField style={{
              width: '100%',
              margin: '0 0 18px 0'
            }} label={"Search templates by name/id"} variant={'outlined'} value={searchVal} onChange={event => {
              setSearchVal(event.target.value);
            }}/>
            {(templates.id.length > 0) ? null : (
              <h4>(No available templates)</h4>
            )}
            {
              templates.id.map((edge: any, index: any) => {

                let isSelected = templates.selected.includes(templates.id[index]);

                if ((searchVal.trim().length > 0) && !slugs[index].toLowerCase().includes(searchVal.toLowerCase()))
                {
                  return null;
                }

                return(
                  <div className={'selectable-template ' + (isSelected ? 'selectable-template-disabled' : '')} onClick={event => {
                    let newTemplates = templates.selected;

                    if (!isSelected)
                    {
                      newTemplates.push(templates.id[index]);

                      store.dispatch(setState({
                        templates: {
                          selected: newTemplates,
                          ...templates
                        }
                      }));
                    }
                    else
                    {
                      let activeIndex = templates.selected.indexOf(edge);

                      newTemplates.splice(activeIndex, 1);

                      store.dispatch(setState({
                        templates: {
                          selected: newTemplates,
                          ...templates
                        }
                      }));
                    }
                  }}>
                    {templates.data[index].name}
                    &nbsp;
                    <span style={{
                      fontSize: '10px',
                      color: '#a6a6a6'
                    }}>
                      ({edge})
                    </span>
                  </div>
                );
              })
            }
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3>Active Templates ({templates.selected.length})</h3>
          </AccordionSummary>
          <AccordionDetails style={{
            display: 'block'
          }}>
            {templates.selected.length > 0 ? '' : (
              <h4>(No active templates)</h4>
            )}
            {
              templates.selected.map((edge, index) => {
                let itemIndex = templates.id.indexOf(edge);
                let name = templates.data[itemIndex].name

                return(
                  <div className={'active-template'} onClick={event => {
                    let newTemplates = templates.selected;

                    newTemplates.splice(index, 1);

                    store.dispatch(setState({
                      templates: {
                        selected: newTemplates,
                        ...templates
                      }
                    }));
                  }}>{name} ({edge})</div>
                );
              })
            }
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}