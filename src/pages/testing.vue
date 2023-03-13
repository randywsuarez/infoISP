<template>
	<q-page class="row justify-center">
		<q-card class="col-12 col-sm-8 col-md-6">
			<q-card-section>
				<h2 class="text-h6">Información del sistema:</h2>
				<p v-for="(value, key) in systemInfo" :key="key">{{ key }}: {{ value }}</p>
			</q-card-section>

			<q-card-section>
				<h2 class="text-h6">Pruebas de hardware:</h2>
				<div class="row justify-center">
					<q-btn label="Probar teclado" @click="testKeyboard" />
					<q-btn label="Probar sonido" @click="testSound" />
					<q-btn label="Probar cámara web" @click="testWebcam" />
					<q-btn label="Probar touchpad" @click="testTouchpad" />
					<q-btn label="Probar batería" @click="testBattery" />
				</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script>
	import si from '@/utils/systemInfo'

	export default {
		name: 'HardwareTest',
		data() {
			return {
				systemInfo: {},
			}
		},
		mounted() {
			this.systemInfo = si.getSystemInfo()
		},
		methods: {
			testKeyboard() {
				console.log('Prueba de teclado iniciada. Presione cualquier tecla para continuar.')
				document.addEventListener(
					'keydown',
					() => {
						console.log('Teclado funciona correctamente.')
					},
					{ once: true }
				)
			},
			testSound() {
				const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
				audio
					.play()
					.then(() => {
						console.log('Sonido funciona correctamente.')
					})
					.catch((error) => {
						console.error('Error al reproducir sonido:', error)
					})
			},
			testWebcam() {
				navigator.mediaDevices
					.getUserMedia({ video: true, audio: false })
					.then((stream) => {
						console.log('Cámara web funciona correctamente.')
						stream.getTracks().forEach((track) => track.stop())
					})
					.catch((error) => {
						console.error('Error al acceder a la cámara web:', error)
					})
			},
			testTouchpad() {
				console.log('Prueba de touchpad iniciada. Mueva el cursor para continuar.')
				document.addEventListener(
					'mousemove',
					() => {
						console.log('Touchpad funciona correctamente.')
					},
					{ once: true }
				)
			},
			testBattery() {
				navigator
					.getBattery()
					.then((battery) => {
						console.log('Nivel de batería:', battery.level)
					})
					.catch((error) => {
						console.error('Error al obtener el nivel de batería:', error)
					})
			},
		},
	}
</script>
