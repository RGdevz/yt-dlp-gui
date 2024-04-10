import {createApp} from 'vue'
import root from './root.vue'

import {getIPCEmitter} from "yue-helper/dist/client";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { md3 } from 'vuetify/blueprints'

export function initApp(el:Element){

 getIPCEmitter()

	if (!el) throw new Error('no element')

	const vue = createApp(root)

	const vuetify = createVuetify({
		blueprint:md3,
		theme:{
		
			defaultTheme:'dark'
		},
		components,
		directives,
	})

 return vue.use(vuetify).mount(el)

}
