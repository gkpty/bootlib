var fs = require("fs");
var {initBuild} = require('./lib/build')
//var addSections = require('./lib/AddSections')
var createIndex = require('./lib/CreateIndex')
var emdToHtml = require('easy-md-to-html')

module.exports = function CreateDocs(path, callback){
  //build the docs.json file
  initBuild(function(err, data){
    if(err) throw new Error(err)
    else{
      //read the markdown file
      fs.readFile(path, 'utf8', function(err, data){
        if(err) throw new Error(err)
        else{
          //convert md to html
          emdToHtml(data, 'docs', function(err, htmlbody){
            if(err) throw new Error(err)
            else {
              //build the html file
              let html = `
              <!doctype html>
                <html lang="en">
                  ${createHead()}
                <body id="page-top">
                  <div class="d-lg-flex" id="wrapper">
                    ${createIndex()}
                    <div id="page-content-wrapper">
                      ${createNav()}
                      <div class="container docs">
                        ${htmlbody}
                        </section>
                      </div>
                      ${footer}
                    </div>
                  </div>
                  ${scripts}
                </body>
              </html>        
              `;
              //save the html file
              fs.writeFile('docs.html', html, function(err, data){
                if(err) throw new Error(err)
                else {
                  callback(null, html)
                }
              })
            }
          });
        }
      })
    }
  })
}

function createHead(){
  let rawdata = fs.readFileSync(`./docs.json`);  
  let docs = JSON.parse(rawdata);
  var stylesheets = "";
  for(let stylepath of docs["stylesheets"]){
    stylesheets += `<link href="${stylepath}" rel="stylesheet"></link>`
  }
  var head = `
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Documentation for ${docs["title"]} made with Super Easy Docs">
    <title>${docs["title"]} Documentation</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <!-- Docs Stylesheet -->
    <link href="css/docs.css" rel="stylesheet">
    <!-- Additional Stylesheets -->
    ${stylesheets}
    <!-- Favicon -->
    ${docs["favicon"]}    
  </head>
`;
  return head;
}

function createNav(){
  let nav = `
  <nav class="navbar navbar-light bg-light fixed-top py-3">
    <a class="navbar-brand" href="#page-top">Docs</a>
  </nav>
  `;
  if(fs.existsSync('./nav.html')){
    nav = fs.readFileSync('./nav.html', 'utf8');
  }
  return nav;
}

var footer = `
<footer class="bg-dark sticky-bottom text-center text-white py-4">
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        <p class="text-lg-left">Copyright &copy; Super Easy Forms 2019</p>
      </div>
      <div class="col-sm-6">
        <p class="text-lg-right">powered by Super Easy Docs</a></p>
      </div>
    </div>
  </div>
</footer>
`;

var scripts = `
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
<script src="docs.js"></script>
`;