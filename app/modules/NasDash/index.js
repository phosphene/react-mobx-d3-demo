import React, { Component } from 'react';
import NasDashWrapper from './components/NasDashWrapper';
import { ThemeSwitcher} from 'react-bootstrap-theme-switcher';
import './css/dc.css';
/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//we are currently not using observers
//@observer(["thrashStore"])
export default class NasDash extends Component {
  componentDidMount() {
    //this.props.thrashStore.getDataFromServer();
  }

  render() {
    let themes = ['slate', 'cyborg', 'darkly', 'superhero'];

    return (
     <ThemeSwitcher themePath="/themes" defaultTheme="cyborg" storeThemeKey="nas_theme" themes={themes}>
     <div>
     <NasDashWrapper/>
     </div>
     </ThemeSwitcher>

    );
  }
}

//export store from './store';
