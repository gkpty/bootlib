//client inputs string delimited with pluses with id's of object
var fs = require('fs');

function buildTheme(themeName, filename, components, svg, mergeCss, mergeJs){
  //check that there isnt already a theme with the themeName
  //create a directory for the theme in 
  //create the site directory for the theme
    //create a css directory and create an index.css file
    //create a js directory and create an index.js file
  //create the toruf folder for the theme
    //create a components direcotry for the theme
  let indexHtml = ""
  let indexCss = ""
  let indexJs = ""
  let scriptLinks = []
  let styleLinks = []
  let indexSvg = {
    "mobile":"",
    "tablet":"",
    "web":""
  }
  let svgStyles = {
    "mobile":"",
    "tablet":"",
    "web":""
  }
  let svgHeights = {
    "mobile":0,
    "tablet":0,
    "web":0
  }
  if(fs.existsSync(`themes/${themeName}/css/index.css`)){
    indexCss = fs.readFileSync(`themes/${themeName}/css/index.css`)
  }
  let rawdata = fs.readFileSync('components.json')
  let obj = JSON.parse(rawdata);
  for(let comp of components){
    if(obj[comp]){
      //html
      if(fs.existsSync(`components/${comp}/index.html`)){
        let compHtml = fs.readFileSync(`components/${comp}/index.html`)
        indexHtml += '\n' + compHtml
        //add the component tag in the html file
        //add the component to the components folder
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
        if(mergeJs) indexJs += compJs;
        else {
          let scriptlink = `themes/${themeName}/js/${comp}.js`
          fs.writeFileSync(scriptlink, compJs)
          scriptLinks.push(scriptlink) 
        }
      }
      if(svg) {
        let compType = comp.split("/")[0]
        if(fs.existsSync(`components/${comp}/svg`)){
          addSvg(comp, indexSvg, svgHeights, svgStyles)
        }
        else if(fs.existsSync(`components/${compType}/standard/svg`)){
          addSvg(`${compType}/standard`, indexSvg, svgHeights, svgStyles)
        }
        else throw new Error(`no svg component present for the ${compType} category`)
      }
    }
    else throw new Error(`Component ${comp} doesnt exist`)
  }
  if(mergeCss) fs.writeFileSync(`themes/${themeName}/site/css/${filename}.css`)
  if(mergeJs) fs.writeFileSync(`themes/${themeName}/site/js/${filename}.js`)
  saveSite(indexHtml)
  saveSvg(filename, indexSvg, svgHeights, svgStyles)
  //insert links to the stylesheet and scripts in the html file
}

function saveSvg(filename, svgs, heights, styles){
  let sizes = [
    'mobile',
    'tablet',
    'web'
  ]
  for(let size of size){
    let top = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 ${heights[size]}">
      <defs>
        <style>
        ${styles[size]}
        </style>
      </defs>
      <title>${filename} ${size}</title>
    `
    let bottom = '</svg>'
    let svgMockup = top + svgs[size] + bottom;
    fs.writeFileSync(`themes/${themeName}/mockups/svg/${filename}-${size}.svg`, svgMockup)
  }
}

function saveHtml(filename, body){
  //add top and bottom
  //fs.writeFileSync()
}

function addSvg(component, indexSvg, svgHeights, svgStyles){
  //remove top and bottom
  let compPath = `components/${component}/svg`
  let sizes = [
    'mobile',
    'tablet',
    'web'
  ]
  for(let size of sizes){
    let svgComp = fs.readFileSync(`${compPath}/${size}.svg`, 'utf8')
    let res = getSvgBody(svgComp, svgHeights[size], svgStyles[size])
    indexSvg[size] += res.svg;
    svgHeights[size] += res.height;
    svgStyles[size] += res.styles;
  }
}

function getSvgBody(svg, height, styles) {
  let elems = [
    "svg",
    "defs",
    "style",
    "title"
  ]
  let svgBody = svg
  let newStyles = styles
  let newHeight = height
  for(let elem of elems){
    let begin = svg.split(`<${elem}`, 2)[1]
    let begin_tag = begin.split(">")[0]
    let contents = begin.substr(begin.indexOf(">"), begin.indexOf("<"))
    if(elem === 'svg') newHeight += begin_tag.split("viewBox=")[1].split('"')[1].split(" ")[2].valueOf()
    else if(elem === 'style') newStyles += contents
    svgBody = svgBody.replace(`<${elem+begin_tag}>`, "")
    svgBody = svgBody.replace(`</${elem}>`, "")
  }
  return {"svg":svgBody, "height":newHeight, "styles":newStyles}
}

module.exports = {
  buildTheme,
}


//await build the html
//then add all the js links in the html
//await merge the css then save
//add the svg component
//if the component dpesnt cpntain an

