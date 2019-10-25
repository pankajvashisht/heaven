<template>
  <div class="container animated slideInUp">
       <h5 class="text-center">Add User</h5>
        <hr>
  <div class="card">
  <div class="card-header text-center text-white bg-info"> Add User </div>

  <div class="card-body">
    <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <label for="sel1">Name</label>
                    <Input v-model="name" type='text' name="name" placeholder="Name" classes='form-control' :class="{ 'is-invalid': submitted && !name }"/>
                    <div v-show="submitted && !name" class="invalid-feedback">Name is required</div>
                </div>
            </div>
            <div class="col-6">
                 <div class="form-group">
                    <label for="sel1">Email</label> 
                    <Input v-model="email" type='email' name="email" placeholder="Email" classes='form-control' :class="{ 'is-invalid': submitted && !email }"/>
                    <div v-show="submitted && !email" class="invalid-feedback">Email is required</div>
                 </div>  
                
            </div>
            <div class="col-6">
                <div class="form-group">
                    <label for="sel1">Password</label>
                    <Input v-model="password" type='password' name="password" placeholder="Password" classes='form-control' :class="{ 'is-invalid': submitted && !password }"/>
                    <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
                </div>
            </div>
            <div class="col-6" >
                
                <div class="form-group" >
                    <label for="sel1">Phone</label>
                    <Input v-model="phone" type='number' name="phone" placeholder="Phone" classes='form-control' :class="{ 'is-invalid': submitted && !phone }"/>
                    <div v-show="submitted && !phone" class="invalid-feedback">Phone is required</div>
            </div>
            </div>
    </div>
  </div>
  
    <div class="card-footer text-center">
        <button v-on:click="addUser()" :disabled="disabled" class="btn btn-info btn-primary">Save <i class="fa fa-spinner fa-spin" v-show="disabled" ></i>  </button>

   </div>
   </div>
</div>
</template>

<script>
import swal from "sweetalert";
import { addUser } from '../../Apis/Admin'
import Input from '../../components/Input'
export default {
  name: 'Adduser',
  components:{
      Input
  },
  data:function() {
      return {
           name:"",
           email:"",
           password:"",
           phone:"",
           submitted:false,
           loading:false,
           disabled:false, 
    }
  },
  methods:{
      addUser:function(){
        this.submitted = true;  
        const { email, password, name, phone } = this;
            if (!(email && password && phone && name)) {
                return;
            }
            this.loading = this.disabled = true;
            addUser(this).then(()=>{
                swal('info', 'User add successfully','success')
                this.$router.push({name:"users"});
            }).catch(err => {
                this.loading = this.disabled = false;
                const { data } = err.response;
                swal('Error', data.error_message,'error');
            });
      }
  }
}
</script>


<style>
  .user-detail-col {
    display: flex;
    width: 100%;
    flex-flow: row;
    margin: 0 0 20px;
  }
  .user-detail-col img {
      margin: 0 15px;
  }
  .user-detail-col span {
      display: flex;
  }
  .select-friend-box {
      margin: 15px 0 0;
  }
  .form-box {
      display: flex;
  }
  .form-box select {
      margin: 0 10px 0;
  }
  .vdp-datepicker *{
      border: 0;
  }
  option.avatar {
      background-repeat: no-repeat !important;
      padding-left: 20px;
 }
</style>