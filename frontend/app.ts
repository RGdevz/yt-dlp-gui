import {createApp} from 'vue'
import root from './root.vue'

import {getIPCEmitter} from "yue-helper/dist/client";
export function initApp(el:Element){

 getIPCEmitter()

	if (!el) throw new Error('no element')

	const vue = createApp(root)

 return vue.mount(el)

}
