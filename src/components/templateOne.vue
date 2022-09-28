<template>
	<q-page class="bg-grey-2">
		<div class="column no-scroll">
			<!-- <div
				class="q-pa-sm bg-white shadow-1"
				style="position: relative; width:100%; z-index: 5; padding-left: 40px;padding-right: 40px;"
				v-if="header"
			>
				<system-breadcrumbs>
					<slot name="button"></slot>
				</system-breadcrumbs>
			</div> -->
			<div class="scroll q-pa-xl" :style="'height: ' + alto + '; width: 100%'">
				<slot name="principal"></slot>
			</div>
		</div>
	</q-page>
</template>
<script>
	export default {
		components: {},
		props: {
			header: {
				default: true,
			},
		},
		data() {
			return {
				alto: 0,
			}
		},
		computed: {},
		methods: {
			async resolucion() {
				if (this.header) this.alto = `${(await window.innerHeight) - 155}px`
				else this.alto = '100%'
			},
		},
		async mounted() {
			window.addEventListener('resize', this.resolucion)
			await this.resolucion()
		},
	}
</script>
