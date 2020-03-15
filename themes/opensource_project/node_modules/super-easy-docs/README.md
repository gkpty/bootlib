# Super Easy Docs

A node module that generates responsive html documentation pages with bootstrap4. 

The module reads a markdown file, converts it to html, and then builds a responsive navigation bar with all the documentation sections.

## Installation
`npm i super-easy-docs`

## Usage
    const superEasyDocs = require('./super-easy-docs')

    //replace PATH with the path to your markdown documentatin file
    superEasyDocs(PATH, function(err, data){
      if(err) console.log(err)
      else console.log('success')
    })