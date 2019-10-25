<template>
<div class="container animated slideInUp">
     <h3 class="title">Transaction</h3>
     <table class="table table-striped">
    <thead>
      <tr>
        <th>User name</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Total Balance</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
        <Spinner v-show="loading" class="spiiner"/>
      <tr v-for="trans in transaction" v-bind:key="trans.id">
        <td>{{trans.name}}</td>
        <td>{{trans.amount}}</td>
        <td v-html="types(trans.type)"></td>
        <td>{{trans.total}}</td>
         <td>{{trans.created}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>
import Spinner  from '../components/Spinner'
import {Transaction} from '../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:"Transaction",
    components:{
     Spinner
    },
    data(){
        return {
            transaction:[],
            loading:true,
             page: 1,
            search:"",
            limit:20,
            total_record: 10,
        }
    }, mounted:function(){
      const {page,limit,search} = this;
      Transaction({page,search,limit}).then(response => {
        const  {data}  = response;
        this.transaction = data.data.result;
        this.total_record = data.data.pagination.total;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
    },methods:{
        types:function(type){
            if(type == 1){
                return '<span style="cursor:pointer" class="badge badge-pill badge-danger">Seeds</span>';
            }else if(type == 2){
                return '<span style="cursor:pointer" class="badge badge-pill badge-warning">Tiths</span>';
            }else{
                return '<span style="cursor:pointer" class="badge badge-pill badge-success">withdrawal</span>';
            }
        }
    }
}
</script>
<style scoped>
.spiiner{
    margin-left: 500px;
    margin-top: 30px;
}
</style>