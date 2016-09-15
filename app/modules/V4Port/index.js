import React, { Component } from 'react';
//import { observer } from 'mobx-react';
//import DashWrap from './components/DashWrap';
//import CrossWrap from './components/CrossWrap';
//import BrushWrap from './components/BrushWrap';
import StackWrap from './components/StackWrap';
/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//@observer(["noteStore"])
export default class V4Port extends Component {
  componentDidMount() {
    //this.props.noteStore.getNotesFromServer();
  }

  render() {
    return (
     <StackWrap/>
    );
  }
}

//export store from './store';
