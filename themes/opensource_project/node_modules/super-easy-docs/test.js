var CreateDocs = require('./index')

CreateDocs('./docs.md', function(err, data){
  if(err) console.log(err)
  else console.log('success')
})