<template>
	<div class="q-pa-md row items-start q-gutter-md q-mt-sm" style="justify-content: center">
		<q-card dark bordered class="bg-grey-9 col-md-7 col-sm-12">
			<q-card-section>
				<div class="text-h6">Pallet Assignment</div>
				<div class="text-subtitle2">Asignacion de Paleta</div>
			</q-card-section>
			<q-separator dark inset />
			<q-card-section class="col row">
				<!-- <div class="col-md-6 col-xs-12">
					<rs-chip label="BOL" v-model="form.bol" />
				</div> -->
				<div class="col-md-6 col-xs-12">
					<q-input
						dark
						color="white"
						outline
						v-model.number="form.pallet"
						type="number"
						label="Number Pallet"
					/>
				</div>
				<div class="col-md-6 col-xs-12">
					<q-file
						v-model="files"
						label="files JSON"
						color="white"
						accept=".json"
						outline
						use-chips
						dark
					/>
				</div>
				<q-btn label="Generate" color="black" class="col col-12 self-end q-mt-md" @click="getInfo()" />
			</q-card-section>
		</q-card>
		<q-card dark bordered class="bg-grey-9 col-md-4 col-sm-12">
			<q-card-section>
				<div class="text-h6">Import - Export Assignment Pallets</div>
				<div class="text-subtitle2">Importar - Exportar asignacion de Paletas</div>
			</q-card-section>
			<q-separator dark inset />
			<q-card-section class="col row">
				<!-- <div class="col-md-6 col-xs-12">
					<q-file
						v-model="files_exp"
						label="files JSON by Export"
						color="white"
						outline
						use-chips
						accept=".json"
						dark
					/>
				</div> -->
				<div class="col-md-12 col-xs-12">
					<q-file
						v-model="files_imp"
						label="files XLSX by Import"
						color="white"
						outline
						use-chips
						accept=".xlsx"
						dark
					/>
				</div>
				<div class="col-md-6 col-xs-12"></div>
				<q-btn-group spread class="col-sm-12">
					<q-btn
						flat
						label="Export"
						color="white"
						class="col col-12 self-end q-mt-md"
						@click="expExcel()"
					/>
					<q-btn
						outline
						label="Import"
						color="white"
						class="col col-12 self-end q-mt-md"
						@click="impExcel()"
					/>
				</q-btn-group>
			</q-card-section>
		</q-card>
		<q-card dark bordered class="bg-grey-9 col-md-11 col-sm-12">
			<q-card-section>
				<div class="text-h6">Product List</div>
				<div class="text-subtitle2">Lista de productos</div>
			</q-card-section>
			<q-separator dark inset />
			<q-card-section class="col row"> </q-card-section>
			<q-separator dark inset />
			<q-card-section>
				<div class="col row">
					<q-card
						class="my-card q-ma-sm col-xs-6 col-md-6"
						dark
						v-for="(p, k) in result.pallets"
						:key="k"
					>
						<q-card-section>
							<div class="text-h6" bold>Pallet: {{ p.pallete }}</div>
							<div class="text-subtitle2">Units: {{ p.units }}</div>
						</q-card-section>
					</q-card>
				</div>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
	import { Loading, QSpinnerGears } from 'quasar'
	import rsChip from 'components/rsChip.vue'
	import { required, email } from 'vuelidate/lib/validators'
	import xlsx from 'json-as-xlsx'
	import excel from 'simple-excel-to-json'
	export default {
		components: {
			rsChip,
		},
		data() {
			return {
				files: null,
				files_imp: null,
				files_exp: null,
				data: '',
				form: {},
				lastPallete: 0,
				tpallets: [],
				totalP: '',
				pallets: {
					a: [],
					b: [],
					c: [],
					d: [],
					e: [],
					f: [],
					h: [],
				},
				totalPalletes: {
					a: [],
					b: [],
					c: [],
					d: [],
					e: [],
					f: [],
					h: [],
				},
				result: '',
				top: 140,
				generate: false,
				todos: {},
			}
		},
		validations: {
			form: {
				//bol: { required },
				pallet: { required },
			},
			files: { required },
			files_imp: { required },
			files_exp: { required },
		},
		methods: {
			async rsSave() {
				this.$q.loading.show()
				console.log(this.data)
				for (let x of this.data) {
					await this.$db
						.doc('inventory')
						.add({
							serial: x.serial,
							alt_serial: x.alt_serial != '' ? x.alt_serial : '',
							bol: x.bol,
							po: x.po,
							prod_num: x.prod_num,
							type: '',
							size: new Number(),
							adapter: '',
							pallete: '',
							group: '',
							status: x.in_fishbowl == 'y' ? 2 : 0,
							generate: 'a',
						})
						.then(async (v) => {
							console.log(x.serial)
						})
				}
				await this.$db
					.funcAdmin('modules/pallets/generatePallets', {
						generate: false,
						top: this.top,
						lastPallete: this.lastPallete - 1,
					})
					.then((val) => {
						console.log(val)
						this.result = val
						/* let aux = document.createElement('input')
						aux.setAttribute('value', this.result.devices)
						document.body.appendChild(aux)
						aux.select()
						document.execCommand('copy')
						document.body.removeChild(aux) */
						/* this.todos['small'] = val.all.small
								this.todos['big'] = val.all.big
								this.tpallets = val.pallets */
					})
				this.$q.loading.hide()
			},
			async getInfo() {
				this.$v.form.$touch()
				if (this.$v.form.$error || this.$v.files.$error) {
					console.log(this.$v.file)
					this.$q.notify({
						type: 'negative',
						message: `Error: Check the fields.`,
					})
					return
				}
				this.lastPallete = this.form.pallet
				const fs = require('fs')
				fs.readFile(this.files.path, 'utf8', (err, jsonString) => {
					if (err) {
						console.log('Error reading file from disk:', err)
						return
					}
					try {
						this.data = JSON.parse(jsonString)
						//this.proInfo()
						this.rsSave()
					} catch (err) {
						console.log('Error parsing JSON string:', err)
					}
				})
			},
			async proInfo() {
				let pn = []
				for (let d of this.data) {
					if (!pn.some((v) => v == d.prod_num)) {
						pn.push(d.prod_num)
					}
				}
				this.unitsInfo(pn)
			},
			async unitsInfo(pn) {
				let total = new Number()
				let arr = []
				for (let d of pn) {
					let uni = this.data.filter((v) => v.prod_num == d).length
					if (this.generate && uni > this.top) {
						for (let x = 1; x <= Math.ceil(uni / this.top); x++) {
							if (x < Math.ceil(uni / this.top)) {
								arr.push({
									prod_num: d,
									units: this.top,
									status: false,
									pallete: '',
								})
							} else {
								arr.push({
									prod_num: d,
									units: uni - this.top,
									status: false,
									pallete: '',
								})
							}
						}
					} else
						arr.push({
							prod_num: d,
							units: uni,
							status: false,
							pallete: '',
						})
					total += uni
				}
				this.result = arr
				await this.a()
				await this.b()
				await this.c()
				await this.d()
				await this.e()
				await this.f()
				//await this.g()
				await this.h()
				console.log(this.totalP, this.totalPalletes, this.todos.length)
				await this.rsSave()
				await this.savePallets()
			},
			async expExcel() {
				let data = [
					{
						sheet: 'Assing Pallets',
						columns: [
							{
								label: 'Prod Num',
								value: 'prod_num',
							},
							{
								label: 'Units',
								value: 'units',
							},
							{
								label: 'Pallete',
								value: 'pallete',
							},
							{
								label: 'new',
								value: 'new',
							},
							{
								label: 'Group',
								value: 'group',
							},
							{
								label: 'Adapter',
								value: 'adapter',
							},
							{
								label: 'Size',
								value: 'size',
							},
							{
								label: 'Bol',
								value: 'bol',
							},
						],
						content: this.result.devices,
					},
					{
						sheet: 'Pallets',
						columns: [
							{
								label: 'Pallete',
								value: 'pallete',
							},
							{
								label: 'Units',
								value: 'units',
							},
						],
						content: this.result.pallets,
					},
				]
				let settings = {
					fileName: `${this.result.bol.toString()}.xlsx`, // Name of the resulting spreadsheet
					extraLength: 3, // A bigger number means that columns will be wider
					writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
					writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
					RTL: false, // Display the columns from right-to-left (the default value is false)
				}
				await xlsx(data, settings)
			},
			async savePallets() {
				this.$db
					.funcAdmin('modulos/pallets/assignPallet', {
						pallets: this.tpallets,
						assign: this.todos,
					})
					.then((v) => {
						console.log(v)
					})
			},
			async impExcel() {
				console.log(this.files_imp)
				let doc = excel.parseXls2Json(this.files_imp.path)

				await this.$db
					.funcAdmin('modules/pallets/importPallets', {
						data: doc,
					})
					.then((val) => {})
				console.log(doc)
			},
		},
		async expExcel() {
			let data = [
				{
					sheet: 'Assing Pallets',
					columns: [
						{
							label: 'Prod Num',
							value: 'prod_num',
						},
						{
							label: 'Units',
							value: 'units',
						},
						{
							label: 'Pallete',
							value: 'pallete',
						},
						{
							label: 'Group',
							value: 'group',
						},
						{
							label: 'Adapter',
							value: 'adapter',
						},
						{
							label: 'Size',
							value: 'size',
						},
					],
					content: this.result.devices,
				},
				{
					sheet: 'Pallets',
					columns: [
						{
							label: 'Pallete',
							value: 'pallete',
						},
						{
							label: 'Units',
							value: 'units',
						},
					],
					content: this.result.pallets,
				},
			]
			let settings = {
				fileName: `${this.result.bol.toString()}.xlsx`, // Name of the resulting spreadsheet
				extraLength: 3, // A bigger number means that columns will be wider
				writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
				writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
				RTL: false, // Display the columns from right-to-left (the default value is false)
			}
			await xlsx(data, settings)
		},
	}
</script>

<style lang="sass" scoped>
	.my-card
	  width: 100%
	  max-width: 250px
</style>
