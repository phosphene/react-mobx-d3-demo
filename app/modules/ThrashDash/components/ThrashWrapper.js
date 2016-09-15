import ThrashDashDC from './ThrashDashDC';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';


class ThrashWrapper extends React.Component {

    constructor(props) {
        super(props);
        //console.log(props);

    }

    render() {

        const pStyle = { marginRight: "15px"};
        {/*const cursorStyle = { display: 'none', cursor: 'pointer'};*/}
        const cursorStyle = { visibility: 'hidden', cursor: 'pointer'};
        const borderStyle = { borderStyle: 'dotted', marginTop: '30px' };

        const clickReset = (x) => {
          //console.log(x);
          this.dashboard.resetChart(x);
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-4">
                        <div id="chart-bubble-stick-fun-hollow"></div>
                    </div>
                    <div className="col-xs-4">
                        <div id="chart-bubble-stick-fun-quality"></div>
                    </div>
                    <div className="col-xs-4">
                        <div id="chart-bubble-stick-fun-crowd"></div>
                    </div>
               </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div id="chart-ring-year">
                            <strong>Year</strong>
                            <a className="reset" onClick={()=>clickReset("chart-ring-year")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="col-xs-2">
                        <div id="chart-ring-month">
                            <strong>Month</strong>
                            <a className="reset" onClick={()=>clickReset("chart-ring-month")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="col-xs-2">
                        <div id="chart-ring-day">
                            <strong>Month</strong>
                            <a className="reset" onClick={()=>clickReset("chart-ring-day")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <div className="dc-chart" id="chart-bar-fun-factor">
                            <a className="reset" onClick={()=>clickReset("chart-bar-fun-factor")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <div className="dc-chart" id="chart-bar-crowd-factor">
                            <a className="reset" onClick={()=>clickReset("chart-bar-crowd-factor")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <div className="dc-chart" id="chart-bar-hollow-factor">
                            <a className="reset" onClick={()=>clickReset("chart-bar-hollow-factor")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <div className="dc-chart" id="chart-bar-quality-factor">
                            <a className="reset" onClick={()=>clickReset("chart-bar-quality-factor")} style={cursorStyle}> reset</a>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }


    componentDidMount() {
        this.dashboard = new ThrashDashDC();
        this.dashboard.render();

    }

    componentDidUpdate() {
        //   this.chart.update();
    }


    componentWillUnmount() {
        // this.dashboard.destroy();
    }

}

export default ThrashWrapper;
