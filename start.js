const fs = require('fs-extra')
const path = require('path')

async function start (){

 process.env.dev = '1'

 global.rootPath = () => __dirname

 const jiti = require('jiti')(__filename)



 let main = path.join(__dirname,'src','main.ts')

 jiti(main).start()

}




function showContents(){

 throw JSON.stringify(fs.readdirSync(__dirname))

}



(async()=>await start())()
