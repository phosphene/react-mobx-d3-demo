import BarChartStack from './BarChartStack';
import StackedBarExample from './StackedBarExample';
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
    this.chart = new StackedBarExample();
    this.chart.render();

  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

}
