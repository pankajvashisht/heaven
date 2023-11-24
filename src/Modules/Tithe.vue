<template>
  <div>
    <Model v-if="showModel" @close="showModel = false" @save="onSave">
      <template v-slot:header>
        Edit Tithes {{ editTithes.name }}
      </template>
      <template v-slot:button-text>
        Update Tithes
      </template>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Name</label>
            <Input
              v-model="editTithes.name"
              type="text"
              name="name"
              placeholder="Name"
              classes="form-control"
              :class="{ 'is-invalid': !editTithes.name }"
              :value="editTithes.name"
            />
            <div v-show="!editTithes.name" class="invalid-feedback">
              Name is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Church name</label>
            <Input
              v-model="editTithes.church_name"
              type="text"
              name="church_name"
              placeholder="Church Name"
              classes="form-control"
              :class="{ 'is-invalid': !editTithes.church_name }"
            />
            <div v-show="!editTithes.church_name" class="invalid-feedback">
              Church name is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Revenue</label>
            <Input
              v-model="editTithes.turn_over"
              type="text"
              name="turn_over"
              placeholder="Revenue"
              classes="form-control"
              :class="{
                'is-invalid': !editTithes.turn_over,
              }"
            />
            <div v-show="!editTithes.turn_over" class="invalid-feedback">
              Revenue is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Over Head Cost</label>
            <Input
              v-model="editTithes.sale_cost"
              type="number"
              name="sale_cost"
              placeholder="Over Head Cost"
              classes="form-control"
              :class="{ 'is-invalid': !editTithes.sale_cost }"
            />
            <div v-show="!editTithes.sale_cost" class="invalid-feedback">
              Over Head Cost is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Net Income</label>
            <Input
              v-model="editTithes.gross_income"
              type="text"
              name="gross_income"
              placeholder="Net Income"
              classes="form-control"
              :class="{
                'is-invalid': !editTithes.gross_income,
              }"
            />
            <div v-show="!editTithes.gross_income" class="invalid-feedback">
              Net Income is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Balance</label>
            <Input
              v-model="editTithes.balance"
              type="number"
              name="editTithes.balance_based_per"
              placeholder="Balance"
              classes="form-control"
              :class="{
                'is-invalid': !editTithes.balance,
              }"
            />
            <div v-show="!editTithes.balance" class="invalid-feedback">
              Balance is required
            </div>
          </div>
        </div>
      </div>
    </Model>
    <div class="container animated slideInUp">
      <h3 class="title">
        Tithe
      </h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Church Name</th>
            <th>Revenue</th>
            <th>Over Head Cost</th>
            <th>Net Income</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <Spinner v-show="loading" class="spiiner" />
          <tr v-for="(tithe, index) in tithes" :key="tithe.id">
            <td>{{ tithe.name }}</td>
            <td>{{ tithe.church_name }}</td>
            <td>{{ tithe.turn_over }}</td>
            <td>{{ tithe.sale_cost }}</td>
            <td>{{ tithe.gross_income }}</td>
            <td>{{ tithe.balance }}</td>
            <td>
              <button class="btn btn-info" @click="editTithe(tithe, index)">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Spinner from "../components/Spinner";
import { Tithe, editTitheDetails } from "../Apis/Admin";
import Model from "../components/Model";
import Input from "../components/Input";
import swal from "sweetalert";
export default {
  name: "Tithe",
  components: {
    Spinner,
    Model,
    Input,
  },
  data() {
    return {
      tithes: [],
      loading: true,
      page: 1,
      search: "",
      limit: 20,
      total_record: 10,
      editTithes: {},
      editIndex: 0,
      showModel: false,
    };
  },
  mounted: function() {
    const { page, limit, search } = this;
    Tithe({ page, search, limit })
      .then((response) => {
        const { data } = response;
        this.tithes = data.data.result;
        this.total_record = data.data.pagination.total;
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        const { response } = err;
        swal("error", response.data.error_message, "error");
      });
  },
  methods: {
    editTithe: function(data, index) {
      this.editTithes = { ...data };
      this.editIndex = index;
      this.showModel = true;
    },
    onSave: function() {
      const isVaild = Object.values(this.editTithes).some(
        (value) => value.length === 0
      );
      if (!isVaild) {
        this.loading = true;
        this.showModel = false;
        editTitheDetails(this.editTithes)
          .then(() => {
            this.tithes[this.editIndex] = this.editTithes;
            this.editIndex = 0;
            swal("success", "Tithes Updated successfully", "success");
          })
          .catch(() => {
            swal("error", "Something went wrong", "error");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.spiiner {
  margin-left: 500px;
  margin-top: 30px;
}
</style>
