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
  let newTemplate = ""
  let scriptLinks = []

  for(let comp of compArr){
    if(obj[comp]){
      //html
      if(fs.existsSync(`components/${comp}/index.html`)){
        let compHtml = fs.readFileSync(`components/${comp}/index.html`)
        newTemplate += '\n' + compHtml
      }
      else throw new Error('component doesnt contain an index.html')
      //css
      if(fs.existsSync(`components/${comp}/index.css`)){
        let compCss = fs.readFileSync(`components/${comp}/index.html`)
        indexcss += compCss;
      }
      //js
      if(fs.existsSync(`components/${comp}/index.js`)){
        let compJs = fs.readFileSync(`components/${comp}/index.js`)
        let scriptlink = `themes/${themeName}/js/${comp}.js`
        fs.writeFileSync(scriptlink, compJs)
        scriptLinks.push(scriptlink)
      }
      //svg
      if(fs.existsSync(`components/${comp}/svg`)){
        let sizes = ['mobile', 'tablet', 'web']
        for(let size of sizes){
          buildSvg(size)
        } 
      }
    }
    else throw new Error(`Component ${comp} doesnt exist`)
  }
}

buildSvg(component){
  //check if the compoent contains an svg
    //use that svg
  //if not check for the standard compoent in the category
    //add that svg
  //if not throw an error no svg compoennt present for that category
}

//await build the html
//then add all the js links in the html
//await merge the css then save
//add the svg component
//if the component dpesnt cpntain an

