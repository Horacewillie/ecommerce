import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleUp} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons"

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { Collapse } from "@material-ui/core";

library.add(faAngleUp, faAngleDown)

class CollapseCheckbox extends Component {
  state = {
    open: false,
    checked: [],
  };

  componentDidMount() {
    if (this.props.initState) {
      this.setState({
        open: this.props.initState,
      });
    }
  }

  handleClick = () => {
    this.setState({
        open: !this.state.open
    })
  }

  handleAngle = () => (
      <FontAwesomeIcon 
      icon={this.state.open ? faAngleUp : faAngleDown}  
      className = 'icon'
      />
  );

  renderList = () => (
    this.props.list ?
      this.props.list.map((value) => (
        <ListItem key = {value._id} style = {{padding: '10px 0'}}>
          <ListItemText primary = {value.name}/>
          <ListItemSecondaryAction>
          <Checkbox
                color = 'primary'
                onChange = {() => this.toggleCheck(value._id)}
                //will be checked if its inside the checked array
                checked = {this.state.checked.indexOf(value._id) !== -1}
              />
          </ListItemSecondaryAction>
        </ListItem>
      )) 
    : null
  )

  toggleCheck = (value) => {
    const {checked} = this.state
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    

    if(currentIndex === -1){
      newChecked.push(value)
    }else{
      newChecked.splice(currentIndex, 1)
    }
    this.setState({
      checked: newChecked
    }, () => {
      this.props.handleFilters(newChecked)
    })
  }

  render() {
    return (
      <div className="collapse_items_wrapper">
        <List style={{ borderBottom: "1px solid #dbdbdb" }}>
          <ListItem
            onClick={this.handleClick}
            style={{ padding: "10px 23px 10px 0" }}
          >
            <ListItemText
              primary={this.props.title}
              className="collapse_title"
            />
            {this.handleAngle()}
          </ListItem>
          <Collapse in = {this.state.open} timeout = 'auto' unmountOnExit>
             <List component = 'div' disablePadding>
               {this.renderList()}
             </List>
          </Collapse>
        </List>
      </div>
    );
  }
}

export default CollapseCheckbox;
