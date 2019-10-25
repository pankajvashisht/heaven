<template>
    <button
      class="btn btn-danger btn-sm"
      @click="deleted" >
    <slot></slot>
    </button>
</template>
<script>
import swal from 'sweetalert'
import { deleteUser } from "../Apis/Admin";
export default {
    name:"Delete",
    props:["info", "models"],
    methods:{
        deleted:function(){
            swal({
                title: `Are you sure want delete?`,
                text: `Are you sure want to delete ` + this.models,
                icon: "warning",
                buttons: true,
                dangerMode: true
                }).then(willDelete => {
                if (willDelete) {
                    deleteUser({table:this.models,id:this.info}).then(() => {
                        swal(this.models+" have been deleted", {
                            icon: "success"
                        });
                        this.$emit('onDelete');
                    }).catch(err => {
                        swal("Something went wrong", {
                            icon: "error"
                        });
                    });
                } else {
                    swal("Process Cancel");
                }
                });
         }
    }
}
</script>