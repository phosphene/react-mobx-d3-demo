import CaliMapD3 from './CaliMapD3';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

class MapWrapper extends React.Component {

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

            </div>
           </div>
        );

    }


    componentDidMount() {
        this.chart = new CaliMapD3();
        this.chart.render();

    }

    componentDidUpdate() {
        //   this.chart.update();
    }


    componentWillUnmount() {
        // this.dashboard.destroy();
    }

}

export default MapWrapper;
