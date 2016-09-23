import React, { Component } from 'react';
import '../../shared/css/dc_custom.css';
import ThrashWrapper from './components/ThrashWrapper';
/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//we are currently not using observers
//@observer(["thrashStore"])
export default class ThrashDash extends Component {
  componentDidMount() {
    //this.props.thrashStore.getDataFromServer();
  }

  render() {
    return (
     <ThrashWrapper/>
    );
  }
}

//export store from './store';
