import NasDashDC from './NasDashDC';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

class NasDashWrapper extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const aStyle = { display: 'none', cursor: 'pointer'};
    const pStyle = { marginRight: "15px"};

    const clickReset = (x) => {
      console.log(x);
      this.dashboard.resetChart(x);
    }


    return (
      <div>
        <ThemeChooser style={{display: 'inline'}}/> <span style={{fontSize: '1.0em'}}> This is the ThemeChooser Component</span>
        <h2>Nasdaq 100 Index 1985/11/01-2012/06/29</h2>
        <table className="table table-hover dc-data-table">
          <div className="row">
            <div id="yearly-bubble-chart" className="dc-chart">
              <strong>Yearly Performance</strong> (radius: fluctuation/index ratio, color: gain/loss)
              <a className="reset" onClick={()=>clickReset("yearly-bubble-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
          </div>
          <div className="row">
            <div id="gain-loss-chart">
              <strong>Days by Gain/Loss</strong>
              <a className="reset" onClick={()=>clickReset("gain-loss-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
            <div id="quarter-chart">
              <strong>Quarters</strong>
              <a className="reset" onClick={()=>clickReset("quarter-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
            <div id="day-of-week-chart">
              <strong>Day of Week</strong>
              <a className="reset" onClick={()=>clickReset("day-of-week-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
            <div id="fluctuation-chart">
              <strong>Days by Fluctuation(%)</strong>
              <span className="reset" style={aStyle}>range: <span className="filter"></span></span>
              <a className="reset" onClick={()=>clickReset("fluctuation-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
          </div>
          <div className="row">
            <div id="monthly-move-chart">
              <strong>Monthly Index Abs Move & Volume/500,000 Chart</strong>
              <span className="reset" style={aStyle}>range: <span className="filter"></span></span>
              <a className="reset" onClick={()=>clickReset("monthly-move-chart")} style={aStyle}>reset</a>
              <div className="clearfix"></div>
            </div>
          </div>
          <div className="row">
            <div id="monthly-volume-chart">
            </div>
            <p className="muted pull-right" style={pStyle}>select a time range to zoom in</p>
          </div>
          <div className="row">
            <div>
              <div className="dc-data-count">
                <span className="filter-count"></span> selected out of
                <span className="total-count"></span> records | <a href="#" onClick={()=>clickReset("all")}>Reset All</a>
              </div>
            </div>
        </table>
          </div>
          <div className="clearfix"></div>
      </div>
    );
  }


  componentDidMount() {
    this.dashboard = new NasDashDC();
    this.dashboard.render();

  }

  componentDidUpdate() {
    //   this.chart.update();
  }

  componentWillUnmount() {
    // this.dashboard.destroy();
  }

}

export default NasDashWrapper;
