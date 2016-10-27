import React, { Component } from 'react';
import StGrWrapper from './components/StGrWrapper';
import { ThemeSwitcher} from 'react-bootstrap-theme-switcher';
import './css/stgr.css';

/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//we are currently not using observers
//@observer(["NOAAStore"])
export default class StreamGraph extends Component {
  componentDidMount() {
  }

  render() {
    let themes = ['cerulean', 'default', 'united', 'flatly'];

    return (
      <ThemeSwitcher themePath="/themes" defaultTheme="cerulean" storeThemeKey="pstgr_theme" themes={themes}>
        <StGrWrapper/>
      </ThemeSwitcher>
    );
  }
}
