//client inputs string delimited with pluses with id's of object
var fs = require('fs');

function buildTheme(themeName, filename, components, svg, mergeCss, mergeJs){
  //check that there isnt already a theme with the themeName
  //create a directory for the theme in 
  //create a css directory and create an index.css file
  //create a js directory and create an index.js file
  let indexCss = ""
  let indexHtml = ""
  let indexSvg = {
    "mobile":"",
    "tablet":"",
    "web":""
  }
  if(fs.existsSync(`themes/${themeName}/css/index.css`)){
    indexcss = fs.readFileSync(`themes/${themeName}/css/index.css`)
  }
  let rawdata = fs.readFileSync('components.json')
  let obj = JSON.parse(rawdata);
  let compArr = components.split('+');
  let scriptLinks = []
  let styleLinks = []
  for(let comp of compArr){
    if(obj[comp]){
      //html
      if(fs.existsSync(`components/${comp}/index.html`)){
        let compHtml = fs.readFileSync(`components/${comp}/index.html`)
        indexHtml += '\n' + compHtml
      }
      else throw new Error('component doesnt contain an index.html')
      //css
      if(fs.existsSync(`components/${comp}/index.css`)){
        let compCss = fs.readFileSync(`components/${comp}/index.html`)
        if(mergeCss) indexCss += compCss;
        else {
          let stylelink = `themes/${themeName}/css/${comp}.css`
          fs.writeFileSync(stylelink, compCss)
          styleLinks.push(stylelink) 
        }
      }
      //js
      if(fs.existsSync(`components/${comp}/index.js`)){
        let compJs = fs.readFileSync(`components/${comp}/index.js`)
        if(mergeJs) indexJs += compCss;
        else {
          let scriptlink = `themes/${themeName}/js/${comp}.js`
          fs.writeFileSync(scriptlink, compJs)
          scriptLinks.push(scriptlink) 
        }
      }
      if(svg) buildSvg(comp, indexSvg)
    }
    else throw new Error(`Component ${comp} doesnt exist`)
  }
  if(mergeCss) fs.writeFileSync(`themes/${themeName}/css/${filename}.css`)
  if(mergeJs) fs.writeFileSync(`themes/${themeName}/js/${filename}.js`)
  //insert links to the stylesheet and scripts in the html file
}

function buildSvg(component, indexSvg){
  let compType = component.split("/")[0]
  if(fs.existsSync(`components/${comp}/svg`)){
    addSvg(`components/${comp}/svg`, indexSvg)
  }
  else if(fs.existsSync(`components/${compType}/standard/svg`)){
    addSvg(`components/${compType}/standard/svg`, indexSvg)
  }
  else throw new Error('no svg compoennt present for that category')
}

function addSvg(component, indexSvg){
  //remove top and bottom
  let bottom = '</svg>'
  let compPath = `components/${component}/svg`
  let sizes = [
    'mobile',
    'tablet',
    'web'
  ]
  for(let size of sizes){
    let componentSvg = fs.readFileSync(`${compPath}/${size}.svg`, 'utf8')
    let top = componentSvg.split(">")[0]+">"
    let svgPiece = componentSvg.replace(top, "").substr(0, componentSvg.lastIndexOf(bottom))
    indexSvg[size] += svgPiece;
  }
  //add to the height of the part to the viewBox
}

module.exports = {
  buildTheme,
  buildSvg
}


//await build the html
//then add all the js links in the html
//await merge the css then save
//add the svg component
//if the component dpesnt cpntain an

