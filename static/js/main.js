let dimensions = {
  map: {
    width: document.getElementById('map-canvas').offsetWidth,
    height: document.getElementById('map-canvas').offsetHeight
  },
  tree: {
    width: document.getElementById('tree-container').offsetWidth,
    height: document.getElementById('tree-container').offsetHeight
  },
  timeline: {
    width: document.getElementById('timeline-container').offsetWidth,
    height: document.getElementById('timeline-container').offsetHeight
  }
}

$(document).ready(function () {
  $('#infoModal').modal();
  $('#m1').modal({
    dismissible: false
  });
  $('#m1').modal('open');
  $('.tabs').tabs('select', 'overview');
});



let chartNo = 0


const dispatch = d3.dispatch("timelineBrushed", "openBranch", "switchTab", "mapped", "unmapped", "chartCreated", "pinned", "unpinned", "hover", "unhover");

dispatch.on('chartCreated.main', function () {
  chartNo += 1;
});

const uploadModal = document.getElementById('uploadModal');
const uploadButton = document.getElementById('drop_zone');
const realInput = document.getElementById('file');

uploadButton.addEventListener('click', () => {
  realInput.click();
});

function post(data) {
  d3.select('#loadingText').html('Loading');
  d3.select('#loadingSpinner').style('display', 'inline')
  $.ajax({
    url: "/parse",
    type: "POST",
    data: data,
    processData: false,
    contentType: false,
    success: function (results, status) {
      d3.select('#loadingText').html('Plotting');
      //console.log('POST', JSON.parse(results));
      d3.selectAll("#tree").selectAll('li').remove();
      d3.selectAll(".card-panel").remove();
      d3.selectAll("svg").remove();
      let data = JSON.parse(results)
      const map = Map(dispatch, data, dimensions);
      const timeline = Timeline(dispatch, data, dimensions);
      const tree = Tree(dispatch, data, dimensions);
      const overview = Overview(dispatch, data, dimensions);
      d3.select('#curtain').remove();
      $('#m1').modal({
        dismissible: true
      });
      $('#m1').modal('close');
      d3.select('#loadingText').html('');
      d3.select('#loadingSpinner').style('display', 'none')
    }

  });
}

document.getElementById("file").onchange = function () {
  var $form = document.getElementById("uploadForm")
  var file = document.getElementById('file').files[0];
  var formData = new FormData();
  formData.append('file', file);
  post(formData);
};

function dropHandler(ev) {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        var formData = new FormData();
        formData.append('file', file);
        post(formData);
      }
    }
  }
}


d3.select('#drop_zone')
  .on('mouseover', function () {
    d3.select(this).style("background", 'rgba(22, 19, 46, 0.2)')
  })
  .on('mouseout', function () {
    d3.select(this).style("background", '#FAFAFA')
  })

function dragOverHandler(ev) {
  d3.select('#drop_zone').style("background", 'rgba(22, 19, 46, 0.2)')
  ev.preventDefault();
}

function dragOutHandler(ev) {
  d3.select('#drop_zone').style("background", '#FAFAFA')
  ev.preventDefault();
}

function loadDemo(e) {
  e.stopPropagation();
  d3.select('#loadingText').html('Loading');
  d3.select('#loadingSpinner').style('display', 'inline')
  d3.json('static/data/data.json').then(function (data) {
    d3.select('#loadingText').html('Ploting');
    d3.selectAll("#tree").selectAll('li').remove();
    d3.selectAll(".card-panel").remove();
    d3.selectAll("svg").remove();
    const map = Map(dispatch, data, dimensions);
    const timeline = Timeline(dispatch, data, dimensions);
    const tree = Tree(dispatch, data, dimensions);
    const overview = Overview(dispatch, data, dimensions);
    d3.select('#curtain').remove();
    $('#m1').modal({
      dismissible: true
    });
    $('#m1').modal('close');
    d3.select('#loadingText').html('');
    d3.select('#loadingSpinner').style('display', 'none')
  });
}



let el = document.querySelector('.tabs');
var instance2 = M.Tabs.init(el, {});

console.log(dimensions);

let topButton = document.getElementById('top');
topButton.addEventListener('click', function () {
  document.getElementById('tree-container').scrollTop = 0;
});
