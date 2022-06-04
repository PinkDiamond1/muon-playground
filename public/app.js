var time
var result
var interval
var shareUrl
var elapsedTime
var requestStatus
var resultHeaders
var selectedRequest
var Object_ = {}
var Obj = {}
var Object_ = { name: '', url:'', method: '', data: '' }
var checkList = []
var requestsHistory = []

var slug = window.location.pathname
slug = slug.split("/").pop();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('run')

const checkUrlSlug = async (params) => {
  await axios.post('/getDataByName', params)
    .then(response => {
      if (response.data.response == null) {
        window.location.replace("https://playground.muon.net/");
        return Swal.fire({
          title: 'Error!',
          text: 'Invalid Slug',
          icon: 'error',
          timer: 1700,
        })
      
      }
      else{
        getRequestByName({name: slug})
      }
    }
  )
  .catch(err => console.log(err))
}

if (slug.length > 0){
  checkUrlSlug({name: slug})
}

var editor = ace.edit("editor");
var editorResult = ace.edit( "editorResult" );

editor.getSession().setMode( { path: "ace/mode/javascript", inline: true } );
editor.setOptions({
  value: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
})

editorResult.getSession().setMode( { path: "ace/mode/javascript", inline: true } );
editorResult.setReadOnly(true);

window.draggingAceEditor = {};

function makeAceEditorResizable(editor){
    var id_editor = editor.container.id;
    var id_dragbar = '#' + id_editor + '_dragbar';
    var id_wrapper = '#' + id_editor + '_wrapper';
    var wpoffset = 0;
    window.draggingAceEditor[id_editor] = false;

    $(id_dragbar).mousedown(function(e) {
        e.preventDefault();

        window.draggingAceEditor[id_editor] = true;
    
        var _editor = $('#' + id_editor);
        var top_offset = _editor.offset().top - wpoffset;
    
        // Set editor opacity to 0 to make transparent so our wrapper div shows
        _editor.css('opacity', 0);
    
        // handle mouse movement
        $(document).mousemove(function(e){
            var actualY = e.pageY - wpoffset;
            // editor height
            var eheight = actualY - top_offset;
            
            // Set wrapper height
            $(id_wrapper).css('height', eheight);
            
            // Set dragbar opacity while dragging (set to 0 to not show)
            $(id_dragbar).css('opacity', 0.15);
        });
    });
    
    $(document).mouseup(function(e){
        if (window.draggingAceEditor[id_editor])
        {
            var ctx_editor = $('#' + id_editor);
    
            var actualY = e.pageY - wpoffset;
            var top_offset = ctx_editor.offset().top - wpoffset;
            var eheight = actualY - top_offset;
    
            $( document ).unbind('mousemove');
            
            // Set dragbar opacity back to 1
            $(id_dragbar).css('opacity', 1);
            
            // Set height on actual editor element, and opacity back to 1
            ctx_editor.css('height', eheight).css('opacity', 1);
            
            // Trigger ace editor resize()
            editor.resize();

            window.draggingAceEditor[id_editor] = false;
        }
    });
}

makeAceEditorResizable(editorResult);
makeAceEditorResizable(editor);

$(document).click(function(e){
  if($(e.target).closest('.update-request').length != 0) return false;
  $('#save-request-box').hide();
});

function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
  } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
      });
  }
}

const getUrlText = (element) =>{
  let text = $(element).val()
  copyToClipboard(text)
      .then(() => console.log('text copied !'))
      .catch(() => console.log('error'));
}

$('#result-active').on('click', function() {
  try{
    editorResult.setValue(JSON.stringify(result, null, '\t'));
    editorResult.clearSelection()
  }
  catch{
    editorResult.setValue('');
  }
	// console.log(result)
})

function setObjectValues () {
  url = $('#urlInput').val()
  method = $('#request-method').val()
  uniqueSlug = $('#unique-slug').val().trim()
  uniqueSlug = uniqueSlug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  try{
    Obj = JSON.parse(editor.getValue())
  }
  catch{
    Obj = {}
  }
  Object_.name = uniqueSlug
  Object_.url = url
  Object_.method = method
  Object_.data = Obj
  Object_.title = uniqueSlug
  Object_.slug  = uniqueSlug
}

function catchOrders() {
  requestStatus == null ? requestStatus = 'null' : null
  $('#status').html(requestStatus)
  clearInterval(interval)
  $('#status').removeClass('btn btn-success btn-warning')
  $('#status').addClass('btn btn-danger')
  $('#timer').html('Duration: ' + time)
  return false 
}

function successOrders() {
  $('#status').html(requestStatus)
  let headersKey = Object.keys(resultHeaders)
  headersKeyLen = headersKey.length
  $('#headers-tab').text(headersKeyLen)
  $('#headers li').remove()
  headersKey.map((item) => {
  $('#headers').append(`<li id='headers-data'>${item}: ${resultHeaders[item]}</li>`)
  })
  $('#status').removeClass('btn btn-danger btn-warning btn-success')
  requestStatus == '201' ? $('#status').addClass('btn btn-warning') : $('#status').addClass('btn btn-success')
  $('#save').removeClass('d-none')
  clearInterval(interval)
  $('#timer').html('Duration: ' + time)
  editorResult.setValue(JSON.stringify(result, null, '\t'));
  editorResult.clearSelection()
}

$('#muonize').on('click', async function() {
  fetchData()
})

const fetchData = async () => {
  setObjectValues()
  if (url.trim().length == 0 ) { return Swal.fire({
    title: 'Error!',
    text: 'Please enter api link!',
    icon: 'error',
    timer: 2000,
  })}
  var startTime = Date.now();
  editorResult.setValue("");
  editorResult.clearSelection()
  interval = setInterval(function() {
    elapsedTime = Date.now() - startTime;
    $('#timer').removeClass('d-none')
    // $('#save').addClass('d-none')
    document.getElementById("timer").innerHTML = 'In Progress: ' + (elapsedTime / 1000).toFixed(3);
    time = (elapsedTime / 1000).toFixed(3)
  }, 100);

  switch(method){
    case 'post':
      return await axios.post(url, Obj)
          .then(function (response) {
            resultHeaders =  response.headers
            requestStatus = response.status
            result = response.data
            successOrders()
          })
          .catch(function (error) {
            requestStatus = error.toJSON().status
            catchOrders()
          });
      case 'get':
        return await axios.get(url)
          .then(function (response) {
            resultHeaders =  response.headers
            requestStatus = response.status
            result = response.data
            successOrders()
          })
          .catch(function (error) {
            requestStatus = error.toJSON().status
            catchOrders()
          });
      // case 'put':
      //   return await axios.get(url)
      //     .then(function (response) {
      //       clearInterval(interval)  
      //       $('#timer').html('Duration: ' + time)
      //       result = response.dat
      //         editorResult.setValue(JSON.stringify(result, null, '\t'));
      //     })
      //     .catch(function (error) {
      //       clearInterval(interval)
      //       $('#timer').html('Duration: ' + time)
      //     });
      // case 'head':
      //   return await axios.get(url)
      //     .then(function (response) {
      //       clearInterval(interval)  
      //       result = response.dat
      //         editorResult.setValue(JSON.stringify(result, null, '\t'));
      //     })
      //     .catch(function (error) {
      //       clearInterval(interval)
      //     });
      // case 'delete':
      //   return await axios.get(url)
      //     .then(function (response) {
      //       clearInterval(interval)  
      //       result = response.dat
      //         editorResult.setValue(JSON.stringify(result, null, '\t'));
      //     })
      //     .catch(function (error) {
      //       clearInterval(interval)
      //     });
      // case 'patch':
      //   return await axios.get(url)
      //     .then(function (response) {
      //       clearInterval(interval)  
      //       result = response.dat
      //       editorResult.setValue(JSON.stringify(result, null, '\t'));
      //     })
      //     .catch(function (error) {
      //       clearInterval(interval)
      //     });
      // case 'purge':
      //   return await axios.get(url)
      //     .then(function (response) {
      //       clearInterval(interval)
      //       result = response.data
      //       editorResult.setValue(JSON.stringify(result, null, '\t'));
      //     })
      //     .catch(function (error) {
      //       clearInterval(interval)
      //     });
  }
}

// function saveStaticDataToFile() {
//   if (!result || result == '' ) {return}
//   var blob = new Blob([JSON.stringify(result, null, '\t')],
//       { type: "text/plain;charset=utf-8" });
//   saveAs(blob, "response.json");
// }

// function listOfSavedRequest(){
//   $('#requests-item option').remove()
//   $('#requests-item').append(`<option value="" hidden>requests</option>`)
//   axios.get('/api/data')
//     .then(response => requestsHistory = response.data.response.map((e) => {
//       if (e.name == '' || e.name == undefined || e.name.trim().length == 0){console.log('null')}
//         else{
//           $('#requests-item').append(`<option value="${e._id}">${e.name}</option>`)
//         }
// 	// console.log(e.name)
//         return e.name
//     }))
// }

const checkData = () => {
  setObjectValues()
  if(Object_.name.trim().length == 0 || Object_.name == '') {
    return Swal.fire({
      title: 'Error!',
      text: 'Please enter slug',
      icon: 'error',
      timer: 1700,
    })
  }
  if(Object_.url.trim().length == 0 || Object_.url == '') {
    return Swal.fire({
      title: 'Error!',
      text: 'Please enter api link',
      icon: 'error',
      timer: 1700,
    })
  }
  if(!checkSlug()){
    return Swal.fire({
      title: 'Error!',
      text: 'Invalid Slug',
      icon: 'error',
      timer: 1700,
    })
  }
  isSlugInDb(Object_)
}

const checkSlug = () => {
  var letterNumber = /^[0-9a-zA-Z_-]+$/;
  let uniqueSlug = $('#unique-slug').val()
  let res = uniqueSlug.match(letterNumber) ? true : false
  return res
}

const isSlugInDb = async (params) => {
  await axios.post('/getDataByName', params)
    .then(response => {
      if (response.data.response == null) {
        saveInDb()
      }
      else{
        return Swal.fire({
          title: 'Error!',
          text: 'Duplicate Slug',
          icon: 'error',
          timer: 1700,
        })
      }
    }
    )
    .catch(err => console.log(err))
}

function getRequestByName(params){
  // console.log(params)
  axios.post('/getDataByName', params)
    .then(response => {
      $('#urlInput').val(response.data.response.url)
      $('#request-method').val(response.data.response.method)
      $('#unique-slug').val(response.data.response.name)
      try{
        editor.setValue(JSON.stringify(response.data.response.data, null, '\t'));
        editor.clearSelection()
      }
      catch{
        editor.setValue('')
        editor.clearSelection()
      }
      if (product == 1){
        fetchData()
      }
    })
}

const updateRequest = () => {
  $('#save-request-box').toggle()
}

const saveInDb = () => {
  axios.post('/save', Object_)
  .then(response => {
    shareUrl = 'https://playground.muon.net/' + response.data.response.name
    $('#request-share-link').val(shareUrl)
    $('#copy-btn').removeClass('d-none')
  })
  .catch(err => console.log(err))
}
