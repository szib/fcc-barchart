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
      let formatCurrency = d3.format("$,.2f");
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      let margin = {
          top: 50,
          right: 40,
          bottom: 30,
          left: 75
        }

      let width = 1000 - margin.left - margin.right
      let height = 600 - margin.top - margin.bottom
      let barWidth = width / data.length

      let y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(data, d => d[1])])

      let x = d3.scaleTime()
          .range([0, width])
          .domain([this.state.minDate, this.state.maxDate])

      let xAxis = d3.axisBottom()
          .scale(x)

      let yAxis = d3.axisLeft()
          .scale(y)

      let chart = d3.select('.chart')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
        .append('g')
          .attr('transform', 'translate(' + margin.left + "," + margin.top + ")" )

      let div = d3.select('.container')
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)

      let bar = chart.selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('y', d => y(d[1]))
          .attr('x', d => x(new Date(d[0])))
          .attr("height", d => height - y(d[1]))
          .attr("width", barWidth - 1)

        bar.on('mouseover', d => {
            var currentDateTime = new Date(d[0]);
            div.transition()
              .duration(200)
              .style("opacity", 0.8);

            div.html("<span class='amount'>" + formatCurrency(d[1]) + "&nbsp;Billion </span><br><span class='year'>" + currentDateTime.getFullYear() + ' - ' + months[currentDateTime.getMonth()] + "</span>")
              .style("left", (d3.event.pageX + 10) + "px")
              .style("top", (d3.event.pageY - 60) + "px");
          })
          .on('mouseout', d => {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          })

      chart.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height +')')
          .call(xAxis)

      chart.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y',6)
          .attr('dy', '0.71em')
          .style('text-anchor', 'end')
          .text('GDP in USD (billion)')

      chart.append('g')
          .attr('class', 'title')
        .append('text')
          .attr('y',0)
          .attr('x',250)
          .text('Gross Domestic Product')
    }

    return (
      <div className="App">
        <div className="container">
          <svg className="chart"></svg>
        </div>
      </div>
    );
  }
}

export default App;
