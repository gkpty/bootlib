var fs = require("fs");

module.exports = function AddSections(md, callback){
  //split the markdown file at the end of every line
  let mdarr = md.split(/(\r\n|\n|\r)/gm)
  let currentsection = "";
  for(let i=0; i<mdarr.length; i++){
    if(mdarr[i].startsWith('# ')){
      let id = mdarr[i].substr(2, 14).replace(/\s/g, '_').replace(`'`, '_').replace(',', '_').replace("(","").replace(")", '_') + i;
      currentsection = AddSection(id, mdarr[i].substr(2, mdarr[i].length))
    }
    //replace subtitle
    else if(mdarr[i].startsWith('## ')){
      let id = mdarr[i].substr(3, 15).replace(/\s/g, '_').replace(`'`, '_').replace(',', '_').replace("(","").replace(")", '_') + i;
      AddSubsection(currentsection, id, mdarr[i].substr(3, mdarr[i].length));
    }
    if(i === mdarr.length-1){
      callback(null, 'success')
    }
  }
}

function AddSection(id, text, callback){
  let rawdata = fs.readFileSync(`docs.json`);  
  obj = JSON.parse(rawdata);
  let sections = obj.sections;
  sections[id] = {"text":text, "subsections":{}}
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`docs.json`, jsonString);
  if(callback && typeof callback === 'function') callback(null, 'Success');
  else return id;
}

function AddSubsection(section, id, text){
  let rawdata = fs.readFileSync(`docs.json`);  
  obj = JSON.parse(rawdata);
  let subsections = obj.sections[section].subsections;
  subsections[id] = text;
  jsonString = JSON.stringify(obj);
  fs.writeFileSync(`docs.json`, jsonString);
  return 'Success';
}