declare global {

	interface Window {
	rootPath:()=>string
	}

 }

export {}



export interface downloadArgs{
	quality:'Highest' | 'Medium' | 'Low'
	url:string
	openDir:boolean
}
