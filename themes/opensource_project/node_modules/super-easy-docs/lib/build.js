//require('dotenv').config();
var fs = require("fs");

function initBuild(callback){
  let docs = `{
    "title":"",
    "description":"",
    "favicon":"",
    "stylesheets":[],
    "sections":{}
  }`;
  createDir('./css', (err) => {
    if(err) callback(err)
    else{
      createFile('./css/docs.css', docsStylesheet);
    }
  })
  createDir('./js', (err) => {
    if(err) callback(err)
    else{
      createFile('./js/docs.js', docsScript);
    }
  })
  createFile('./docs.json', docs, function(err, data){
    if(err) callback(err)
    else {
      if(callback && typeof callback === 'function'){
        callback(null, 'Success');
      }
    }
  })
}

function AddVar(variable, value, callback){
  let rawdata = fs.readFileSync(`docs.json`);  
  obj = JSON.parse(rawdata);
  obj[variable] = value;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`./docs.json`, jsonString);
  //console.log('\x1b[33m', `Variable: ${variable} saved.`, '\x1b[0m')
  if(callback && typeof callback === 'function') callback(null, 'Success');
  else return 'Success';
}

function createFile(file, contents, callback) {
  if(fs.existsSync(file)){
    let err = `file ${file} already exists`
    if(callback && typeof callback === 'function') callback(null, err)
    else return err;
  }
  else {
    fs.writeFile(file, contents, (err) => {
      if (err) {
        if(callback && typeof callback === 'function') callback(new Error(err))
        else throw new Error(err);
      }
      else {
        let success = `Created the ${file} file`
        if(callback && typeof callback === 'function') callback(null, success)
        else return success;
      }
    })
  }
}

function createDir(dir, callback){
  if (fs.existsSync(dir)){
    let err = (`directory ${dir} already exists`)
    callback(null, err);
  }
  else {
    fs.mkdir(dir, (err) => {
      if (err) {
        callback(err)
      }
      else {
        let data = `Created the ${dir} directory`
        callback(null, data);
      }
    });
  }
}

var docsScript = `
$(document).ready(function(){
  // Add scrollspy to <body>
  $('body').scrollspy({target: ".navbar", offset: 200});   		
  // Add smooth scrolling on all links inside the navbar
  $(".smooth-scroll").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 400, function(){
        window.location.hash = hash;
      });
    }
  });
});

$('button').click(function(event) {
  var x = event.target.name;
  document.getElementById(x).classList.toggle("show");
});

$(document).ready(function(){
  $('.dropbtn').click(function(event){
    var caret_id = '#' + event.target.name + '-caret'
    $(caret_id).toggleClass('open')
  })
});
`

var docsStylesheet = `
body {
  overflow-x: hidden;
}
section, h2 {
  padding-top: 65px;
  margin-top: -60px;
}
span, i {
  pointer-events: none;
}
@media(max-width: 800px){
  .mobibar {
    padding: 10%;
    padding-top: 25%;
  }
  
}
@media (min-width: 800px) {
  #sidebar-wrapper {
    margin-left: 0;
  }
  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }
  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
  .mobibar {
    background-color: #fff !important;
    min-width: 25%;
    border-right: 1px solid #cccccc;
    padding-top: 8%;
  }
}
.docs{
  padding-top: 100px;
}
.dropdown {
  float: left;
  overflow: hidden;
}
.dropdown .dropbtn {
  cursor: pointer;
  font-size: 16px;  
  border: none;
  outline: none;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}
.dropdown-content {
  display: none;
  position: relative;
  background-color: #f9f9f9;
  min-width: 160px;
}
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  border-top: 1px solid rgba(0,0,0,.125);
}
.dropdown-content a:hover {
  background-color: #ddd;
}
.show {
  display: block;
}
.dropdown a span {
  margin-left: 25px;
}
.dropdown a span, .sub-dropdown span {
  margin-left: 25px;
}
.sub-dropdown {
  border-top: 1px solid rgba(0,0,0,.125);
}
.sub-dropdown a span {
  margin-left: 50px;
}`;

module.exports = {
  AddVar,
  initBuild,
  createFile
}