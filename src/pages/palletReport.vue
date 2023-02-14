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
				console.log(this.data.length)
				for (let x of this.data) {
					await this.$db
						.doc('inventory')
						.add({
							serial: x.serial,
							alt_serial: x.alt_serial != '' ? x.alt_serial : '',
							bol: x.bol,
							po: x.po,
							prod_num: x.prod_num,
							//prod_num: '',
							type: x.prod_name.includes('Crhomebook') ? 'Crhomebook' : 'Laptop',
							size: x.prod_name.includes('11')
								? 11
								: x.prod_name.includes('13')
								? 13
								: x.prod_name.includes('14')
								? 14
								: x.prod_name.includes('15')
								? 15
								: x.prod_name.includes('16')
								? 16
								: 17,
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
						let aux = document.createElement('input')
						aux.setAttribute('value', this.result.devices)
						document.body.appendChild(aux)
						aux.select()
						document.execCommand('copy')
						document.body.removeChild(aux)
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
			async asignPallet(total, block) {
				if (total < this.top) {
					for (let x = 0; x < this.pallets[block].length; x++) {
						this.pallets[block][x].pallete = this.lastPallete
						this.pallets[block][x].status = true
						this.pallets[block][x].group = block
						this.pallets[block][x].bol = this.form.bol.toString()
						this.todos.push(this.pallets[block][x])
						this.totalPalletes[block].push({ pallete: np1, units: tpallet1 })
						this.tpallets.push({ pallete: np1, units: tpallet1 })
					}
				}
				let tpallet1 = 0
				let tpallet2 = 0
				let tpallet3 = 0
				let tpallet4 = 0
				let tpallet5 = 0
				let np1 = this.lastPallete + 1
				let np2 = this.lastPallete + 2
				let np3 = this.lastPallete + 3
				let np4 = this.lastPallete + 4
				let np5 = this.lastPallete + 5

				if (total > this.top && total <= this.top * 2) {
					for (let x = 0; x < this.pallets[block].length; x++) {
						if (tpallet1 + this.pallets[block][x].units <= Math.floor(total / 2)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets[block][x].pallete = np1
							this.pallets[block][x].status = true
							tpallet1 += this.pallets[block][x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets[block][x].pallete = np2
							this.pallets[block][x].status = true
							tpallet2 += this.pallets[block][x].units
						}
						this.todos.push(this.pallets[block][x])
					}
					this.lastPallete += 2
					this.totalPalletes[block].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 }
					)
					this.tpallets.push({ pallete: np1, units: tpallet1 }, { pallete: np2, units: tpallet2 })
				}
				if (total > this.top * 2 && total <= this.top * 3) {
					for (let x = 0; x < this.pallets[block].length; x++) {
						if (tpallet1 + this.pallets[block][x].units <= Math.floor(total / 3)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets[block][x].pallete = np1
							this.pallets[block][x].status = true
							tpallet1 += this.pallets[block][x].units
						}
						if (tpallet2 + this.pallets[block][x].units <= Math.floor(total / 3)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets[block][x].pallete = np2
							this.pallets[block][x].status = true
							tpallet2 += this.pallets[block][x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets[block][x].pallete = np3
							this.pallets[block][x].status = true
							tpallet3 += this.pallets[block][x].units
						}
						this.todos.push(this.pallets[block][x])
					}
					this.lastPallete += 3
					this.pallets[block][x].group = block
					this.pallets[block][x].bol = this.form.bol.toString()
					this.totalPalletes[block].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 }
					)
					this.tpallets.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 }
					)
				}
				if (total > this.top * 3 && total <= this.top * 4) {
					for (let x = 0; x < this.pallets[block].length; x++) {
						if (tpallet1 + this.pallets[block][x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].pallete = np1
							this.pallets[block][x].status = true
							tpallet1 += this.pallets[block][x].units
						}
						if (tpallet2 + this.pallets[block][x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].pallete = np2
							this.pallets[block][x].status = true
							tpallet2 += this.pallets[block][x].units
						}
						if (tpallet3 + this.pallets[block][x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].pallete = np3
							this.pallets[block][x].status = true
							tpallet3 += this.pallets[block][x].units
						} else {
							this.pallets[block][x].pallete = np4
							this.pallets[block][x].status = true
							tpallet4 += this.pallets[block][x].units
						}
						this.todos.push(this.pallets[block][x])
					}
					this.lastPallete += 4
					this.pallets[block][x].group = block
					this.pallets[block][x].bol = this.form.bol.toString()
					this.totalPalletes[block].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 }
					)
					this.tpallets.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 }
					)
				}
				if (total > this.top * 4 && total <= this.top * 5) {
					for (let x = 0; x < this.pallets[block].length; x++) {
						if (tpallet1 + this.pallets[block][x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].pallete = np1
							this.pallets[block][x].status = true
							tpallet1 += this.pallets[block][x].units
						}
						if (tpallet2 + this.pallets[block][x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].pallete = np2
							this.pallets[block][x].status = true
							tpallet2 += this.pallets[block][x].units
						}
						if (tpallet3 + this.pallets[block][x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].pallete = np3
							this.pallets[block][x].status = true
							tpallet3 += this.pallets[block][x].units
						}
						if (tpallet4 + this.pallets[block][x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].pallete = np4
							this.pallets[block][x].status = true
							tpallet4 += this.pallets[block][x].units
						} else {
							this.pallets[block][x].pallete = np5
							this.pallets[block][x].status = true
							tpallet5 += this.pallets[block][x].units
						}
						this.todos.push(this.pallets[block][x])
					}
					this.lastPallete += 5
					this.pallets[block][x].group = block
					this.pallets[block][x].bol = this.form.bol.toString()
					this.totalPalletes[block].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 },
						{ pallete: np5, units: tpallet5 }
					)
					this.tpallets.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 },
						{ pallete: np5, units: tpallet5 }
					)
					this.todos.push(this.pallets[block][x])
				}
				this.totalP = this.totalP = Number(this.totalP) + Number(this.totalPalletes[block].length)
			},
			async a() {
				let block = 'a'
				let total = 0
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 1 && model.units <= 5) {
						this.pallets.a.push(model)
						total += model.units
					}
				}
				console.log('a: ', total)
				if (total < this.top) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						this.pallets.a[x].pallete = this.lastPallete
						this.pallets.a[x].status = true
						this.pallets[block][x].group = block
						this.pallets[block][x].bol = this.form.bol.toString()
						this.totalPalletes['a'].push({ pallete: np1, units: tpallet1 })
						this.tpallets.push({ pallete: np1, units: tpallet1 })
					}
				}

				let tpallet1 = 0
				let tpallet2 = 0
				let tpallet3 = 0
				let tpallet4 = 0
				let tpallet5 = 0
				let np1 = this.lastPallete
				let np2 = this.lastPallete + 1
				let np3 = this.lastPallete + 2
				let np4 = this.lastPallete + 3
				let np5 = this.lastPallete + 4

				if (total > this.top && total <= this.top * 2) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 2)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
						this.todos.push(this.pallets.a[x])
					}
					this.lastPallete += 2
					this.totalPalletes['a'].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 }
					)
					this.tpallets.push({ pallete: np1, units: tpallet1 }, { pallete: np2, units: tpallet2 })
				}
				if (total > this.top * 2 && total <= this.top * 3) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 3)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 3)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 3
					this.totalPalletes['a'].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 }
					)
					this.tpallets.push({ pallete: np1, units: tpallet1 }, { pallete: np2, units: tpallet2 })
				}
				if (total > this.top * 3 && total <= this.top * 4) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
						if (tpallet3 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np4
							this.pallets.a[x].status = true
							tpallet4 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 4
					this.totalPalletes['a'].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 }
					)
					this.tpallets.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 }
					)
				}
				if (total > this.top * 4 && total <= this.top * 5) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
						if (tpallet3 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						}
						if (tpallet4 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np4
							this.pallets.a[x].status = true
							tpallet4 += this.pallets.a[x].units
						} else {
							this.pallets[block][x].group = block
							this.pallets[block][x].bol = this.form.bol.toString()
							this.pallets.a[x].pallete = np5
							this.pallets.a[x].status = true
							tpallet5 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 5
					this.totalPalletes['a'].push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 },
						{ pallete: np5, units: tpallet5 }
					)
					this.tpallets.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 },
						{ pallete: np5, units: tpallet5 }
					)
				}
				this.lastPallete--
				this.totalP = this.totalP = Number(this.totalP) + Number(this.totalPalletes[block].length)
			},
			async b() {
				let total = 0
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 6 && model.units <= 10) {
						this.pallets.b.push(model)
						total += model.units
					}
				}
				await this.asignPallet(total, 'b')
			},
			async c() {
				let block = 'c'
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 11 && model.units <= 20) {
						this.pallets[block].push(model)
					}
				}
				this.pallets[block].sort((a, b) => b.units - a.units)
				let pal = this.lastPallete + 1
				for (let x = 1; x <= this.pallets[block].length; x++) {
					let total = 0
					for (let f in this.pallets[block]) {
						//if (!this.pallets[block][f].status) console.log(this.pallets[block][f].units + total)
						if (!this.pallets[block][f].status && this.pallets[block][f].units + total <= this.top) {
							this.pallets[block][f].pallete = pal
							this.pallets[block][f].status = true
							this.pallets[block][f].group = block
							this.pallets[block][f].bol = this.form.bol.toString()
							total += this.pallets[block][f].units
						}
					}
					if (!total == 0) {
						this.totalPalletes[block].push({ pallete: pal, units: total })
						this.tpallets.push({ pallete: pal, units: total })
						pal++
					} else {
						continue
					}
				}
				for (let a of this.pallets[block]) {
					this.todos.push(a)
				}
				this.totalP = this.totalP = Number(this.totalP) + Number(this.totalPalletes[block].length)
				this.lastPallete = pal - 1
				console.log('c: ', this.lastPallete)
			},
			async d() {
				let total = 0
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 21 && model.units <= 35) {
						this.pallets.d.push(model)
						total += model.units
					}
				}
				await this.asignPallet(total, 'd')
			},
			async e() {
				let total = 0
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 36 && model.units <= 45) {
						this.pallets.e.push(model)
						total += model.units
					}
				}
				await this.asignPallet(total, 'e')
			},
			async f() {
				let block = 'f'
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 46 && model.units <= 99) {
						this.pallets[block].push(model)
					}
				}
				this.pallets[block].sort((a, b) => b.units - a.units)
				let pal = this.lastPallete + 1
				for (let x = 1; x <= this.pallets[block].length; x++) {
					let total = 0
					for (let f in this.pallets[block]) {
						//if (!this.pallets[block][f].status) console.log(this.pallets[block][f].units + total)
						if (!this.pallets[block][f].status && this.pallets[block][f].units + total <= this.top) {
							this.pallets[block][f].pallete = pal
							this.pallets[block][f].status = true
							this.pallets[block][f].group = block
							total += this.pallets[block][f].units
						}
					}
					if (!total == 0) {
						this.totalPalletes[block].push({ pallete: pal, units: total })
						this.tpallets.push({ pallete: pal, units: total })
						pal++
					} else {
						continue
					}
				}
				for (let a of this.pallets[block]) {
					this.todos.push(a)
				}
				this.totalP = this.totalP = Number(this.totalP) + Number(this.totalPalletes[block].length)
				console.log(Number(this.totalP) + Number(this.totalPalletes[block].length))
				this.lastPallete = pal
			},
			async g() {
				let total = 0
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 71 && model.units <= 99) {
						this.pallets.g.push(model)
						total += model.units
					}
				}
				console.log(total)
				await this.asignPallet(total, 'g')
			},
			async h() {
				let block = 'h'
				for (let x in this.result) {
					let model = JSON.parse(JSON.stringify(this.result[x]))
					let model2 = JSON.parse(JSON.stringify(this.result[x]))
					let model3 = JSON.parse(JSON.stringify(this.result[x]))
					let model4 = JSON.parse(JSON.stringify(this.result[x]))
					let model5 = JSON.parse(JSON.stringify(this.result[x]))
					if (model.units >= 100 && model.units <= this.top) {
						this.pallets.h.push(model)
						this.result[x].status = true
					}
					if (model.units > this.top && model.units <= this.top * 2) {
						model.units = Math.floor(model.units / 2)
						this.pallets.h.push(model)
						model2.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model2)
						this.result[x].status = true
					}
					if (model.units > this.top * 2 && model.units <= this.top * 3) {
						model.units = Math.floor(model.units / 3)
						this.pallets.h.push(model)
						model2.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model2)
						model1.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model3)
						this.result[x].status = true
					}
					if (model.units > this.top * 3 && model.units <= this.top * 4) {
						model.units = Math.floor(model.units / 4)
						this.pallets.h.push(model)
						model2.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model2)
						model3.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model3)
						model4.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model4)
						this.result[x].status = true
					}
					if (model.units > this.top * 4 && this.data[x].units <= ths.top * 5) {
						model.units = Math.floor(this.data[x].units / 5)
						this.pallets.h.push(model)
						model2.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model2)
						model3.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model3)
						model4.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model4)
						model5.units = this.result[x].units % 2 == 0 ? model.units : model.units + 1
						this.pallets.h.push(model5)
						this.result[x].status = true
					}
				}
				for (let x = 0; x < this.pallets.h.length; x++) {
					this.pallets.h[x].pallete = this.lastPallete + x
					this.pallets.h[x].status = true
					this.pallets[block][x].group = block
					this.pallets[block][x].bol = this.form.bol.toString()
					this.totalPalletes['h'].push({
						pallete: this.pallets.h[x].pallete,
						units: this.pallets.h[x].units,
					})
					this.tpallets.push({
						pallete: this.pallets.h[x].pallete,
						units: this.pallets.h[x].units,
					})
					this.todos.push(this.pallets[block][x])
				}
				this.lastPallete = this.lastPallete + this.pallets.h.length
				this.totalP = this.totalP = Number(this.totalP) + Number(this.totalPalletes[block].length)
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
