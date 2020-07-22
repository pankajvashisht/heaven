<template>
  <input
    v-model="names"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :disabled="disable"
    :value="value"
    :class="classes"
    @input="onInput"
  >
</template>
<script>
export default {
    name:"Inputs",
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
      onInput: function({target:{value}}){
          this.$emit('input', value)
      }  
    }

}
</script>