<template>
	<div class="q-pa-md row items-start q-gutter-md">
		<q-card dark bordered class="bg-grey-9" style="width: 95vw">
			<q-card-section>
				<div class="text-h6">Pallet Assignment</div>
				<div class="text-subtitle2">by John Doe</div>
			</q-card-section>

			<q-separator dark inset />

			<q-card-section class="col row">
				<div class="col-md-6 col-xs-12">
					<q-input
						dark
						outlined
						v-model.number="form.npallet"
						type="number"
						filled
						label="Amount Pallet"
					/>
				</div>
				<div class="col-md-6 col-xs-12">
					<q-input
						dark
						outlined
						v-model.number="form.pallet"
						type="number"
						filled
						label="Init Pallete"
					/>
				</div>
				<div class="col-md-6 col-xs-12">
					<q-file v-model="files" label="files JSON" outlined use-chips dark />
				</div>
				<q-btn label="Generate" color="black" class="col col-12 self-end q-mt-md" @click="getInfo()" />
			</q-card-section>

			<q-separator dark inset />
			<q-card-section>
				<div class="col row">
					<pre class="col-md-6">{{ pallets }}</pre>
					<pre class="col-md-6">{{ result }}</pre>
				</div>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				files: null,
				data: '',
				form: [],
				lastPallete: '',
				pallets: {
					a: [],
					b: [],
					c: [],
					d: [],
					e: [],
					f: [],
					g: [],
					h: [],
					i: [],
				},
				result: '',
				top: 140,
				generate: false,
				totalPalletes: [],
			}
		},
		methods: {
			async getInfo() {
				this.lastPallete = this.form.pallet
				const fs = require('fs')
				fs.readFile(this.files.path, 'utf8', (err, jsonString) => {
					if (err) {
						console.log('Error reading file from disk:', err)
						return
					}
					try {
						this.data = JSON.parse(jsonString)
						this.proInfo()
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
						console.log(d, uni, Math.ceil(uni / this.top))
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
				//Generacion de paletas
				/* for (let x = 0; x < Math.ceil(total / this.top); x++) {
					this.pallets.push(this.form.pallet + x)
				}
				console.log(total, Math.ceil(total / this.top), this.pallets)
				//await this.asignPallet(arr, Math.ceil(total / this.top)) */
				await this.a()
				await this.b()
				await this.c()
				await this.d()
				await this.e()
				await this.g()
				await this.h()
				console.log(this.pallets.h)
			},
			async asignPallet(arr, ptotal) {
				let pal = this.form.pallet
				let asig = {}
				let cant = 0
				for (let x = 0; x < arr.length; x++) {
					if (arr[x].units <= 10) {
						let pack = []
						if (cant <= this.top) {
							pack.push(arr[x])
							asig[pal] = []
							this.asignacion.push()
						} else {
							pack = []
							this.asignacion.push({
								Pallete: pal + 1,
								units: cant + arr[x].units,
							})
							pack.push(arr[x])
						}
					}
				}
				console.log(this.asignacion)
			},
			async a() {
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
						this.totalPalletes.push({ pallete: np1, units: tpallet1 })
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
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						} else {
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 2
					this.totalPalletes.push({ pallete: np1, units: tpallet1 }, { pallete: np2, units: tpallet2 })
				}
				if (total > this.top * 2 && total <= this.top * 3) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 2)) {
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 3)) {
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						} else {
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 3
					this.totalPalletes.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 }
					)
				}
				if (total > this.top * 3 && total <= this.top * 4) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
						if (tpallet3 + this.pallets.a[x].units <= Math.floor(total / 4)) {
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						} else {
							this.pallets.a[x].pallete = np4
							this.pallets.a[x].status = true
							tpallet4 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 4
					this.totalPalletes.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 }
					)
				}
				if (total > this.top * 4 && total <= this.top * 5) {
					for (let x = 0; x < this.pallets.a.length; x++) {
						if (tpallet1 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets.a[x].pallete = np1
							this.pallets.a[x].status = true
							tpallet1 += this.pallets.a[x].units
						}
						if (tpallet2 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets.a[x].pallete = np2
							this.pallets.a[x].status = true
							tpallet2 += this.pallets.a[x].units
						}
						if (tpallet3 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets.a[x].pallete = np3
							this.pallets.a[x].status = true
							tpallet3 += this.pallets.a[x].units
						}
						if (tpallet4 + this.pallets.a[x].units <= Math.floor(total / 5)) {
							this.pallets.a[x].pallete = np4
							this.pallets.a[x].status = true
							tpallet4 += this.pallets.a[x].units
						} else {
							this.pallets.a[x].pallete = np5
							this.pallets.a[x].status = true
							tpallet5 += this.pallets.a[x].units
						}
					}
					this.lastPallete += 5
					this.totalPalletes.push(
						{ pallete: np1, units: tpallet1 },
						{ pallete: np2, units: tpallet2 },
						{ pallete: np3, units: tpallet3 },
						{ pallete: np4, units: tpallet4 },
						{ pallete: np5, units: tpallet5 }
					)
				}
				console.log(this.totalPalletes)
			},
			async b() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 6 && model.units <= 10) {
						this.pallets.b.push(model)
					}
				}
			},
			async c() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 11 && model.units <= 20) {
						this.pallets.c.push(model)
					}
				}
			},
			async d() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 21 && model.units <= 35) {
						this.pallets.d.push(model)
					}
				}
			},
			async e() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 36 && model.units <= 45) {
						this.pallets.e.push(model)
					}
				}
			},
			async f() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 46 && model.units <= 70) {
						this.pallets.f.push(model)
					}
				}
			},
			async g() {
				for (let x in this.result) {
					let model = this.result[x]
					if (model.units >= 71 && model.units <= 99) {
						this.pallets.g.push(model)
					}
				}
			},
			async h() {
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
				}
				this.lastPallete = this.lastPallete + this.pallets.h.length
				console.log(this.lastPallete)
			},
		},
	}
</script>

<style lang="sass" scoped>
	.my-card
	  width: 100%
	  max-width: 250px
</style>
