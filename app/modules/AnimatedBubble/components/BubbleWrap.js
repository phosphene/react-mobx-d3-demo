import ClusterBubbleD3 from './ClusterBubbleD3';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';


class BubbleWrap extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (
      <div id="bubble">
      </div>
    );

  }

  componentDidMount() {
    this.chart = new ClusterBubbleD3();
    this.chart.render();

  }

  componentDidUpdate() {
    //   this.chart.update();
  }

  componentWillUnmount() {
    // this.dashboard.destroy();
  }

}

export default BubbleWrap;
