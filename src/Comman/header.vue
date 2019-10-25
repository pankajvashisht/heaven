<template>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
            <!-- Brand -->
            <img class="img" src="https://pbs.twimg.com/profile_images/1016305949659860993/6aOTJDBj_400x400.jpg" height="40px" width="40px"/>

            <a class="navbar-brand" > Activity</a>

            <!-- Links -->
            <ul class="navbar-nav float-right">
                <li class="nav-item">
                    <router-link class="nav-link" active-class="active"  to="mybooking">My Booking</router-link>  
                </li>
                 <li class="nav-item">
                    <router-link class="nav-link" active-class="active"  to="booked_slots">Booked Slots</router-link>  
                </li>
                <li class="nav-item">
                     <router-link class="nav-link" active-class="active" to="booking">Create Booking</router-link>  
                </li>
                <li class="nav-item">
                     <router-link class="nav-link" active-class="active" to="rules"> Booking & Games Rules </router-link>  
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <img v-bind:src="userInfo.social_image" height="30px" width="30px" class="rounded img" :alt="userInfo.name">
                <div class="card bg-info">
            <li class="nav-item">
                    <a class="nav-link" ><b>{{userInfo.name}}</b></a>  
             </li>
             </div>
             <li class="nav-item">
                    <a class="nav-link" href="#" @click="logout"  ><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a>  
             </li>
  </ul>

    </nav>
</template>

<script>
    
    export default {
         name: 'navBar',
         data:function(){
             return {
                 userInfo:[]
             }
         },
         created:function(){
             this.userInfo = JSON.parse(this.authuser);
         },
         methods:{
             logout:function(){
                 localStorage.clear();
                 this.$router.push({name:'login'});
             }
         }
    }
</script>
<style>
    .navbar-dark .navbar-brand {
        color: #fff !important;
        margin-left: 10px;
    }.img{
        margin-right: 10px;
        margin-top: 6px;
    }
</style>