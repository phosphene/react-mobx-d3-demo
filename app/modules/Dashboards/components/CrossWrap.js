import CrossDashExample from './CrossDashExample';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

//export is at bottom
class CrossWrap extends React.Component {

  constructor(props) {
    super(props);

  }


  render() {


    return (
      <div className="container-fluid">
        <div id="charts">
          <div id="hour-chart" className="chart">
            <div className="title">Time of Day</div>
          </div>
          <div id="delay-chart" className="chart">
            <div className="title">Arrival Delay (min.)</div>
          </div>
          <div id="distance-chart" className="chart">
            <div className="title">Distance (mi.)</div>
          </div>
          <div id="date-chart" className="chart">
            <div className="title">Date</div>
          </div>
        </div>

        <div id="lists">
          <div id="flight-list" className="list"></div>
        </div>

      </div>
    );

  }

  componentDidMount() {
    this.chart = new CrossDashExample();
    this.chart.render();

  }

  componentDidUpdate() {
    //   this.chart.update();
  }

  componentWillUnmount() {
    // this.dashboard.destroy();
  }

}
// export statement at bottom

export default CrossWrap;
