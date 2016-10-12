import NOAADashDC from './NOAADashDC';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

class NOAAWrapper extends React.Component {

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
           <div>
             <ThemeChooser style={{display: 'inline'}}/> <span style={{fontSize: '1.0em'}}> This is the ThemeChooser Component</span>
            <div className="container-fluid">

                <div className="row">
                    <div className="col-xs-4">
                        <div id="chart-height"></div>
                    </div>
                    <div className="col-xs-4">
                        <div id="chart-period"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div id="chart-month-move"></div>
                    </div>
                </div>
            </div>
           </div>
        );

    }


    componentDidMount() {
        this.dashboard = new NOAADashDC();
        this.dashboard.render();

    }

    componentDidUpdate() {
        //   this.chart.update();
    }


    componentWillUnmount() {
        // this.dashboard.destroy();
    }

}

export default NOAAWrapper;
