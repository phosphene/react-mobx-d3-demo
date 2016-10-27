import StGrD3 from './StGrD3';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

class StGrWrapper extends React.Component {

    constructor(props) {
        super(props);
        //console.log(props);

    }

    render() {


      return (
        <div>
          <ThemeChooser style={{display: 'inline'}}/> <span style={{fontSize: '1.0em'}}> </span>
          <div className="streamgraph">
            <div id="streamgraph"></div>
          </div>
        </div>
      );

    }


    componentDidMount() {
        this.chart = new StGrD3();
        this.chart.render();

    }

    componentDidUpdate() {
        //   this.chart.update();
    }


    componentWillUnmount() {
        // this.dashboard.destroy();
    }

}

export default StGrWrapper;
