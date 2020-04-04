var fs = require('fs')

function optimizeSvg(filePath){
  SVGO = require('svgo'),
  svgo = new SVGO({
    plugins: [{
      cleanupAttrs: true,
    }, {
      removeDoctype: true,
    },{
      removeXMLProcInst: true,
    },{
      removeComments: true,
    },{
      removeMetadata: true,
    },{
      removeTitle: true,
    },{
      removeDesc: true,
    },{
      removeUselessDefs: true,
    },{
      removeEditorsNSData: true,
    },{
      removeEmptyAttrs: true,
    },{
      removeHiddenElems: true,
    },{
      removeEmptyText: true,
    },{
      removeEmptyContainers: true,
    },{
      removeViewBox: false,
    },{
      cleanupEnableBackground: true,
    },{
      convertStyleToAttrs: true,
    },{
      convertColors: true,
    },{
      convertPathData: true,
    },{
      convertTransform: true,
    },{
      removeUnknownsAndDefaults: true,
    },{
      removeNonInheritableGroupAttrs: true,
    },{
      removeUselessStrokeAndFill: true,
    },{
      removeUnusedNS: true,
    },{
      cleanupIDs: true,
    },{
      cleanupNumericValues: true,
    },{
      moveElemsAttrsToGroup: true,
    },{
      moveGroupAttrsToElems: true,
    },{
      collapseGroups: true,
    },{
      removeRasterImages: false,
    },{
      mergePaths: true,
    },{
      convertShapeToPath: true,
    },{
      sortAttrs: true,
    }]
  });
  let subPath = filePath.substr(0, filePath.lastIndexOf("/"))
  let fileName = filePath.substr(filePath.lastIndexOf("/")+1)
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    svgo.optimize(data, {path: filePath}).then(function(result) {
      //console.log(result.data, result.info);
      let prettySVG = pretifyMarkup(result.data)
      fs.writeFileSync(`${subPath}/optimized-${fileName}`, prettySVG)
    });
  });
}

function pretifyMarkup(markup){
  markup = markup.replace(/\n/g, '')
  let markupArr = markup.split('<')
  let tab = "    ";
  let tabs = ""
  let nests = 0;
  let newMarkup = "";
  content = false
  openTag = false
  for(let i=1; i<markupArr.length; i++){
    let newline = '\n';
    if(markupArr[i].startsWith('/')) {
      if(openTag){
        newline = "";
        tabs = "";
      }
      else {
        if(!openTag) nests -= 1
        tabs = tab.repeat(nests);
      } 
      openTag = false
    }
    else {
      if(markupArr[i].split('>')[1].trim().length > 0) content = true
      else content = false
      if(openTag && indent) {
        nests += 1
      }
      tabs = tab.repeat(nests);
      openTag = true;
      if(markupArr[i].substr(markupArr[i].length - 2) == '/>') indent = false;
      else indent = true;
    }
    newMarkup += newline + tabs + '<' + markupArr[i]
  }
  return newMarkup;
}

//build the component preview
//add head and scripts
function buildHtmlPreview(componentPath, fullSection){
  //read the component
  let pathArr = componentPath.split('/')
  if(pathArr.length > 2) throw new Error('invalid component')
  else if(pathArr.length < 2) throw new Error('component must comntain a section')
  else  {
    let section = pathArr[0]
    let name = pathArr[1]
    let html = fs.readFileSync(`components/${componentPath}/index.html`, 'utf8')
    let top = `
    <!DOCTYPE html>
    <html lang="en">
      <head>  
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <title> Bootlib - ${section}s - ${name} </title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="index.css">
      </head>
      <body id="page-top" class="text-center text-md-left">
        ${fullSection ? "" : '<div class="centered">'}
    `
    let bottom = `
        ${fullSection ? "" : '<div class="centered">'}
        <!-- Full JQuery -->
        <script
        src="https://code.jquery.com/jquery-3.4.1.min.js"
        integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
        crossorigin="anonymous">
        </script>

        <!-- Bootstrap core javascript -->
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>
        <!-- Custom scripts for this template -->
        <script src="index.js"></script>
      </body>
    </html>
    `
    let newHtml = top + html + bottom;
    fs.writeFileSync(`components/${componentPath}/preview.html`, newHtml)
    return newHtml;
  }
}

module.exports = {
  optimizeSvg,
  pretifyMarkup,
  buildHtmlPreview
}