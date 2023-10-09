
const w = 960;
const h = 500;
const padding = [80, 40];

const svg = d3.select(".graph_container").append("svg").attr("width", w).attr("height", h);
var tooltip = d3.select('.graph_container').append('div').attr('id', 'tooltip')
                .style('opacity', 0);
var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then(data => {
  var xScale = d3
    .scaleLinear()
    .domain([
      d3.min (data, d => d.Year - 1), d3.max (data, d => d.Year + 1)
    ])
    .range([padding[0], w-padding[0]/2]);

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  svg.append('g')
    .attr("transform", "translate(0," + (h - padding[1]) + ")")
    .attr('id', 'x-axis')
    .call(xAxis)

  var yScale = d3.scaleLinear().domain([
    d3.min (data, d => d.Seconds - 10)*1000, d3.max (data, d => d.Seconds + 10)*1000
  ]).range([h-padding[1], padding[1]]);

  var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate('+ padding[0] +', 0)');

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => {
      console.log (d.Seconds, yScale(d.Seconds*1000));
      return yScale(d.Seconds*1000);
    })
    .attr("r", 7)
    .attr("fill", d => color(d.Doping != ""))
    .attr("class", "dot")
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => new Date(1970, 0, 1, 0, (d.Seconds - d.Seconds % 60) / 60, d.Seconds % 60))
    .on('mouseover', (event, d) => {
      tooltip.style('opacity', 0.9);
      tooltip.attr('data-year', d.Year);
      tooltip
        .html(
          "<b>" + d.Name + ': ' + d.Nationality + '<br/>' +
          'Year: ' + d.Year + ', Time: ' + d.Time + "</b>" +
          (d.Doping ? '<br/><br/>' + d.Doping : '')
        )
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('opacity', 0);
    });

    var legendContainer = svg.append('g').attr('id', 'legend');

    var legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(-20,' + (h / 2 - i * 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', w - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', w - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text( (d) => {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });

  /*let GDP = data.data.map (p => p[1]);
  let barWidth = (w -padding[0]*2) / GDP.length;

  var xScale = d3
    .scaleTime()
    .domain([new Date(data.data[0][0]), new Date(data.data[data.data.length-1][0])])
    .range([padding[0], w-padding[0]/2]);

  var xAxis = d3.axisBottom().scale(xScale);

  svg.append('g')
    .attr("transform", "translate(0," + (h - padding[1]) + ")")
    .attr('id', 'x-axis')
    .call(xAxis)

  var yAxisScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([h-padding[1], padding[1]]);

  var yAxis = d3.axisLeft(yAxisScale);

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate('+ padding[0] +', 0)');

  var linearScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([padding[1], h-padding[1]]);

  svg.selectAll("rect")
    .data(GDP)
    .enter()
    .append("rect")
    .attr('data-date', (d, i) => data.data[i][0])
    .attr('data-gdp', d => d)
    .attr("x", (d, i) => xScale (new Date(data.data[i][0])))
    .attr("y", (d, i) => h - linearScale(d))
    .attr("width", barWidth - 0.5)
    .attr("height", (d, i) => linearScale(d)-padding[1])
    .attr("fill", "#33adff")
    .attr("class", "bar")
    .attr('index', (d, i) => i)
    .on('mouseover', function (event, d) {
      var i = this.getAttribute('index');
      var d = this.getAttribute('data-date').split("-");
      var quartal = d[0] + " " + Q[parseInt (d[1])];
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          quartal + "<br>$" + GDP[i] + " Billion"
        )
        .attr('data-date', data.data[i][0])

    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });

    svg.append('text')
       .attr('transform', 'rotate(-90)')
       .attr('x', -210)
       .attr('y', 100)
       .text('Gross Domestic Product')
       .attr('class', 'svg-text');

    svg.append('a')
      .attr('href', 'http://www.bea.gov/national/pdf/nipaguid.pdf')
      .append('text')
      .attr('x', w / 2 + 120)
      .attr('y', h)
      .attr('text-anchor', 'end')
      .text(data.source_name)
      .attr('class', 'svg-text');
*/
}).catch(e => console.log(e));
