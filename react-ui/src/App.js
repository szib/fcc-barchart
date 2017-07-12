import React, { Component } from 'react';
import './App.css'

import * as d3 from 'd3'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUrl: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
      data: [],
      minDate: '',
      maxDate: '',
    };
  }

  componentDidMount() {
    let that = this
    fetch(this.state.dataUrl)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error('Bad response from the server')
      }
      return response.json()
    })
    .then(function(d) {
      that.setState({
        data: d.data,
        minDate: new Date(d.data[0][0]),
        maxDate: new Date(d.data[274][0]),
      })
    })
  }

  render() {

    if (this.state.data.length !== 0) {

      let data = this.state.data

      let margin = {
          top: 5,
          right: 10,
          bottom: 30,
          left: 75
        }

      let width = 1000 - margin.left - margin.right
      let height = 1800 - margin.top - margin.bottom
      let barWidth = Math.ceil(width / data.length)
      console.warn(width, height, data.length, barWidth);

      let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) {
          return d[1];
        })]);

      d3.select('.App')
      .append('div')
      .attr('class', 'chart')
      .style('height', x => height)
      .style('width', x => width)
      .style('background-color', '#dddddd')

      d3.select('.chart')
      .selectAll('div')
      .data(data)
        .enter()
        .append('div')
        .attr("class", "bar")
        .style("height", function(d) { return y(d[1]) + "px" })
        .style("width", d => barWidth + "px")
    }

    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
