<template>
  <div class="container animated slideInUp">
    <h3 class="title">
        Seeds
    </h3>
    <table class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Church Name</th>
        <th>Return Expection</th>
        <th>Earth Measure</th>
         <th>Heaven Measure</th>
          <th>Amount</th>
      </tr>
    </thead>
    <tbody>
       <Spinner v-show="loading" class="spiiner"/>
      <tr v-for="seed in seeds" v-bind:key="seed.id">
        <td>{{seed.name}}</td>
         <td>{{seed.church_name}}</td>
         <td>{{seed.return_expection}}</td>
          <td>{{seed.earth_measure}}</td>
           <td>{{seed.heaven_measure}}</td>
            <td>{{seed.balance_based_per}}</td>
      </tr>
    </tbody>
  </table>
 </div>
</template>
<script>
import Spinner  from '../components/Spinner'
import {Seeds} from '../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:"Seeds",
    components:{
     Spinner
    },
    data(){
        return {
            seeds:[],
            loading:true,
            page: 1,
            search:"",
            limit:20,
            total_record: 10,
        }
    },mounted:function(){
      const {page,limit,search} = this;
      Seeds({page,search,limit}).then(response => {
        const  {data}  = response;
        this.seeds = data.data.result;
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