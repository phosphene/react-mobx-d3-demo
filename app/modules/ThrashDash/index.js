import React, { Component } from 'react';
import ThrashWrapper from './components/ThrashWrapper';
import { ThemeSwitcher} from 'react-bootstrap-theme-switcher';
import './css/dc.css';
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
    let themes = ['slate', 'cyborg', 'darkly', 'superhero'];

    return (
     <ThemeSwitcher themePath="/themes" defaultTheme="cyborg" storeThemeKey="thrashtheme" themes={themes}>
     <div>
     <ThrashWrapper/>
     </div>
     </ThemeSwitcher>

    );
  }
}

//export store from './store';
