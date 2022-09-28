<template>
	<div class="col row q-pa-md bg-grey-10">
		<q-toolbar class="bg-dark text-white shadow-2 rounded-borders flex-basis">
			<q-btn flat label="Homepage" />
			<q-space />

			<!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
			<q-tabs v-model="tab" shrink stretch>
				<q-tab name="info" label="System Information" icon="mail" />
				<q-tab name="parts" label="Add Parts" icon="mail" />
				<q-tab name="new" label="Add New Computer" icon="mail" />
			</q-tabs>
		</q-toolbar>

		<q-separator />
		<q-tab-panels v-model="tab" animated class="bg-grey-10">
			<q-tab-panel name="info" dark>
				<info />
			</q-tab-panel>
			<q-tab-panel name="parts" dark>
				<parts />
			</q-tab-panel>
		</q-tab-panels>
	</div>
</template>

<script>
	import info from 'pages/information.vue'
	import parts from 'pages/parts.vue'
	export default {
		components: {
			info,
			parts,
		},
		data() {
			return {
				tab: 'new',
			}
		},
	}
</script>
