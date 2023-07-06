<template>
	<div>
		<button @click="startTest">Iniciar prueba</button>
		<button @click="confirm(true)" v-show="showConfirmButton">Funciona</button>
		<button @click="confirm(false)" v-show="showConfirmButton">No funciona</button>
	</div>
</template>

<script>
	import { Howl } from 'howler'

	export default {
		data() {
			return {
				showConfirmButton: false,
				sound: null,
			}
		},
		methods: {
			startTest() {
				this.sound = new Howl({
					src: ['path/to/your/sound.mp3'], // Ruta al archivo de sonido que deseas reproducir
					autoplay: true,
					loop: true,
				})

				// Iniciar el ciclo de prueba después de 3 segundos
				setTimeout(() => {
					this.playSound('left', () => {
						this.playSound('right', () => {
							this.showConfirmButton = true // Mostrar los botones de confirmación
						})
					})
				}, 3000)
			},
			playSound(side, callback) {
				console.log(`Reproduciendo sonido en ${side} altavoz`)
				setTimeout(callback, 3000) // Simulación de reproducción de sonido durante 3 segundos

				// Si deseas utilizar el objeto `sound` de Howler.js para controlar la reproducción real del sonido,
				// puedes utilizar métodos como `this.sound.play()` y `this.sound.stop()` en lugar de `setTimeout`.
			},
			confirm(value) {
				console.log(`El altavoz funciona: ${value}`)

				if (this.sound) {
					this.sound.stop() // Detener la reproducción del sonido
				}

				// Aquí puedes hacer algo con el valor, como enviarlo a través de una API o guardarlo en el estado del componente
			},
		},
		beforeDestroy() {
			if (this.sound) {
				this.sound.unload()
			}
		},
	}
</script>
