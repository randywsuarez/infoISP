<template>
	<div>
		<input
			v-model="inputValue"
			@keydown.enter="checkCharacters"
			placeholder="Introduce un carácter"
		/>
		<div v-if="remainingCharacters.length > 0">
			<p>Caracteres restantes: {{ remainingCharacters }}</p>
		</div>
		<div v-else>
			<p>Prueba exitosa. ¡Has presionado todos los caracteres!</p>
		</div>
		<button class="failed-button" v-show="showFailedButton" @click="handleFailure">
			Prueba fallida
		</button>
	</div>
</template>

<style scoped>
	.failed-button {
		background-color: red;
	}
</style>

<script>
	export default {
		data() {
			return {
				inputValue: '',
				allCharacters: 'abcdefghijklmnopqrstuvwxyz1234567890',
				showFailedButton: true,
			}
		},
		computed: {
			remainingCharacters() {
				return this.allCharacters.split('').filter((char) => !this.inputValue.includes(char))
			},
		},
		methods: {
			checkCharacters() {
				if (this.remainingCharacters.length === 0) {
					// Todos los caracteres han sido presionados
					console.log('entro')
					this.showFailedButton = false
					this.$emit('testComplete', true)
				} else {
					// Algunos caracteres aún no han sido presionados
					this.$emit('testComplete', false)
				}
			},
			handleFailure() {
				// Acción a realizar en caso de una prueba fallida
				this.$emit('testComplete', false)
				console.log('Prueba fallida')
			},
		},
		watch: {
			remainingCharacters: {
				handler(newVal) {
					if (newVal.length === 0) {
						this.checkCharacters()
					}
				},
				immediate: true,
			},
		},
	}
</script>
