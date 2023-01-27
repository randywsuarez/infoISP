<template>
	<q-page class="bg-grey-10">
		<div class="row col">
			<div class="col-9">
				<q-card dark bordered class="bg-grey-9" style="width: 95vw">
					<q-card-section>
						<div class="text-h6">Create Label</div>
					</q-card-section>

					<q-card-section class="row col q-pt-none">
						<div class="col-md-6 col-xs-12">
							<q-select dark outlined v-model="form.abcStart" :options="abc" label="First Letter Isle" />
						</div>
						<div class="col-md-6 col-xs-12">
							<q-select dark outlined v-model="form.abcEnd" :options="abc" label="Last Letter Isle" />
						</div>
						<div class="col-md-6 col-xs-12">
							<q-input dark outlined v-model.number="form.bay" type="number" filled label="Bay" />
						</div>
						<div class="col-md-6 col-xs-12">
							<q-input dark outlined v-model.number="form.level" type="number" filled label="Level" />
						</div>
						<div class="col-md-6 col-xs-12">
							<q-btn-toggle
								v-model="form.select"
								spread
								class="my-custom-toggle"
								no-caps
								rounded
								unelevated
								toggle-color="primary"
								color="white"
								text-color="primary"
								:options="[
									{ label: 'All', value: 'all' },
									{ label: 'Odd', value: 'odd' },
									{ label: 'Pair', value: 'pair' },
								]"
							/>
						</div>
						<pre>{{ result }}</pre>

						<q-btn
							dark
							label="Generate"
							color="primary"
							class="col col-12 self-end q-mt-md fixed-bottom rounded-borders q-pa-md q-ma-sm"
							@click="generate"
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
	import JsBarcode from 'jsbarcode'
	import Canvas from 'canvas'
	import pdfMake from 'pdfmake'
	import pdfFonts from 'pdfmake/build/vfs_fonts'
	import { shallowRef } from 'vue'
	export default {
		data() {
			return {
				canvas: '',
				data: [],
				form: {},
				dd: [],
				abc: [
					'A',
					'B',
					'C',
					'D',
					'E',
					'F',
					'G',
					'H',
					'I',
					'J',
					'K',
					'L',
					'M',
					'N',
					'O',
					'P',
					'Q',
					'R',
					'S',
					'U',
					'V',
					'W',
					'X',
					'Y',
					'Z',
				],
				result: [],
			}
		},
		validations: {
			form: {
				descripcion: { required },
			},
		},
		computed: {},
		methods: {
			async getBase64ImageFromURL(url) {
				return new Promise((resolve, reject) => {
					var img = new Image()
					img.setAttribute('crossOrigin', 'anonymous')

					img.onload = () => {
						var canvas = document.createElement('canvas')
						canvas.width = img.width
						canvas.height = img.height

						var ctx = canvas.getContext('2d')
						ctx.drawImage(img, 0, 0)

						var dataURL = canvas.toDataURL('image/png')

						resolve(dataURL)
					}

					img.onerror = (error) => {
						reject(error)
					}

					img.src = url
				})
			},
			async resetOrientation(srcBase64, srcOrientation, callback) {
				new Promise((resolve) => {
					var img = new Image()

					img.onload = function () {
						let width = img.width,
							height = img.height
						this.canvas = document.createElement('canvas')
						let ctx = this.canvas.getContext('2d')

						// set proper canvas dimensions before transform & export
						if (4 < srcOrientation && srcOrientation < 9) {
							this.canvas.width = height
							this.canvas.height = width
						} else {
							this.canvas.width = width
							this.canvas.height = height
						}

						// transform context before drawing image
						switch (srcOrientation) {
							case 2:
								ctx.transform(-1, 0, 0, 1, width, 0)
								break
							case 3:
								ctx.transform(-1, 0, 0, -1, width, height)
								break
							case 4:
								ctx.transform(1, 0, 0, -1, 0, height)
								break
							case 5:
								ctx.transform(0, 1, 1, 0, 0, 0)
								break
							case 6:
								ctx.transform(0, 1, -1, 0, height, 0)
								break
							case 7:
								ctx.transform(0, -1, -1, 0, height, width)
								break
							case 8:
								ctx.transform(0, -1, 1, 0, 0, width)
								break
							default:
								break
						}

						// draw image
						ctx.drawImage(img, 0, 0)

						// export base64
						console.log('URL: ', this.canvas.toDataURL())
						callback(this.canvas.toDataURL())
					}

					img.src = srcBase64
				})
			},
			async rotateImg(text) {
				return new Promise((resolve, reject) => {
					let ctx,
						canvas = document.createElement('canvas')
					canvas.width = 400
					canvas.height = 587
					ctx = canvas.getContext('2d')
					var drawImage = () => {
						ctx.drawImage(base_image, 0, 0)
						return ''
					}

					let base_image = new Image()
					base_image.onload = drawImage()
					base_image.src = text
					ctx.translate(80, 500)
					ctx.rotate(-0.5 * Math.PI)
					ctx.fillText(drawImage(), 0, 0)
					this.canvas = canvas.toDataURL()
					resolve(canvas.toDataURL())
				})
			},
			async info() {
				return new Promise((resolve) => {
					let isle = this.abc.slice(
						this.abc.indexOf(this.form.abcStart),
						this.abc.indexOf(this.form.abcEnd) + 1
					)
					for (var x = 0; x < isle.length; x++) {
						for (var i = 0; i < this.form.level; i++) {
							for (var z = 0; z < this.form.bay; z++) {
								if (isle.length < x || this.form.bay < z || this.form.level < 1)
									page = { pageBreak: 'after' }
								if (this.form.select == 'odd') {
									if (z % 2 === 0) {
										this.result.push({
											code: `${isle[x]}.${z + 1}.${i + 1}`,
											name: `Isle: ${isle[x]} | Bay: ${z + 1} | Level: ${i + 1}`,
											image: '',
										})
									}
								}
								if (this.form.select == 'pair') {
									if (z % 2 !== 0) {
										this.result.push({
											code: `${isle[x]}.${z + 1}.${i + 1}`,
											name: `Isle: ${isle[x]} | Bay: ${z + 1} | Level: ${i + 1}`,
											image: '',
										})
									}
								}
								if (this.form.select == 'all') {
									this.result.push({
										code: `${isle[x]}.${z + 1}.${i + 1}`,
										name: `Isle: ${isle[x]} | Bay: ${z + 1} | Level: ${i + 1}`,
										image: '',
									})
								}
							}
						}
					}
					resolve(this.result)
				})
			},
			async generateImage(id) {
				return new Promise(async (resolve) => {
					let svg = document.createElement('img')
					svg.setAttribute('id', id)
					await JsBarcode(svg, id, {
						format: 'CODE128',
						lineColor: '#000',
						width: 5,
						height: 200,
						displayValue: false,
					})
					await this.rotateImg(svg.src).then((r) => {
						resolve(r)
					})
				})
			},
			async generate() {
				let objs = await this.info()
				console.log(objs.length)
				for (let o = 0; 0 < objs.length; o++) {
					console.log(objs[o].code)
					this.generateImage(objs[o].code).then((v) => {
						objs[o].image = v
					})
				}
			},

			async srSave() {
				Loading.show()
				console.clear()
				let isle = this.abc.slice(
					this.abc.indexOf(this.form.abcStart),
					this.abc.indexOf(this.form.abcEnd) + 1
				)
				let result = {
					code: '',
					name: '',
					image: '',
				}
				let pdf = []
				let page = {}
				for (var x = 0; x < isle.length; x++) {
					for (var i = 1; i <= this.form.level; i++) {
						for (var z = 1; z <= this.form.bay; z++) {
							let svg = document.createElement('img')
							svg.setAttribute('id', `${isle[x]}.${z + 1}.${i}`)
							await JsBarcode(svg, `${isle[x]}.${z + 1}.${i}`, {
								format: 'CODE128',
								lineColor: '#000',
								width: 5,
								height: 200,
								displayValue: false,
							})
							if (this.form.select == 'odd') {
								if (z % 2 === 0) {
									this.rotateImg(svg.src).then((r) => {
										this.result.push({
											code: `${isle[x]}.${z}.${i}`,
											name: `Isle: ${isle[x]} | Bay: ${z} | Level: ${i}`,
											image: this.canvas,
										})
									})
								}
							}
							if (this.form.select == 'pair') {
								if (z % 2 !== 0) {
									this.rotateImg(svg.src).then((r) => {
										this.result.push({
											code: `${isle[x]}.${z}.${i}`,
											name: `Isle: ${isle[x]} | Bay: ${z} | Level: ${i}`,
											image: this.canvas,
										})
									})
								}
							}
							if (this.form.select == 'all') {
								result.code = `${isle[x]}.${z}.${i}`
								result.name = `Isle: ${isle[x]} | Bay: ${z} | Level: ${i}`
								await this.rotateImg(svg.src).then((r) => {
									result.image = this.canvas
									this.result.push(result)
									console.log(`Isle: ${isle[x]} | Bay: ${z} | Level: ${i}`)
								})
							}
						}
					}
				}
				console.log(this.result)
				console.log(isle)
				// playground requires you to assign document definition to a variable called dd
				for (let res of this.result) {
					pdf.push([
						{
							stack: [
								{
									image: res.image,
									width: 400,
									absolutePosition: {
										x: 10,
										y: 150,
									},
								},
								{
									svg: `
	         <svg>
	           <text
	             transform="translate(80, 510) rotate(-90)"
	             font-weight="bold"
	             style="font-size: 80px;"
	           >
	            ${res.code}
	           </text>
	         </svg>`,
									absolutePosition: { x: 320, y: 20 },
								},
								{
									svg: `
	         <svg>
	           <text
	             transform="translate(50, 550) rotate(-90)"
	             font-weight="bold"
	             style="font-size: 50px;"
	           >
	             ${res.name}
	           </text>
	         </svg>`,
									absolutePosition: { x: 460, y: 190 },
									pageBreak: 'after',
								},
							],
						},
					])
				}

				console.log(pdf)
				let dd = {
					pageSize: {
						width: 600,
						height: 900,
					},
					/* pageSize: {
	   width: 1200,
	   height: 1800
	 },*/
					content: [pdf],
				}
				pdfMake.vfs = pdfFonts.pdfMake.vfs
				pdfMake.createPdf(dd).download('Label.PDF')
				this.dd = dd
				Loading.hide()
			},
		},
		async mounted() {},
	}
</script>
