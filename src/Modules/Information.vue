<template>
  <div class="animated slideInUp">
    <h3>Infromation </h3>
    <hr>
    <select class="form-control" @change="updates" v-model="id"> 
      <option v-for="app in appData" v-bind:key="app.id" :value="app.id"> {{app.key}}</option>
    </select>
    <hr>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    <Spinner v-if="loading" />
    <hr>
    <button @click="updateInfo" :disabled="disabled" class="btn btn-info text-center"> <i class="fa fa-spinner fa-spin" v-show="disabled" ></i> Update </button>
  </div>
</template>
<script>
import Spinner  from '../components/Spinner'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {appInfo ,appInfoUpdate} from '../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:'Information',
    components:{
     Spinner
    },
    data() {
    return {
       disabled:false,
       loading: true,
       id:0,
       appData:[], 
       editor: ClassicEditor,
        editorData: '<p>Content of the editor.</p>',
        editorConfig: {
            // The configuration of the editor.
        }
    }
  },created:function(){
      appInfo().then(response => {
          this.loading = false;
          const  {data}  = response.data;
          this.id = data[0].id;
          this.editorData = data[0].value;
          this.appData = data;
        }).catch(err => {
        const {response} = err;
        this.loading = false;
        swal('error', response.data.error_message, 'error');
      });
  },methods:{
      updates:function(){
          this.appData.filter((val) => {
              if(this.id == val.id){
                  this.editorData = val.value;
              }
          });
      },updateInfo:function(){
          this.loading = this.loading = true;
          const info = {
              id: this.id,
              value: this.editorData,
              table:'app_informations'
          };
          appInfoUpdate(info).then(() => {
           this.loading = this.loading = false;
           swal('Info', "Data Updated", 'success');
        }).catch(err => {
        this.loading = this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
      }
  }
}
</script>