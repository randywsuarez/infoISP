<template>
	<q-page class="bg-grey-10">
		<div class="row col">
			<div class="col-9">
				<q-card bordered class="bg-white-9" style="width: 95vw">
					<q-card-section>
						<div class="text-h6">Device's Information (by RandyS)</div>
					</q-card-section>

					<q-card-section class="row col q-pt-none">
						<div class="col-12 row">
							<q-input
								type="text"
								name="sku"
								id="sku"
								label="Model"
								class="col-lg-5 col-sm-12"
								v-model="form.sku"
							/>
							<q-input
								type="text"
								name="serial"
								id="serial"
								label="Serial"
								class="col-lg-5 col-sm-12"
								v-model="form.serial"
							/>
							<q-btn
								color="primary"
								icon="search"
								label="Search"
								@click="fetchData"
								class="col-lg-2 col-sm-12"
							/>
						</div>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>
<script>
	export default {
		data() {
			return {
				product: null,
				form: {
					sku: '',
					Serial: '',
				},
			}
		},
		// ... otros métodos ...

		mounted() {
			this.fetchData()
			this.setDarkMode() // Agrega esta línea para configurar el modo oscuro
		},

		methods: {
			async fetchData() {
				if (this.inputValue.trim() === '') {
					console.warn('Input vacío')
					return
				}

				const requestData = {
					lists: [this.inputValue],
				}

				try {
					const response = await fetch('http://localhost:4300/api/funcAdmin?path=modules/search/data', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(requestData),
					})

					const data = await response.json()
					this.product = data.result.data[0]
				} catch (error) {
					console.error('Error fetching data:', error)
				}
				// ... código existente para fetch ...

				// Después de obtener los datos, puedes activar la visualización de la tarjeta
				this.isFlipped = true
			},
			toggleFlip() {
				this.isFlipped = !this.isFlipped
			},

			setDarkMode() {
				// Aquí puedes agregar el código para habilitar el modo oscuro
				// Dependiendo de cómo lo manejes en tu aplicación
				// Por ejemplo, podrías cambiar las clases CSS para aplicar estilos oscuros.
				// Esto puede variar según cómo estés manejando el modo oscuro en tu aplicación.
			},
		},
		mounted() {
			this.product = {
				display: "LCD HU 15.6'INCH'INCH OLED UHD BV+AR TS NIGHTFALL BLACK",
				size: '15.6',
				general_adapter: '135W ADAPTER PFC SMART SLIM',
				adapter: '135 W Smart AC power adapter',
				accessory: ["HP 15.6'INCH'INCH Black Sleeve"],
				touch: false,
				type: 'Laptops',
				tip: 'Barrel',
				oid: 34900218,
				Description: 'HP Spectre x360 Laptop - 15-eb0020ca',
				pl: 'M8',
				sizeRam: '16',
				uomRam: 'GB',
				SizeHDD: '1',
				uomHDD: 'TB',
				typeHDD: 'SSD',
				cpu: 'Intel® Core™ i7-10750H (2.6 GHz base frequency, up to 5 GHz with Intel® Turbo Boost Technology, 12 MB L3 cache, 6 cores)',
				color: 'Nightfall black aluminum',
				upc: '194850755637',
				OS: 'Windows 11 Home',
				sku: '1Y541UA#ABA',
				Model: '1Y541UA',
				img: 'http://product-images.www8-hp.com/digmedialib/prodimg/lowres/c07980789.png',
			}
		},
		// ... el resto del componente ...
	}
</script>
<style scoped></style>
