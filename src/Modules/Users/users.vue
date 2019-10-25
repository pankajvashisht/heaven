<template>

    <div class="container animated slideInUp">
      <div class="row">
        <div class="col-12">
        <Tophead> <div class="float-left"> Users </div> 
        <template v-slot="button" > <button class="btn btn-info float-right" @click="addUser"> Add User</button></template>
        </Tophead>
        </div>
    </div>
    <div class="row">
    <div class="col-12">
     <table id="dtBasicExample" class="table table-striped">
  <thead>
    <tr>
      <th class="th-sm">No 
      </th>
      <th class="th-sm">Name
      </th>
      <th class="th-sm">Email
      </th>
      <th class="th-sm">Phone
      </th>
      <th class="th-sm">Balance
      </th>
      <th class="th-sm">Status
      </th>
      <th class="th-sm">Action </th>
    </tr>
  </thead>
  <tbody>
    <Spinner v-show="loading" class="spiiner"/>
    <tr v-for="(user,key) in all_users" v-bind:key="user.id">
      <td>{{key+1}}</td>
      <td>{{user.name}}</td>
      <td>{{user.email}}</td>
      <td>{{user.phone}}</td>
      <td>{{user.total_amount}}</td>
      <td><StatusUpdate models='users' :info="user" /></td>
      <td><button @click="tiths(user.id)" class="btn btn-primary btn-sm"> Tiths </button> &nbsp; <button @click="seed(user.id)" class="btn btn-success btn-sm"> Seeds </button> &nbsp;
      <router-link class="btn btn-info btn-sm" :to="{ name: 'edit-user', params: { user } }">
        Edit
      </router-link>&nbsp; 
      <DeleteData @onDelete="deleted(key)" models='users' :info="user.id"> Delete </DeleteData></td>
    </tr>
  </tbody>
</table>
  
    </div>
    <Pagination :posts="all_users" :limit="20" @Previous="prev" @next="next" :total="total_record"/>
    </div>
    </div>
    
</template>

<script>
import Tophead from '../../components/Tophead'
import Spinner  from '../../components/Spinner'
import Pagination from '../../components/Pagination'
import StatusUpdate from '../../components/StatusUpdate'
import DeleteData from '../../components/DeleteData'
import {UserList} from '../../Apis/Admin'
import swal from 'sweetalert'
export default {
    name:"Users",
    components:{
      Tophead,
      Spinner,
      Pagination,
      StatusUpdate,
      DeleteData
    },
    data(){
      return{
        loading: true,
        all_users: [],
        page: 1,
        search:"",
        limit:20,
        total_record:0,
      }
    },
    mounted:function(){
      const {page,limit,search} = this;
      UserList({page,search,limit}).then(response => {
        const  {data}  = response;
        this.all_users = data.data.result;
        this.total_record = data.data.pagination.total;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
    },
    watch:{
      pages:function(no){
        return no+1;
      }
    },
    methods:{
      addUser : function(){
        this.$router.push({name:'add-user'});
      },
      deleted:function(key){
          this.all_users.splice(key,1);
      },
      tiths:function(user_id){
        this.$router.push({name: 'tithe', query: { id: user_id }})
      },
      seed:function(user_id){
        this.$router.push({name: 'seeds', query: { id: user_id }})
      },
      prev:function(){
        //alert();
      },next:function(){
        //alert();
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