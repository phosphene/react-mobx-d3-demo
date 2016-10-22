import React, { Component } from 'react';
import PaCoWrapper from './components/PaCoWrapper';
import { ThemeSwitcher} from 'react-bootstrap-theme-switcher';
import './css/parallel.css';

/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//we are currently not using observers
//@observer(["NOAAStore"])
export default class ParaCOD3 extends Component {
  componentDidMount() {
    //this.props.NOAAStore.getDataFromServer();
  }

  render() {
    let themes = ['cerulean', 'default', 'united', 'flatly'];

    return (
      <ThemeSwitcher themePath="/themes" defaultTheme="cerulean" storeThemeKey="paco_theme" themes={themes}>
        <PaCoWrapper/>
      </ThemeSwitcher>
    );
  }
}
