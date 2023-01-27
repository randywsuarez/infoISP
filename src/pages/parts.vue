<template>
	<q-page class="bg-grey-10">
		<div class="row col">
			<div class="col-9">
				<q-card dark bordered class="bg-grey-9" style="width: 95vw">
					<q-card-section>
						<div class="text-h6">Add Parts</div>
					</q-card-section>

					<q-card-section class="row col q-pt-none">
						<div class="col-md-6 col-xs-12">
							<q-select
								dark
								outlined
								v-model="form.type"
								:options="type"
								map-options
								emit-value
								label="Select Grade"
							/>
						</div>
						<div class="col-md-6 col-xs-12">
							<q-select
								dark
								outlined
								v-model="form.pallet"
								:options="pallet"
								map-options
								emit-value
								label="Select Pallet"
							/>
						</div>
						<div class="col-12">
							<q-input dark outlined v-model="form.serial" label="Serial Number" />
						</div>
						<div class="col-md-6 col-xs-12">
							<q-checkbox
								dark
								left-label
								v-model="form.duplicate"
								label="Duplicate Label"
								checked-icon="task_alt"
								unchecked-icon="highlight_off"
							/>
						</div>

						<q-btn
							dark
							label="Save"
							color="primary"
							class="col col-12 self-end q-mt-md fixed-bottom rounded-borders q-pa-md q-ma-sm"
							@click="save"
						/>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>
<script>
	import { required } from 'vuelidate/lib/validators'
	import { Loading } from 'quasar'
	export default {
		data() {
			return {
				data: [],
				form: {
					duplicate: false,
				},
				type: [
					{
						label: 'Type 1',
						value: 1,
					},
					{
						label: 'Type 2',
						value: 2,
					},
					{
						label: 'Type 3',
						value: 3,
					},
				],
				pallet: [
					{
						label: 'C101',
						value: 'C101',
					},
				],
			}
		},
		validations: {
			form: {
				descripcion: { required },
			},
		},
		methods: {
			async srSave() {
				/* this.$v.form.$touch()
				if (this.$v.form.$error) {
					return
				} */
				Loading.show()
				if (!this.form._id)
					await this.$db
						.doc('areas')
						.add(this.form)
						.then((v) => {
							console.log(v)
							Loading.hide()
						})
				else
					await this.$db
						.doc(`areas/${this.form._id}`)
						.update(this.form)
						.then((v) => {
							Loading.hide()
						})
				this.$router.push('/herramientas/area')
			},
		},
		async mounted() {
			console.log(this.$infoSystem)
			//	this.data = await rs.system()
			//await rs.system().then((data) => console.log(data))
			if (this.$route.params.id)
				await this.$db
					.collection('areas')
					.conditions({
						_id: this.$route.params.id,
					})
					.get()
					.then((v) => {
						this.form = v[0]
					})

			/* await this.$db
				.collection('departamentos')
				.get()
				.then((v) => {
					this.departamentos = v.map((v) => {
						return {
							label: v.descripcion,
							value: v._id,
						}
					})
				}) */
		},
	}
</script>
