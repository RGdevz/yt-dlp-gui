import * as path from 'path'
import * as fs from 'fs-extra'

import * as os from "os";

import YTDlpWrap from "yt-dlp-wrap";


export function getStaticFilesPath(){
return path.join(global.rootPath(),'static')

}

export function isPackaged(){
/*return process['isPackaged'] === true*/
return  process.env.dev !== '1'
}




export function getEmbeddedAsset(...the_path:string[]){
return path.join(getStaticFilesPath(),...the_path)
}






export function appEntryPointPath(){

return path.dirname(process.execPath)

}






 function existsSyncSafe(path:string){
	try{
 return 	fs.existsSync(path)
	} catch (e) {
	return false
	}
 }







export function createTempDir() {
	const tmpDir = os.tmpdir();
	const timestamp = Date.now();
	const tempDirName = `temp_dir_${timestamp}`;
	const tempDirPath = path.join(tmpDir, tempDirName);
	console.log('tempDir',tempDirPath)
	fs.mkdirSync(tempDirPath)
	return  tempDirPath

}




export function appTempDir(appName:string) {
	const tmpDir = os.tmpdir();
	const tempDirPath = path.join(tmpDir, appName);
	console.log('temp dir',tempDirPath)
	try{fs.mkdirSync(tempDirPath)}catch (e) {}
	return  tempDirPath
}





 export  function checkWritePermissionSync(dirPath) {
	const testFilePath = path.join(dirPath, 'testWritePermission.txt');
	try {
		fs.writeFileSync(testFilePath, 'Test content');
		fs.unlinkSync(testFilePath); // Clean up the test file
		return true
	} catch (error) {
		return false
	}
 }



export async function sleep(time:number){
return new Promise(resolve => setTimeout(()=>resolve(''),time))
}





export function getGui(){

const thePath = path.join(appEntryPointPath(),'gui.node')

if (fs.pathExistsSync(thePath)) return thePath

console.log('self extracting gui.node')

	try {
		fs.writeFileSync(thePath, fs.readFileSync(path.join(global.rootPath(), 'gui.node')))

	}catch (e) {

		const error = e as NodeJS.ErrnoException

		if (error.code === 'EPERM'){

	throw new Error('no permissions to extract necessary files in current dir')

	} else {
		throw e
		}

	}

return thePath


}



export async function  downloadFromGithubFix(
filePath?: string,
version?: string,
platform = os.platform()
): Promise<void> {
	const isWin32 = platform == 'win32';


	let fileName = `yt-dlp.exe`

	if (!isWin32){
		fileName = 'yt-dlp_linux'
	}

	if (!version) {
		version = (await YTDlpWrap.getGithubReleases(1, 1))[0].tag_name;
	}

 if (!filePath) filePath = './' + fileName;
 let fileURL = 'https://github.com/yt-dlp/yt-dlp/releases/download/' + version + '/' + fileName;
 await YTDlpWrap.downloadFile(fileURL, filePath);
 !isWin32 && fs.chmodSync(filePath, '777');
 }





export function extractWebViewDll(onError?:(e:string)=>void){

	if (process.platform !=='win32') return

	const thePath = path.join(appEntryPointPath(),'WebView2Loader.dll')

	if (fs.pathExistsSync(thePath)) return thePath

	console.log('self extracting WebView2Loader.dll')

	try {
		fs.writeFileSync(thePath, fs.readFileSync(path.join(global.rootPath(), 'WebView2Loader.dll')))

	}catch (e) {

		const error = e as NodeJS.ErrnoException

		let errMsg = error?.message || String(e)


		if (error.code === 'EPERM'){

		errMsg = 'no permissions to extract necessary files in current dir'

		}


		onError(errMsg)


	}

	return thePath


}





