<template>
<div class="container animated slideInUp">
     <h3 class="title">Tithe</h3>
     <table class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Church Name</th>
        <th>Turn Over</th>
        <th>Sale Cost</th>
        <th>Gross Income</th>
        <th>Balance</th>

      </tr>
    </thead>
    <tbody>
        <Spinner v-show="loading" class="spiiner"/>
      <tr v-for="tithe in tithes" v-bind:key="tithe.id">
        <td>{{tithe.name}}</td>
        <td>{{tithe.church_name}}</td>
         <td>{{tithe.turn_over}}</td>
         <td>{{tithe.sale_cost}}</td>
          <td>{{tithe.gross_income}}</td>
          <td>{{tithe.balance}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>
import Spinner  from '../components/Spinner'
import {Tithe} from '../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:"Tithe",
    components:{
     Spinner
    },
    data(){
        return {
            tithes:[],
            loading:true,
            page: 1,
            search:"",
            limit:20,
            total_record: 10,
        }
    },
    mounted:function(){
      const {page,limit,search} = this;
      Tithe({page,search,limit}).then(response => {
        const  {data}  = response;
        this.tithes = data.data.result;
        this.total_record = data.data.pagination.total;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
    },
}
</script>
<style scoped>
.spiiner{
    margin-left: 500px;
    margin-top: 30px;
}
</style>