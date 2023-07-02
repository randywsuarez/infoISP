<template>
	<q-page class="q-pa-md">
		<q-stepper bordered vertical>
			<q-step
				v-for="(test, index) in tests"
				:key="index"
				:done-icon="test.passed ? 'check' : null"
				:active-step-icon="test.passed ? 'check' : null"
			>
				<q-step-title>{{ test.description }}</q-step-title>
				<q-step-content>
					<!-- Contenido de cada paso -->
					<div v-if="index === 0">
						<p>Presiona las teclas alfanuméricas para realizar la prueba.</p>
						<CharacterInput @testComplete="handleTestComplete"></CharacterInput>
					</div>
					<div v-else-if="index === 1">
						<p>Reproduce un sonido en el speaker derecho.</p>
						<q-btn color="primary" label="Reproducir" @click="playSoundOnRight" />
					</div>
					<div v-else-if="index === 2">
						<p>Reproduce un sonido en el speaker izquierdo.</p>
						<q-btn color="primary" label="Reproducir" @click="playSoundOnLeft" />
					</div>
					<div v-else-if="index === 3">
						<p>Verifica el funcionamiento de la cámara.</p>
						<q-video ref="videoElement" autoplay controls />
						<q-btn color="primary" label="Iniciar prueba" @click="testCamera" />
					</div>
					<div v-else-if="index === 4">
						<p>Verifica el estado de la batería.</p>
						<q-btn color="primary" label="Comprobar" @click="testBattery" />
					</div>
					<div v-else-if="index === 5">
						<p>Prueba el funcionamiento del touchpad.</p>
						<q-btn color="primary" label="Iniciar prueba" @click="handleTouchpadTouch" />
					</div>
					<div v-else-if="index === 6">
						<p>Verifica si la computadora es touch screen y realiza una prueba en la pantalla.</p>
						<q-btn color="primary" label="Iniciar prueba" @click="testTouchScreen" />
					</div>
					<!-- Fin del contenido de cada paso -->
					<div class="q-mt-md">
						<q-btn v-if="index !== 0" color="primary" label="Atrás" @click="goToStep(index - 1)" />
						<q-btn
							v-if="index !== tests.length - 1"
							color="primary"
							label="Siguiente"
							@click="goToStep(index + 1)"
						/>
						<q-btn v-else color="primary" label="Terminar" @click="finishTests" />
					</div>
				</q-step-content>
			</q-step>
		</q-stepper>
	</q-page>
</template>

<script>
	import CharacterInput from './testing/keyboard.vue'
	export default {
		components: {
			CharacterInput,
		},
		data() {
			return {
				tests: [
					{ description: 'Prueba de teclas alfanuméricas', passed: false },
					{ description: 'Prueba de sonido en el speaker derecho', passed: false },
					{ description: 'Prueba de sonido en el speaker izquierdo', passed: false },
					{ description: 'Prueba de cámara', passed: false },
					{ description: 'Prueba de batería', passed: false },
					{ description: 'Prueba de touchpad', passed: false },
					{ description: 'Prueba de pantalla táctil', passed: false },
				],
			}
		},
		methods: {
			handleTestComplete(value) {
				// Aquí puedes hacer lo que necesites con el valor `true` o `false`
				console.log('Resultado de la prueba:', value)
			},
			goToStep(stepIndex) {
				// Navegar al paso seleccionado
				this.$refs.stepper.goToStep(stepIndex)
			},
			playSoundOnRight() {
				// Reproducir sonido en el speaker derecho
				// Marcar la prueba como aprobada
				this.tests[1].passed = true
			},
			playSoundOnLeft() {
				// Reproducir sonido en el speaker izquierdo
				// Marcar la prueba como aprobada
				this.tests[2].passed = true
			},
			async testCamera() {
				// Verificar el funcionamiento de la cámara
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ video: true })
					this.$refs.videoElement.srcObject = stream
					// Marcar la prueba como aprobada
					this.tests[3].passed = true
				} catch (error) {
					console.error('Error al acceder a la cámara:', error)
				}
			},
			testBattery() {
				// Comprobar el estado de la batería
				// Marcar la prueba como aprobada
				this.tests[4].passed = true
			},
			handleTouchpadTouch() {
				// Detectar eventos táctiles en el touchpad
				// Marcar la prueba como aprobada
				this.tests[5].passed = true
			},
			testTouchScreen() {
				// Verificar si la pantalla es táctil y realizar una prueba en la pantalla
				// Marcar la prueba como aprobada
				this.tests[6].passed = true
			},
			finishTests() {
				// Finalizar las pruebas y mostrar los resultados
				// Puedes mostrar un mensaje con el resultado de cada prueba
				this.tests.forEach((test, index) => {
					console.log(`Prueba ${index + 1}: ${test.passed ? 'Aprobada' : 'No aprobada'}`)
				})
			},
		},
	}
</script>

<style scoped>
	/* Estilos personalizados */
</style>
