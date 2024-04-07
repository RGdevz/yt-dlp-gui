import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig(  {

 plugins: [

  vue(),
  /*  viteCommonjs()*/
 ],

 resolve: { alias: { 'vue': 'vue/dist/vue.esm-bundler.js' }},

 build: {

  outDir: './static/',


  target: 'chrome70',

 },

})
