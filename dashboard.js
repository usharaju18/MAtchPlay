class Dashboard {
  constructor() {}
  static displayPlayersPer() {
    let players;
    if (localStorage.getItem('players') === null) {
      players = [];
    } else {
      players = JSON.parse(localStorage.getItem('players'));
    }
    if (players.length == 0) {
      document.getElementById('no-data').style.display = 'block';
      document.getElementById('graphical-data').style.display = 'none';
    } else {
      Dashboard.displayPlayertoSport();
      var canvas = document.getElementById('test_pie_canvas');
      var context = canvas.getContext('2d');
      var colors = [
        'blue',
        'red',
        'yellow',
        'green',
        'black',
        'grey',
        'pink',
        'purple',
        'limegreen',
        'Crmison',
      ];
      const locCount = [];
      players.forEach((ele, i) => {
        const iterator = ele.location.values();

        for (const value of iterator) {
          locCount.push(value);
        }
      });

      const count = {};
      locCount.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
      });
      let data = Object.entries(count);
      let dataLength = data.length;
      // declare variable to store the total of all values
      let total = 0;
      var lastend = 0;

      // calculate total
      for (let i = 0; i < dataLength; i++) {
        // add data value to total
        total += data[i][1];
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      var percentRound = [];
      const width = 300;
      const height = 300;
      var hwidth = width / 2;
      var hheight = height / 2;
      console.log(hwidth + ' ' + hheight, 'height');
      for (var i = 0; i < dataLength; i++) {
        var percent = (data[i][1] * 100) / total;
        percentRound.push(Math.round(percent * 100 + Number.EPSILON) / 100);
        context.fillStyle = colors[i];
        context.beginPath();
        context.moveTo(hwidth, hheight);
        context.arc(
          hwidth,
          hheight,
          hheight,
          lastend,
          lastend + Math.PI * 2 * (data[i][1] / total),
          false
        );

        context.lineTo(hwidth, hheight);
        context.fill();

        var radius = hheight / 1.5; //use suitable radius
        var endAngle = lastend + Math.PI * (data[i][1] / total);
        var setX = hwidth + Math.cos(endAngle) * radius;
        var setY = hheight + Math.sin(endAngle) * radius;

        context.rect(400, 40 * i, 15, 15);
        context.fill();
        context.fillStyle = 'black';
        context.fillText(percentRound[i] + '%', setX, setY);
        context.fillText(
          data[i][0] + ' (' + data[i][1] + ')',
          430,
          39 * i + 15
        );

        lastend += Math.PI * 2 * (data[i][1] / total);
      }
    }
  }
  static displayPlayertoSport() {
    let players;
    if (localStorage.getItem('players') === null) {
      players = [];
    } else {
      players = JSON.parse(localStorage.getItem('players'));
    }
    const sportCount = [];
    players.forEach((ele, i) => {
      ele.sportObj = ele.sport.split(',');
      ele.sportObj = ele.sportObj.map((name) => name.trim().toLowerCase());
      const iterator = ele.sportObj.values();

      for (const value of iterator) {
        sportCount.push(value);
      }
    });
    const count = {};
    sportCount.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });
    const data = [];
    const keys = Object.keys(count);
    keys.forEach((key, index) => {
      data.push({ label: `${key}`, value: count[key] });
    });

    console.log(data, 'data');

    new BarChart({
      canvasId: 'test_bar_canvas',
      data: data,
      color: 'red',
      barWidth: 50,
      minValue: 0,
      maxValue: 10,
      gridLineIncrement: 2,
    });
  }
}

function BarChart(config) {
  // user defined properties
  this.canvas = document.getElementById(config.canvasId);
  this.data = config.data;
  this.color = config.color;
  this.barWidth = config.barWidth;
  this.gridLineIncrement = config.gridLineIncrement;

  this.maxValue =
    config.maxValue - Math.floor(config.maxValue % this.gridLineIncrement);
  this.minValue = config.minValue;

  // constants
  this.font = '12pt Calibri';
  this.axisColor = '#555';
  this.gridColor = 'black';
  this.padding = 10;

  // relationships
  this.context = this.canvas.getContext('2d');
  this.range = this.maxValue - this.minValue;
  this.numGridLines = this.numGridLines = Math.round(
    this.range / this.gridLineIncrement
  );
  this.longestValueWidth = this.getLongestValueWidth();
  this.x = this.padding + this.longestValueWidth;
  this.y = this.padding * 2;
  this.width = this.canvas.width - (this.longestValueWidth + this.padding * 2);
  this.height =
    this.canvas.height - (this.getLabelAreaHeight() + this.padding * 4);

  // draw bar chart
  this.drawGridlines();
  this.drawYAxis();
  this.drawXAxis();
  this.drawBars();
  this.drawYVAlues();
  this.drawXLabels();
}

BarChart.prototype.getLabelAreaHeight = function () {
  this.context.font = this.font;
  var maxLabelWidth = 0;

  for (var n = 0; n < this.data.length; n++) {
    var label = this.data[n].label;
    maxLabelWidth = Math.max(
      maxLabelWidth,
      this.context.measureText(label).width
    );
  }

  return Math.round(maxLabelWidth / Math.sqrt(2));
};

BarChart.prototype.getLongestValueWidth = function () {
  this.context.font = this.font;
  var longestValueWidth = 0;
  for (var n = 0; n <= this.numGridLines; n++) {
    var value = this.maxValue - n * this.gridLineIncrement;
    longestValueWidth = Math.max(
      longestValueWidth,
      this.context.measureText(value).width
    );
  }
  return longestValueWidth;
};

BarChart.prototype.drawXLabels = function () {
  var context = this.context;
  context.save();
  var data = this.data;
  var barSpacing = this.width / data.length;

  for (var n = 0; n < data.length; n++) {
    var label = data[n].label;
    context.save();
    context.translate(
      this.x + (n + 1 / 2) * barSpacing,
      this.y + this.height + 10
    );
    context.rotate((-1 * Math.PI) / 4); // rotate 45 degrees
    context.font = this.font;
    context.fillStyle = 'black';
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    context.fillText(label, 0, 0);
    context.restore();
  }
  context.restore();
};

BarChart.prototype.drawYVAlues = function () {
  var context = this.context;
  context.save();
  context.font = this.font;
  context.fillStyle = 'black';
  context.textAlign = 'right';
  context.textBaseline = 'middle';

  for (var n = 0; n <= this.numGridLines; n++) {
    var value = this.maxValue - n * this.gridLineIncrement;
    var thisY = (n * this.height) / this.numGridLines + this.y;
    context.fillText(value, this.x - 5, thisY);
  }

  context.restore();
};

BarChart.prototype.drawBars = function () {
  var context = this.context;
  context.save();
  var data = this.data;
  var barSpacing = this.width / data.length;
  var unitHeight = this.height / this.range;

  for (var n = 0; n < data.length; n++) {
    var bar = data[n];
    var barHeight = (data[n].value - this.minValue) * unitHeight;

    if (barHeight > 0) {
      context.save();
      context.translate(
        Math.round(this.x + (n + 1 / 2) * barSpacing),
        Math.round(this.y + this.height)
      );

      context.scale(1, -1);

      context.beginPath();
      context.rect(-this.barWidth / 2, 0, this.barWidth, barHeight);
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    }
  }
  context.restore();
};

BarChart.prototype.drawGridlines = function () {
  var context = this.context;
  context.save();
  context.strokeStyle = this.gridColor;
  context.lineWidth = 2;

  // draw y axis grid lines
  for (var n = 0; n < this.numGridLines; n++) {
    var y = (n * this.height) / this.numGridLines + this.y;
    context.beginPath();
    context.moveTo(this.x, y);
    context.lineTo(this.x + this.width, y);
    context.stroke();
  }
  context.restore();
};

BarChart.prototype.drawXAxis = function () {
  var context = this.context;
  context.save();
  context.beginPath();
  context.moveTo(this.x, this.y + this.height);
  context.lineTo(this.x + this.width, this.y + this.height);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();
  context.restore();
};

BarChart.prototype.drawYAxis = function () {
  var context = this.context;
  context.save();
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x, this.height + this.y);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();
  context.restore();
};

// Event: Display Players
document.addEventListener('DOMContentLoaded', Dashboard.displayPlayersPer);
