<template>
	<transition name="modal-fade">
		// eslint-disable-next-line vue/max-attributes-per-line
		<div class="modal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">
							<slot name="header" />
						</h5>
						<button
							type="button"
							class="close"
							data-dismiss="modal"
							aria-label="Close"
							@click="close"
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<slot />
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="save">
							<slot name="button-text">
								Save
							</slot>
						</button>
						<button
							type="button"
							class="btn btn-secondary"
							data-dismiss="modal"
							@click="close"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	name: 'Model',
	methods: {
		close() {
			this.$emit('close');
		},
		save() {
			this.$emit('save');
		},
	},
};
</script>
<style>
.modal {
	width: 100%;
	overflow-x: auto;
	display: flex;
	flex-direction: row;
}
.modal-dialog {
	width: 100%;
}
</style>
