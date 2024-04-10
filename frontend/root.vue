<template>

 <div style="text-align: center">

  <div style="padding-top: 2rem"></div>

 <h3 >YT-DLP Gui</h3>



  <div style="padding-top: 2rem"></div>



  <v-text-field base-color="red"  color="red" rounded ref="url" label="URL" style="width: 97%; margin-inline: auto" variant="outlined"></v-text-field>

  <div style="padding-top: 1rem"></div>

  <v-select color="red" class="w-33" style="margin-inline: auto"
   ref="quality"
   label="Select Quality"

  base-color="red"
   :items="['Highest', 'Medium', 'Low']"
   variant="outlined"
   rounded
  v-model="quality"
  ></v-select>

<!--  <select ref="quality" style="font-size: 1.1em" id="quality">

   <option>Highest</option>
   <option>Medium</option>
   <option>Low</option>

  </select>-->

  <div style="padding-top: 1rem"></div>


  <v-checkbox

   style="margin-inline: auto; width: fit-content"
   color="red"
   hide-details
   base-color="red"
   v-model="checked"
   label="Open directory after finish">

  </v-checkbox>




  <div style="padding-top: 2rem"></div>



  <v-btn  :loading="downloading === '1'"  @click="startDownload" height="55" size="large" color="red" variant="outlined">Download</v-btn>


  <div style="padding-top: 3rem"></div>


  <textarea  disabled style="width: 99%; height: 220px; background: rgba(63,63,63,0.5); color: white; border-radius: 10px; padding: 5px; resize: none" >
   {{data}}
  </textarea>


  <div style="padding-top: 1rem"></div>

 </div>

</template>


<script  lang="ts">

import {emitBackend,getIPCEmitter} from "yue-helper/dist/client";
import {downloadArgs} from "../src/types";

export default {


  data(){
  return{

   data:'...',
  downloading:'0',
   checked:true,

   quality:'Highest'

  }
  },



   mounted() {

   getIPCEmitter().on('downloading',(value)=>this.downloading = value)

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


  const args = {quality:quality,url:link,openDir:this.checked} as downloadArgs


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

