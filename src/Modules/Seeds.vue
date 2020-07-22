<template>
  <div>
    <Model
      v-if="showModel"
      @close="showModel = false"
      @save="onSave"
    >
      <template v-slot:header>
        Edit Seed {{ editSeeds.name }}
      </template>
      <template v-slot:button-text>
        Update Seed
      </template>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Name</label>
            <Input
              v-model="editSeeds.name"
              type="text"
              name="name"
              placeholder="Name"
              classes="form-control"
              :class="{ 'is-invalid': !editSeeds.name }"
              :value="editSeeds.name"
            />
            <div
              v-show="!editSeeds.name"
              class="invalid-feedback"
            >
              Name is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Church name</label>
            <Input
              v-model="editSeeds.church_name"
              type="text"
              name="church_name"
              placeholder="Church Name"
              classes="form-control"
              :class="{ 'is-invalid': !editSeeds.church_name }"
            />
            <div
              v-show="!editSeeds.church_name"
              class="invalid-feedback"
            >
              Church name is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Return Expection</label>
            <Input
              v-model="editSeeds.return_expection"
              type="text"
              name="return_expection"
              placeholder="Return Expection"
              classes="form-control"
              :class="{
                'is-invalid': !editSeeds.return_expection,
              }"
            />
            <div
              v-show="!editSeeds.return_expection"
              class="invalid-feedback"
            >
              Return Expection is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Earth Measure</label>
            <Input
              v-model="editSeeds.earth_measure"
              type="number"
              name="editSeeds.earth_measure"
              placeholder="Earth Measure"
              classes="form-control"
              :class="{ 'is-invalid': !editSeeds.earth_measure }"
            />
            <div
              v-show="!editSeeds.earth_measure"
              class="invalid-feedback"
            >
              Earth Measure is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Heaven Measure</label>
            <Input
              v-model="editSeeds.heaven_measure"
              type="text"
              name="heaven_measure"
              placeholder="Heaven Measure"
              classes="form-control"
              :class="{
                'is-invalid': !editSeeds.heaven_measure,
              }"
            />
            <div
              v-show="!editSeeds.heaven_measure"
              class="invalid-feedback"
            >
              Heaven Measure is required
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="sel1">Amount</label>
            <Input
              v-model="editSeeds.balance_based_per"
              type="number"
              name="editSeeds.balance_based_per"
              placeholder="Amount"
              classes="form-control"
              :class="{
                'is-invalid': !editSeeds.balance_based_per,
              }"
            />
            <div
              v-show="!editSeeds.balance_based_per"
              class="invalid-feedback"
            >
              Amount is required
            </div>
          </div>
        </div>
      </div>
    </Model>

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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <Spinner
            v-show="loading"
            class="spiiner"
          />
          <tr
            v-for="(seed, index) in seeds"
            :key="seed.id"
          >
            <td>{{ seed.name }}</td>
            <td>{{ seed.church_name }}</td>
            <td>{{ seed.return_expection }}</td>
            <td>{{ seed.earth_measure }}</td>
            <td>{{ seed.heaven_measure }}</td>
            <td>{{ seed.balance_based_per }}</td>
            <td>
              <button
                class="btn btn-info"
                @click="editSeed(seed, index)"
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
import { Seeds, editSeedDetails } from '../Apis/Admin';
import Model from '../components/Model';
import Input from '../components/Input';
import swal from 'sweetalert';
export default {
	name: 'Seeds',
	components: {
		Spinner,
		Model,
		Input,
	},
	data() {
		return {
			seeds: [],
			loading: true,
			page: 1,
			search: '',
			limit: 20,
			total_record: 10,
			editSeeds: { name: '' },
			showModel: false,
			editIndex: 0,
		};
	},
	mounted: function() {
		const { page, limit, search } = this;
		Seeds({ page, search, limit })
			.then((response) => {
				const { data } = response;
				this.seeds = data.data.result;
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
		editSeed: function(data, index) {
			this.editSeeds = { ...data };
			this.editIndex = index;
			this.showModel = true;
		},
		onSave: function() {
			const isVaild = Object.values(this.editSeeds).some(
				(value) => value.length === 0
			);
			if (!isVaild) {
				this.loading = true;
				this.showModel = false;
				editSeedDetails(this.editSeeds)
					.then(() => {
						this.seeds[this.editIndex] = this.editSeeds;
						this.editIndex = 0;
						swal('success', 'Seed Updated successfully', 'success');
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
