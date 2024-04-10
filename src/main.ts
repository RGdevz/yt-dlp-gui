
import {
 appTempDir, checkWritePermissionSync, downloadFromGithubFix,

 extractWebViewDll,
 getGui,
 getStaticFilesPath,
 isPackaged,
} from "./helper";
import * as fs from "fs";
import * as path from "path";
import  {default as yt} from 'yt-dlp-wrap';

import {YueHelper} from "yue-helper/dist/backend"
import {Gui} from "yue-helper";
import os from "os";
import {downloadArgs} from "./types";
import open from "open";







const yueHelper = YueHelper.loadLib(getGui())

const gui = yueHelper.gui

let win : Gui.Window

const keep = new Set()



process.on('uncaughtException',(err)=>yueHelper.showErrorMessage(err.message))



async function get_ytdlp() {

 const bin = path.join(appTempDir(),'yt-dlp.exe')

 if (!fs.existsSync(bin)){
 yueHelper.emit('dlp-data',`downloading yt-dlp to ${bin}...`).catch(()=>{})
 await downloadFromGithubFix(bin)

 }




const downloader = new yt(bin);
return downloader
}



function setupWindow():Gui.Window{
 win = gui.Window.create({frame: process.platform !== 'win32',transparent:false})

 win.setResizable(true)
 win.setMaximizable(false)


 win.setContentSize({width: 760, height: 780})

 win.onClose = () => {
 gui.MessageLoop.quit()
 }

 win.setTitle("YT-DLP Gui")

 keep.add(win)


 win.center()
 win.activate()

 return win

 }







   function protocolFunction(asar?:Gui.myClass) : (resource:string)=>Gui.ProtocolJob{

   if (isPackaged()) {
/*
   return (resource:string) => gui.ProtocolAsarJob.create(process.execPath, path.join('static',resource))
*/
   return (resource:string) => asar.createJob(path.join('static',resource))

  } else {

   return  (resource:string) =>  gui.ProtocolFileJob.create(path.join(getStaticFilesPath(),resource))

   }

   }






   function selectFolderDialog() {

    const dialog = gui.FileOpenDialog.create()

    dialog.setOptions(1)
  /*  dialog.setFilters([{description:'video',extensions:['mp4']}])*/

    const result = dialog.runForWindow(win)

    if (result){
    return dialog.getResult()
    }

    return undefined

   }




/*   async function convertToMP4(path:string){

   return 'ffmpeg -i input.mp4 -c:v libx264 -c:a aac -strict experimental -b:a 192k -pix_fmt yuv420p output.mp4'

   }*/




    async function downloadVid({url,quality,openDir}:downloadArgs,path:string) {

    if (!path) return


       let formart = ''

      switch (quality) {

       case "Medium":
       formart = `bestvideo[height<=720]+bestaudio/best[height<=720]`
       break
      case "Low":
       formart = `bestvideo[height<=480]+bestaudio/best[height<=480]`
       break
      }



     const cmd = [url,'-P', path, '-P', `temp:${os.tmpdir()}`]

     if (quality !== 'Highest'){
      console.log(formart)
      cmd.push(...['-f',formart])
     }

     /*cmd.push(...['-S','ext:mp4:m4a'])*/


     try{


     yueHelper.emit('downloading','1').catch(()=>{})

     const yt = await get_ytdlp()
     const job = yt.exec(cmd)

     job.on('ytDlpEvent',(event,data)=>{
     yueHelper.emit('dlp-data',data)
     }
     )



      job.on('close',(code)=>{

      yueHelper.emit('downloading','0')

      if (code === 0){
      if (openDir) {
      open(path).catch(() => {})
      }
      }
      }
      )


     job.on('error',(error)=> {


     yueHelper.emit('downloading','0')

     const errMsg = error?.message || String(error)

     yueHelper.showErrorMessage(error?.message || String(error))
     yueHelper.emit('dlp-data',errMsg)

     }
     )

      }catch (e) {
      console.error(e)
      yueHelper.emit('downloading','0')
      yueHelper.emit('dlp-data','')
      yueHelper.showErrorMessage(e?.message || String(e))
     }

     }




 export async function start(){


  const staticPath = getStaticFilesPath()


  const asarFile = gui.myClass.create(process.execPath);

  if (isPackaged()) {
  asarFile.parse()
  }


  const protocol = protocolFunction(asarFile)


  const win = setupWindow()

  const container = gui.Container.create()






   gui.Browser.registerProtocol('app',(url)=>{


   const resource = {value:decodeURIComponent(new URL(url).pathname)}


   if (resource.value === '/' || !resource.value){
   resource.value = 'index.html'
   }


    const fullPath = path.join(staticPath,resource.value)

    try {

    fs.accessSync(fullPath)

    }catch (e) {

    console.log('file not found', fullPath)

    if(path.extname(resource.value).length > 0){
    return undefined
    }

    resource.value = 'index.html'

    }


   return  protocol(resource.value)

   }
   )





  const loader = extractWebViewDll(e=>yueHelper.showErrorMessage(e))


  //8-bit hex color https://www.schemecolor.com/hex/FBDD49
  process.env['WEBVIEW2_DEFAULT_BACKGROUND_COLOR'] = 'FF282828'

  const browser = yueHelper.createBrowser(async (eventName,args,cb)=>{

  switch (eventName) {

   case 'test':{
   break
   }


   case 'download':{

    const path = selectFolderDialog()

    if (!path){
     return
    }


    if(!checkWritePermissionSync(path)){
    yueHelper.showErrorMessage(`no permission to write files in path ${path}`)
    return
    }


   Promise.resolve().then(()=> downloadVid(JSON.parse(args.arg0),path))
   cb('1')



   break

   }

   default:
    break;


   }

   },loader
   )






  browser.setStyle({flex:1})

  if (isPackaged()) {
  browser.loadURL('app://_')

  } else {
  browser.loadURL('http://localhost:5173/')
  }





   if (process.platform === 'win32') {

    const titleBar = gui.Container.create()


    titleBar.setStyle({width:'100%',minheight:30,position:'relative',flexdirection:'row'})

    const buttonsContainer = gui.Container.create()
    buttonsContainer.setStyle({flexdirection:'row',flex:1,justifyContent:'flex-end',gap:3})

    buttonsContainer.setMouseDownCanMoveWindow(true)

   const close = gui.Button.create('')
    close.setBackgroundColor('#343434')
    close.setTooltip('Close')

   close.onClick = () => {
   win.close()
   }


    const title = gui.Label.create('YT-DLP Gui')
    title.setColor('white')
    title.setStyle({alignSelf:"center"})
    title.setMouseDownCanMoveWindow(true)


    const minimize = gui.Button.create('')
    minimize.setImage(yueHelper.createNativeImage(path.join(global.rootPath(),'minimize.png'),15))
    minimize.setStyle({width:'100px'})
    close.setStyle({width: '100px'})
    minimize.setTooltip('Minimize')

    minimize.setBackgroundColor('#343434')

    close.setImage(yueHelper.createNativeImage(path.join(global.rootPath(),'close.png'),15))

    minimize.onClick = () => win.minimize()

   titleBar.setMouseDownCanMoveWindow(true)


    titleBar.addChildView(title)
    buttonsContainer.addChildView(minimize)
    buttonsContainer.addChildView(close)

    titleBar.addChildView(buttonsContainer)

    container.addChildViewAt(titleBar,0)
  }




  container.addChildView(browser)

  container.setBackgroundColor('#282828')

  win.setContentView(container)


  win.shouldClose = (window) =>{

  gui.MessageLoop.postTask(()=>{

  const box = gui.MessageBox.create()
  box.setText('Confirm')
  box.setType('warning')
  box.setInformativeText('Are you sure you want to close the app?')
  box.addButton('Yes',1)
  box.addButton('no',0)

  const response = box.runForWindow(window)

  if (response === 1) gui.MessageLoop.quit()

  }
  )

  return false
  }


  }






