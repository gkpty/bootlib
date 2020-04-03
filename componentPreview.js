//optimize svg
function optimizeSvg(filePath){
  var fs = require('fs'),
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
        console.log(result.data, result.info);
        fs.writeFileSync(`${subPath}/optimized-${fileName}`, result.data)
      });
    });
}

//build the component preview
//add head and scripts

optimizeSvg('components/headers/standard/svg/mobile.svg')