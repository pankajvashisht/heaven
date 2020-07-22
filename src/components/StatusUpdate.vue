<template>
  <span
    style="cursor:pointer"
    :class="classes"
    @click="updateStatus"
  >{{ text }}</span>
</template>
<script>
import { updateUser } from '../Apis/Admin'
export default {
    name:"Status",
    props:["info", "models"],
    data(){
        return {
            status: this.info.status,
            text:"Active",
            classes:"badge badge-pill badge-success",
        }
    },
    mounted:function(){
        if(this.status === 1){
            this.text = "Active";
            this.classes = "badge badge-pill badge-success";
        }else{
            this.text = "Deactive";
            this.classes = "badge badge-pill badge-danger";
        }
    },
    methods:{
        updateStatus:function(){
            if(this.status === 1){
                this.status = 0;
                this.text = "Deactive";
                this.classes = "badge badge-pill badge-danger";
            }else{
                this.status = 1;
                this.text = "Active";
                this.classes = "badge badge-pill badge-success";
            }
            this.info.status = this.status;
            this.info.table = this.models;
            updateUser(this.info).then(() => {
                this.$emit('updated', this.info);
            });
        }
    }
    
}
</script>