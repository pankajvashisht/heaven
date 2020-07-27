<template>
  <div>
    <Model
      v-if="showModel"
      @close="showModel = false"
      @save="onSave"
    >
      <template v-slot:header>
        Edit Alms {{ editAlms.name }}
      </template>
      <template v-slot:button-text>
        Update Alms
      </template>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Name</label>
            <Input
              v-model="editAlms.name"
              type="text"
              name="name"
              placeholder="Name"
              classes="form-control"
              :class="{ 'is-invalid': !editAlms.name }"
              :value="editAlms.name"
            />
            <div
              v-show="!editAlms.name"
              class="invalid-feedback"
            >
              Name is required
            </div>
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Amount</label>
            <Input
              v-model="editAlms.amount"
              type="text"
              name="return_expection"
              placeholder="Return Expection"
              classes="form-control"
              :class="{
                'is-invalid': !editAlms.amount,
              }"
            />
            <div
              v-show="!editAlms.amount"
              class="invalid-feedback"
            >
              Amount is required
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label for="sel1">Description</label>
            <textarea
              v-model="editAlms.description"
              type="number"
              name="editAlms.description"
              placeholder="Earth Measure"
              class="form-control"
              :class="{ 'is-invalid': !editAlms.description }"
            />
            <div
              v-show="!editAlms.description"
              class="invalid-feedback"
            >
              Description is required
            </div>
          </div>
        </div>
      </div>
    </Model>

    <div class="container animated slideInUp">
      <h3 class="title">
        Alms
      </h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <Spinner
            v-show="loading"
            class="spiiner"
          />
          <tr
            v-for="(alm, index) in alms"
            :key="alm.id"
          >
            <td>{{ alm.name }}</td>
            <td>{{ alm.amount }}</td>
            <td>{{ alm.description.length > 30 ? `${alm.description.substring(0, 30)}...`:alm.description }}</td>
            <td>
              <button
                class="btn btn-info"
                @click="editAlmsData(alm, index)"
              >
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
import Spinner from '../components/Spinner';
import { GetAlms, editAlmsDetails } from '../Apis/Admin';
import Model from '../components/Model';
import Input from '../components/Input';
import swal from 'sweetalert';
export default {
	name: 'Alms',
	components: {
		Spinner,
		Model,
		Input,
	},
	data() {
		return {
			alms: [],
			loading: true,
			page: 1,
			search: '',
			limit: 20,
			total_record: 10,
			editAlms: { name: '' },
			showModel: false,
			editIndex: 0,
		};
	},
	mounted: function() {
		const { page, limit, search } = this;
		GetAlms({ page, search, limit })
			.then((response) => {
				const { data } = response;
				this.alms = data.data.result;
				this.total_record = data.data.pagination.total;
				this.loading = false;
			})
			.catch((err) => {
				this.loading = false;
				const { response } = err;
				swal('error', response.data.error_message, 'error');
			});
	},
	methods: {
		editAlmsData: function(data, index) {
			this.editAlms = { ...data };
			this.editIndex = index;
			this.showModel = true;
		},
		onSave: function() {
			const isVaild = Object.values(this.editAlms).some(
				(value) => value.length === 0
			);
			if (!isVaild) {
				this.loading = true;
				this.showModel = false;
				editAlmsDetails(this.editAlms)
					.then(() => {
						this.alms[this.editIndex] = this.editAlms;
						this.editIndex = 0;
						swal('success', 'Alms Updated successfully', 'success');
					})
					.catch(() => {
						swal('error', 'Something went wrong', 'error');
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
