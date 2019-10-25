<template>
    <div class="container animated slideInUp">
    <div class="row">
        <div style="cursor:pointer"  class="col-md-4 col-xl-3" @click="redirect('users')">
            <div class="card bg-c-blue order-card">
                <div class="card-block">
                    <h6 class="m-b-20">Users</h6>
                    <h2 class="text-right"><i class="fa fa-users f-left"></i><span>{{users}}</span></h2>
                    <p class="m-b-0">Total Users<span class="f-right"></span></p>
                </div>
            </div>
        </div>
        
        <div style="cursor:pointer"  class="col-md-4 col-xl-3" @click="redirect('tithe')">
            <div class="card bg-c-green order-card">
                <div class="card-block">
                    <h6 class="m-b-20">Tithe</h6>
                    <h2 class="text-right"><i class="fa fa-rocket f-left"></i><span>{{tithe}}</span></h2>
                    <p class="m-b-0">Total Tithe<span class="f-right"></span></p>
                </div>
            </div>
        </div>
        <div style="cursor:pointer"  class="col-md-4 col-xl-3" @click="redirect('seeds')">
            <div class="card bg-c-yellow order-card">
                <div class="card-block">
                    <h6 class="m-b-20">Seeds</h6>
                    <h2 class="text-right"><i class="fa fa-refresh f-left"></i><span>{{seeds}}</span></h2>
                    <p class="m-b-0">Total Seeds<span class="f-right"></span></p>
                </div>
            </div>
        </div>
        
        <div style="cursor:pointer"  class="col-md-4 col-xl-3" @click="redirect('transaction')">
            <div class="card bg-c-pink order-card">
                <div class="card-block">
                    <h6 class="m-b-20">Transactions</h6>
                    <h2 class="text-right"><i class="fa fa-credit-card f-left"></i><span>{{transactions}}</span></h2>
                    <p class="m-b-0">Total transactions<span class="f-right"></span></p>
                </div>
            </div>
        </div>
	</div>
    <Spinner v-if="loading" />
</div>
</template>

<script>
import Spinner  from '../components/Spinner'
import {dashBaord} from '../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:"Dashboard",
    components:{
     Spinner
    },
    data(){
        return {
            tithe:0,
            users: 0,
            seeds: 0,
            transactions: 0,
            loading:true,
        }
    },
    created:function(){
        dashBaord().then(response => {
           const  {data}  = response.data;
           this.loading = false;
           this.tithe = data.tithe; 
           this.seeds = data.seeds; 
           this.transactions = data.transactions; 
           this.users = data.users; 
        }).catch(err => {
        this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
    },
    methods:{
        redirect:function(path){
            this.$router.push({name:path});
        }
    },
}
</script>

<style  scoped>
.order-card {
    color: #fff;
}

.bg-c-blue {
    background: linear-gradient(45deg,#4099ff,#73b4ff);
}

.bg-c-green {
    background: linear-gradient(45deg,#2ed8b6,#59e0c5);
}

.bg-c-yellow {
    background: linear-gradient(45deg,#FFB64D,#ffcb80);
}

.bg-c-pink {
    background: linear-gradient(45deg,#FF5370,#ff869a);
}


.card {
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
    box-shadow: 0 1px 2.94px 0.06px rgba(4,26,55,0.16);
    border: none;
    margin-bottom: 30px;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}

.card .card-block {
    padding: 25px;
}

.order-card i {
    font-size: 26px;
}

.f-left {
    float: left;
}

.f-right {
    float: right;
}
</style>