const fs = require('fs-extra')
const path = require('path')

async function start (){

 const root = path.join(process.execPath,'asar')
 global.rootPath = () => root


 await require('./src/main').start()

}




function showContents(){

 throw JSON.stringify(fs.readdirSync(__dirname))

}



(async()=>await start())()
