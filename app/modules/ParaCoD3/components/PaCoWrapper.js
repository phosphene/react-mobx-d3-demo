import PaCoD3 from './PaCoD3';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

class PaCoWrapper extends React.Component {

    constructor(props) {
        super(props);
        //console.log(props);

    }

    render() {


        return (
           <div>
             <ThemeChooser style={{display: 'inline'}}/> <span style={{fontSize: '1.0em'}}> This is the ThemeChooser Component</span>
            <div className="container-fluid">
              <div id="parallel-coords"></div>
            </div>
           </div>
        );

    }


    componentDidMount() {
        this.chart = new PaCoD3();
        this.chart.render();

    }

    componentDidUpdate() {
        //   this.chart.update();
    }


    componentWillUnmount() {
        // this.dashboard.destroy();
    }

}

export default PaCoWrapper;
