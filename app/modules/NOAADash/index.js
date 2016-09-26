import React, { Component } from 'react';
import NOAAWrapper from './components/NOAAWrapper';
import { ThemeSwitcher} from 'react-bootstrap-theme-switcher';
/* This file can serve as the index for this level of component namespace
 * it is currently being used that way as a convenient way to develop
 * It is here as a design choice*/
//we are currently not using observers
//@observer(["NOAAStore"])
export default class NOAADash extends Component {
  componentDidMount() {
    //this.props.NOAAStore.getDataFromServer();
  }

  render() {
    let themes = ['slate', 'cyborg', 'darkly', 'superhero'];

    return (
      <ThemeSwitcher themePath="/themes" defaultTheme="cyborg" storeThemeKey="noaa_theme" themes={themes}>
        <NOAAWrapper/>
      </ThemeSwitcher>
    );
  }
}
