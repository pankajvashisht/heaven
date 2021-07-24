<template>
  <div class="container animated slideInUp">
    <div class="row">
      <div class="col-12">
        <Tophead>
          <div class="float-left">
            Users
          </div> 
          <template>
            <button
              class="btn btn-info float-right"
              @click="addUser"
            >
              Add User
            </button>
          </template>
        </Tophead>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <table
          id="dtBasicExample"
          class="table table-striped"
        >
          <thead>
            <tr>
              <th class="th-sm">
                No 
              </th>
              <th class="th-sm">
                Name
              </th>
              <th class="th-sm">
                Email
              </th>
              <th class="th-sm">
                Phone
              </th>
              <th class="th-sm">
                Balance
              </th>
              <th class="th-sm">
                Status
              </th>
              <th class="th-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <Spinner
              v-show="loading"
              class="spiiner"
            />
            <tr
              v-for="(user,key) in all_users"
              :key="user.id"
            >
              <td>{{ ((currentPage * 20)-20)+key+1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.total_amount }}</td>
              <td>
                <StatusUpdate
                  models="users"
                  :info="user"
                />
              </td>
              <td>
                <button
                  class="btn btn-primary btn-sm"
                  @click="tiths(user.id)"
                >
                  Tiths
                </button> &nbsp; <button
                  class="btn btn-success btn-sm"
                  @click="seed(user.id)"
                >
                  Seeds
                </button> &nbsp;
                <router-link
                  class="btn btn-info btn-sm"
                  :to="{ name: 'edit-user', params: { user } }"
                >
                  Edit
                </router-link>&nbsp; 
                <DeleteData
                  models="users"
                  :info="user.id"
                  @onDelete="deleted(key)"
                >
                  Delete
                </DeleteData>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :limit="20"
        :total="total_record"
        :displayed="5"
        @handle-click="clickCallback"
      />
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
        pageCount: 0,
        currentPage : 1,
      }
    },
    watch:{
      pages:function(no){
        return no+1;
      }
    },
    mounted:function(){
      const {page,limit,search} = this;
      UserList({page,search,limit}).then(response => {
        const  {data}  = response;
        this.all_users = data.data.result;
        this.total_record = data.data.pagination.total;
        this.pageCount = Math.round(data.data.pagination.total/20, 0);
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        const {response} = err;
        swal('error', response.data.error_message, 'error');
      });
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
     clickCallback :function(page){
        this.currentPage = page;
         const {limit,search} = this;
         this.loading = true;
         this.all_users = [];
          UserList({page,search,limit}).then(response => {
            const  {data}  = response;
            this.all_users = data.data.result;
            this.total_record = data.data.pagination.total;
            this.pageCount = Math.round(data.data.pagination.total/20, 0);
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            const {response} = err;
            swal('error', response.data.error_message, 'error');
          });
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