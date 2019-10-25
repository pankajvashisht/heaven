<template>
 <input :type="type" :placeholder="placeholder" :name="name" :disabled="disable" v-model="names" :value="value" :class="classes" v-on:input="onInput"/>
</template>
<script>
export default {
    name:"inputs",
    props:["placeholder", "classes", "type", "value", "name", "disabled"],
    data:function(){
        return{
            names:this.value || '',
            disable: this.disabled || false,
        }
    },
    mounted:function(){
        this.class = "form-control";
    },
    methods:{
      onInput: function($event){
          this.$emit('input', $event.target.value)
      }  
    }

}
</script>