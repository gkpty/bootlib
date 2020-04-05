//client inputs string delimited with pluses with id's of object
var fs = require('fs');

async function buildTheme(themeName, filename, components, svg, mergeCss, mergeJs){
  //check that there isnt already a theme with the themeName
  createDir(`themes/${themeName}`).then((data) => {
    console.log(data)
    await createDir(`themes/${themeName}/site`).then((data) => {
      console.log(data)
      await createDir(`themes/${themeName}/site/js`).then((data)=>{console.log(data)})
      await createDir(`themes/${themeName}/site/css`).then((data)=>{console.log(data)})
      await createDir(`themes/${themeName}/site/img`).then((data)=>{console.log(data)})
    })
    await createDir(`themes/${themeName}/toruf`).then((data) => {
      console.log(data)
      await createDir(`themes/${themeName}/toruf/components`).then((data)=>{console.log(data)})
      await createDir(`themes/${themeName}/toruf/objects`).then((data)=>{console.log(data)})
      await createDir(`themes/${themeName}/toruf/methods`).then((data)=>{console.log(data)})
      await createDir(`themes/${themeName}/toruf/templates`).then((data)=>{console.log(data)})
    })
    await createDir(`themes/${themeName}/mockups`).then((data) => {
      console.log(data)
      await createDir(`themes/${themeName}/mockups/svg`).then((data)=>{console.log(data)})
    })
  }).then(()=>{
    let indexHtml = "";
    let indexToruf = "";
    let indexCss = "";
    if(fs.existsSync(`themes/${themeName}/css/index.css`)) indexCss = fs.readFileSync(`themes/${themeName}/css/index.css`);
    let indexJs = "";
    if(fs.existsSync(`themes/${themeName}/js/index.js`)) indexJs = fs.readFileSync(`themes/${themeName}/js/index.js`);
    let scriptLinks = [];
    let styleLinks = [];
    let indexSvg = {"mobile":"","tablet":"","web":""};
    let svgStyles = {"mobile":"","tablet":"","web":""};
    let svgHeights = {"mobile":0,"tablet":0,"web":0};
    let rawdata = fs.readFileSync('components.json')
    let obj = JSON.parse(rawdata);
    for(let comp of components){
      if(obj[comp]){
        let compName = comp.replace("/","_");
        await createDir(`themes/${themeName}/toruf/components/${compName}`).then((data)=>{
          console.log(data)
          if(fs.existsSync(`components/${comp}/index.html`)){
            await fs.promises.writeFile(`themes/${themeName}/toruf/components/${compName}/index.html`, compMarkup)
            let compMarkup = fs.readFileSync(`components/${comp}/index.html`)
            let compToruf = '<#' + compName.toUpperCase() + '>'
            indexHtml += compMarkup + '\n'
            indexToruf += compToruf + '\n'
          }
          else throw new Error('component doesnt contain an index.html')
          if(fs.existsSync(`components/${comp}/index.css`)){
            await fs.promises.writeFile(`themes/${themeName}/toruf/components/${compName}/index.css`, compCss)
            let compCss = fs.readFileSync(`components/${comp}/index.html`)
            if(mergeCss) indexCss += compCss;
            else {
              let stylelink = `themes/${themeName}/css/${comp}.css`
              fs.writeFileSync(stylelink, compCss)
              styleLinks.push(`css/${comp}.css`) 
            }
          }
          if(fs.existsSync(`components/${comp}/index.js`)){
            await fs.promises.writeFile(`themes/${themeName}/toruf/components/${compName}/index.js`, compJs)
            let compJs = fs.readFileSync(`components/${comp}/index.js`)
            if(mergeJs) indexJs += compJs;
            else {
              let scriptlink = `themes/${themeName}/js/${comp}.js`
              await fs.promises.writeFile(scriptlink, compJs)
              scriptLinks.push(`js/${comp}.js`) 
            }
          }
          if(svg) {
            let compType = comp.split("/")[0]
            if(fs.existsSync(`components/${comp}/svg`)){
              await addSvg(comp, indexSvg, svgHeights, svgStyles)
            }
            else if(fs.existsSync(`components/${compType}/standard/svg`)){
              await addSvg(`${compType}/standard`, indexSvg, svgHeights, svgStyles)
            }
            else throw new Error(`no svg component present for the ${compType} category`)
          }
        });
      }
      else throw new Error(`Component ${comp} doesnt exist`)
    }
  }).then(()=> {
    if(mergeCss) await fs.promises.writeFile(`themes/${themeName}/site/css/${filename}.css`)
    if(mergeJs) await fs.promises.writeFile(`themes/${themeName}/site/js/${filename}.js`)
    await saveHtml(themeName, filename, indexHtml, mergeCss, mergeJs)
    await saveSvg(filename, indexSvg, svgHeights, svgStyles)
  })
}

async function saveSvg(filename, svgs, heights, styles){
  return new Promise((resolve) =>{
    let sizes = ['mobile','tablet','web']
    for(let size of sizes){
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
      await fs.promises.writeFile(`themes/${themeName}/mockups/svg/${filename}-${size}.svg`, svgMockup)
    }
    resolve('success')
  })
}

async function saveHtml(themeName, filename, htmlBody, templateBody, mergeCss, mergeJs){
  return new Promise((resolve) => {
    let scripts = ""
    if(mergeJs) scripts = `<script src="js/index.js"></script>\n`
    else for(let src of srccriptLinks) scripts += `<script src="${src}"></script>\n`
    let sheets = ""
    if(mergeCss) sheets = `<link rel="stylesheet" href="css/index.css">\n`
    else for(let ref of styleLinks) sheets += `<link rel="stylesheet" href="${ref}">\n`
    let top = `
    <!DOCTYPE html>
    <html lang="en">
      <head>  
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <title> ${themeName} - ${filename} </title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        ${sheets}
      </head>
      <body id="page-top" class="text-center text-md-left">`
    let bottom = `   
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>
        ${scripts}
      </body>
    </html>`
    let htmlFile = top + htmlBody + bottom;
    await fs.promises.writeFile(`themes/${themeName}/site/${filename}.html`, htmlFile)
    let torufTemplate = top + templateBody + bottom;
    await fs.promises.writeFile(`themes/${themeName}/toruf/templates/${filename}.html`, torufTemplate)
    resolve('success')
  })
}

async function addSvg(component, indexSvg, svgHeights, svgStyles){
  return new Promise((resolve) => {
    let compPath = `components/${component}/svg`
    let sizes = ['mobile','tablet','web']
    for(let size of sizes){
      let svgComp = fs.promises.readFile(`${compPath}/${size}.svg`, 'utf8').then((data) => {
        await getSvgBody(svgComp, svgHeights[size], svgStyles[size]).then((res) => {
          indexSvg[size] += res.svg;
          svgHeights[size] += res.height;
          svgStyles[size] += res.styles;
        })
      })
    }
    resolve('success')
  })
}

async function getSvgBody(svg, height, styles) {
  return new Promise((resolve) => {
    let elems = ["svg","defs","style","title"];
    let svgBody = svg;
    let newStyles = styles;
    let newHeight = height;
    for(let elem of elems){
      let begin = svg.split(`<${elem}`, 2)[1]
      let begin_tag = begin.split(">")[0]
      let contents = begin.substr(begin.indexOf(">"), begin.indexOf("<"))
      if(elem === 'svg') newHeight += begin_tag.split("viewBox=")[1].split('"')[1].split(" ")[2].valueOf()
      else if(elem === 'style') newStyles += contents
      svgBody = svgBody.replace(`<${elem+begin_tag}>`, "")
      svgBody = svgBody.replace(`</${elem}>`, "")
    }
    resolve({"svg":svgBody, "height":newHeight, "styles":newStyles});
  })
}

async function createDir(dir){
  return new Promise((resolve, reject)=>{
    if(fs.existsSync(dir)) resolve(`directory ${dir} already exists`)
    else {
      await fs.promises.mkdir(dir).then(resolve(`Created the ${dir} directory`))
      .catch((err)=>{reject(err)})
    }
  })
}

/* async function createFile(file, contents) {
  return new Promise((resolve, reject) => {
    if(fs.existsSync(file)) resolve(`file ${file} already exists`)
    else {
      await fs.promises.writeFile(file, contents).then(resolve(`Created the ${file} file`))
      .catch((err)=>{reject(err)})
    }
  })
} */

module.exports = {
  buildTheme,
}


