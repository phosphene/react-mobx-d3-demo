import React, { Component } from 'react';
import { Link } from 'react-router';
import { action } from 'mobx';
import { observer } from 'mobx-react';
//import styles from './styles.css';
import { ThemeSwitcher, ThemeChooser } from 'react-bootstrap-theme-switcher';

@observer(["timerStore"])
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.timerStore;
  }

  componentDidMount() {
    this.store.startTimer();
  }

  componentWillUnmount() {
    this.store.stopTimer();
  }

  render() {
    return (
      <div>
          <ThemeSwitcher themePath="themes" defaultTheme="yeti" storeThemeKey="theme">

      <div>
       <ThemeChooser/>
        <div>Welcome to a basic sample app with an arbitrary timer. The header nav has links to visualizations</div>

        <h1>
          <span>Timer:</span>
          <span> {this.store.counter}</span>
        </h1>
        <button
          onClick={this.store.reset}

        >Reset</button>
        <button
          onClick={this.store.decrement}

        >-10</button>
        <button
          onClick={this.store.increment}

        >+10</button>
      </div>
      </ThemeSwitcher>
     </div>
    );
  }
}

export store from './store';
