import BarChartStack from './BarChartStack';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';


export default class StackWrap extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="container-fluid">
      <svg width="960" height="500"></svg>
      </div>
    );

  }

  componentDidMount() {
    this.chart = new BarChartStack();
    this.chart.render();

  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

}
