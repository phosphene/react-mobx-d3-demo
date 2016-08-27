import React, { Component } from 'react';
//import { observer } from 'mobx-react';
//import DashWrap from './components/DashWrap';
import CrossWrap from './components/CrossWrap';
/* This file can serve as the index for this level of component namespace
 * However, it is currently not being used and is redundant
 * It is here as a possible design choice*/
//@observer(["noteStore"])
export default class Dashboards extends Component {
  componentDidMount() {
    //this.props.noteStore.getNotesFromServer();
  }

  render() {
    return (
     <CrossWrap/>
    );
  }
}

//export store from './store';
