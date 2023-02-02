<template>
	<!-- <q-badge color="secondary" class="q-mb-md"> Model: {{ modelMultiple || '[]' }} </q-badge> -->
	<q-select
		ref="myChipInput"
		v-model="modelMultiple"
		multiple
		outlined
		use-chips
		dark
		use-input
		new-value-mode="add"
		stack-label
		hide-dropdown-icon
		text-color="black"
		color="white"
		:label="label"
		@input.native="doStuff($event.target.value)"
		@new-value="createValue"
		@keyup.tab.native="doOtherStuff"
	>
		<template v-if="showOk" v-slot:append>
			<q-icon
				color="primary"
				name="check_circle_outline"
				class="cursor-pointer"
				@click="doOtherStuff"
			></q-icon>
		</template>
	</q-select>
</template>
<script>
	export default {
		props: {
			value: {
				default: [],
			},
			label: '',
		},
		data() {
			return {
				modelMultiple: [],
				inputValue: '',
				showOk: false,
			}
		},
		methods: {
			createValue(val, done) {
				this.showOk = false
				console.log(val)
				if (done) {
					done(val)
				}
			},
			doStuff(val) {
				this.showOk = true
				this.inputValue = val
			},
			doOtherStuff() {
				this.showOk = false
				this.$refs.myChipInput.add(this.inputValue)
				this.$refs.myChipInput.updateInputValue('')
				this.$emit('input', this.inputValue)
			},
		},
	}
</script>
