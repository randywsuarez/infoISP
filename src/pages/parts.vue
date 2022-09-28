<template>
	<page>
		<div slot="principal">
			<q-card flat bordered style="max-height: 80vh" class="shadow-2">
				<q-card-section>
					<div class="text-h6">Scan ready to ship laptop (Printer A)</div>
				</q-card-section>

				<q-card-section class="row col q-pt-none">
					<div class="col-md-6 col-xs-12">
						<q-select
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
							outlined
							v-model="form.pallet"
							:options="pallet"
							map-options
							emit-value
							label="Select Pallet"
						/>
					</div>
					<div class="col-12">
						<q-input outlined v-model="form.serial" label="Serial Number" />
					</div>
					<div class="col-md-6 col-xs-12">
						<q-checkbox
							left-label
							v-model="form.duplicate"
							label="Duplicate Label"
							checked-icon="task_alt"
							unchecked-icon="highlight_off"
						/>
					</div>
					<q-btn
						outline
						label="Save"
						color="primary"
						class="col col-12 self-end"
						@click="srSave"
						:disable="$v.form.$invalid"
					/>
				</q-card-section>

				<!-- <q-separator inset />

				<q-card-section>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
					labore et dolore magna aliqua.
				</q-card-section> -->
			</q-card>
			<div>></div>
		</div>
	</page>
</template>
<script>
	import Page from 'components/templateOne'
	import { required, email } from 'vuelidate/lib/validators'
	import { Loading, QSpinnerGears } from 'quasar'
	export default {
		components: {
			Page,
		},
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
				this.$v.form.$touch()
				if (this.$v.form.$error) {
					return
				}
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
