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
				<pre>{{ result }}</pre>
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
				asignacion: [],
			}
		},
		methods: {
			async getInfo() {
				this.lastPallete = this.form.pallet - 1
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
				for (let x = 0; x < Math.ceil(total / this.top); x++) {
					this.pallets.push(this.form.pallet + x)
				}
				console.log(total, Math.ceil(total / this.top), this.pallets)
				await this.asignPallet(arr, Math.ceil(total / this.top))
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
			async h() {
				for (let x in this.data) {
					if (this.data[x].units >= 100 && this.data[x].units <= 140) {
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
					}
	         if()
					if (this.data[x].units > 140 && this.data[x].units <= 280) {
						this.data[x].units = Math.ceil(this.data[x].units / 2)
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
					}
					if (this.data[x].units > 280 && this.data[x].units <= 420) {
						this.data[x].units = Math.ceil(this.data[x].units / 3)
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
					}
					if (this.data[x].units > 420 && this.data[x].units <= 560) {
						this.data[x].units = Math.ceil(this.data[x].units / 4)
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
					}
					if (this.data[x].units > 560 && this.data[x].units <= 700) {
						this.data[x].units = Math.ceil(this.data[x].units / 5)
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
						this.data[x].units = this.data[x].units + 1
						this.data[x].pallete = this.lastPallete++
						this.pallets.h.push(this.data[x])
					}
						this.data[x].status = true
				}
			},
		},
	}
</script>

<style lang="sass" scoped>
	.my-card
	  width: 100%
	  max-width: 250px
</style>
