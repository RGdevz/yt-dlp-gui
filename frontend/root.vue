<template>

 <div style="text-align: center">

  <div style="padding-top: 2rem"></div>

 <h3 >YT-DLP Gui</h3>

  <div style="padding-top: 2rem"></div>

  <label style="display: flex; margin-left: 7px; font-weight: bold" for="url">Enter link:</label>
  <input ref="url" id="url" type="url" style="width: 99%; padding: 5px; border-radius: 10px; font-size: 1.1em">

  <div style="padding-top: 2rem"></div>

  <label style="font-weight: bold; margin-right: 2px"  for="quality">Select Quality:</label>

  <select ref="quality" style="font-size: 1.1em" id="quality">

   <option>Highest</option>
   <option>Medium</option>
   <option>Low</option>
<!--   <option>Sound only</option>-->
  </select>
  <div style="padding-top: 2rem"></div>

  <label style="font-weight: bold; margin-right: 2px" for="open">Open directory after finish:</label>
  <input checked type="checkbox" ref="open" id="open">

  <div style="padding-top: 2rem"></div>



  <button @click="startDownload" style="padding: 10px; border: black solid 1px; border-radius: 10px; font-weight: bold; color: white; background: black">Download</button>
<!--  <button @click="test">test</button>-->

  <div style="padding-top: 3rem"></div>


  <textarea disabled style="width: 99%; height: 220px; background: rgba(63,63,63,0.5); color: white; border-radius: 10px; padding: 5px" >
   {{data}}
  </textarea>


  <div style="padding-top: 2rem"></div>

 </div>

</template>


<script  lang="ts">

import {emitBackend,getIPCEmitter} from "yue-helper/dist/client";
import {downloadArgs} from "../src/types";

export default {


  data(){
  return{

   data:'...',
  downloading:false,


  }
  },



   mounted() {


   getIPCEmitter().on('dlp-data',(data)=>{

   console.log(data)

   this.data = data
   }
   )



 },




  methods:{


   async test(){
   const res = await emitBackend('test')
   alert(res)
   },



  async startDownload(){

  const link = this.$refs['url']?.value?.trim()
  const quality = this.$refs['quality'].value


   if (!link){
   alert('no link')
   return
   }


  const args = {quality:quality,url:link,openDir:this.$refs['open'].checked} as downloadArgs


  const res = await emitBackend('download', JSON.stringify(args))

  if (res === '1') {

  this.data ='Starting download...'
  }

  }

 },

 name:'root'
}

</script>

<style scoped>

</style>

