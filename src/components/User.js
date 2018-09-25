import React from 'react';
import {Button,FormControl,Glyphicon} from 'react-bootstrap';

const User = (props) => {
  if(!props.editMode){
    return (
      <li>
      <span className="user-name">{props.children}</span>
      <Button 
        bsStyle="primary" 
        onClick={props.change}
      >Change</Button>
      <Button onClick={props.remove}>
        <Glyphicon glyph="trash" />
      </Button>
      </li>
    )
  } else {
    return (
      <li>
      <FormControl 
        onChange={props.edit}
        value={props.children}
      />
      <Button 
        bsStyle="primary" 
        onClick={props.change}
      >Save</Button>
      </li>
    )
  }
}

export default User;