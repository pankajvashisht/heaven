<template>
  <div id="app">
    <component :is="layout()">
      <router-view />
    </component>
  </div>
</template>

<script>


export default {
  name: 'App',
  methods:{
   
    layout(){
      if(this.$route.meta.layout){
        return this.$route.meta.layout+ '-layout';
      }else{
         return "login-layout"
      }
      
    }
  }
}
</script>

<style>
  @import './assets/Css/animation.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
