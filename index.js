//client inputs string delimited with pluses with id's of object
var fs = require('fs');

function buildTheme(themeName, filename, components){
  //check that there isnt already a theme with the themeName
  //create a directory for the theme in 
  //create a css directory and create an index.css file
  //create a js directory and create an index.js file
  let indexcss = ""
  if(fs.existsSync(`themes/${themeName}/css/index.css`)){
    indexcss = fs.readFileSync(`themes/${themeName}/css/index.css`)
  }
  let rawdata = fs.readFileSync('components.json')
  let obj = JSON.parse(rawdata);
  let newTemplate = ""
  let compArr = components.split('+');
  let beginTemplate = ""
  let scripts = ``
  let endTemplate = ""
  for(let comp of compArr){
    if(obj[comp]){
      //read the component html
      let compHtml = fs.readFileSync(`components/${comp}/index.html`)
      newTemplate += compHtml
      if(fs.existsSync(`components/${comp}/index.css`)){
        let compCss = fs.readFileSync(`components/${comp}/index.html`)
        indexcss += compCss;
      }
      if(fs.existsSync(`components/${comp}/index.js`)){
        //copy index.js into themes/themeName/js/themeName.js
        //add script themeName.js in the scripts
      }
    }
  }
}