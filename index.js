//client inputs string delimited with pluses with id's of object
var fs = require('fs');

function buildTheme(themeName, filename, components){
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
        indexCss += compCss;
      }
      //js
      if(fs.existsSync(`components/${comp}/index.js`)){
        let compJs = fs.readFileSync(`components/${comp}/index.js`)
        let scriptlink = `themes/${themeName}/js/${comp}.js`
        fs.writeFileSync(scriptlink, compJs)
        scriptLinks.push(scriptlink)
      }
      //svg
      buildSvg(comp)
    }
    else throw new Error(`Component ${comp} doesnt exist`)
  }
}

function buildSvg(component){
  let compType = component.split("/")[0]
  if(fs.existsSync(`components/${comp}/svg`)){
    addSvg(`components/${comp}/svg`)
  }
  else if(fs.existsSync(`components/${compType}/standard/svg`)){
    addSvg(`components/${compType}/standard/svg`)
  }
  else throw new Error('no svg compoennt present for that category')
}

function addSvg(indexSvg, component){
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
  //add to the length of the part
}

//await build the html
//then add all the js links in the html
//await merge the css then save
//add the svg component
//if the component dpesnt cpntain an

