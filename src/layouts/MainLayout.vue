<template>
	<q-layout view="lHh Lpr lFf" class="bg-grey-10">
		<q-header elevated>
			<q-toolbar>
				<!-- <q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="leftDrawerOpen = !leftDrawerOpen"
				/> -->

				<q-toolbar-title> ISP Electronic </q-toolbar-title>
				<q-tabs shrink stretch>
					<q-route-tab to="/system-information" label="System Information" icon="info" />
					<q-route-tab to="/parts" label="Add Parts" icon="developer_board" />
					<q-route-tab to="/new" label="Add New Computer" icon="computer" />
					<q-route-tab to="/Testing-return" label="Check Returns" icon="devices" />
					<q-route-tab to="/label" label="Labels" icon="description" />
					<q-route-tab to="/PalletReport" label="Pallet Report" icon="list" />
				</q-tabs>
				<q-btn round color="black" icon="close" @click="closeApp" />
			</q-toolbar>
		</q-header>

		<!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
			<q-list>
				<q-item-label header class="text-grey-8"> Essential Links </q-item-label>
				<EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
			</q-list>
		</q-drawer> -->

		<q-page-container>
			<router-view class="q-pa-md" />
		</q-page-container>
	</q-layout>
</template>

<script>
	import EssentialLink from 'components/EssentialLink.vue'
	const { app } = require('electron')

	const linksData = [
		{
			title: 'Docs',
			caption: 'quasar.dev',
			icon: 'school',
			link: 'https://quasar.dev',
		},
		{
			title: 'Github',
			caption: 'github.com/quasarframework',
			icon: 'code',
			link: 'https://github.com/quasarframework',
		},
		{
			title: 'Discord Chat Channel',
			caption: 'chat.quasar.dev',
			icon: 'chat',
			link: 'https://chat.quasar.dev',
		},
		{
			title: 'Forum',
			caption: 'forum.quasar.dev',
			icon: 'record_voice_over',
			link: 'https://forum.quasar.dev',
		},
		{
			title: 'Twitter',
			caption: '@quasarframework',
			icon: 'rss_feed',
			link: 'https://twitter.quasar.dev',
		},
		{
			title: 'Facebook',
			caption: '@QuasarFramework',
			icon: 'public',
			link: 'https://facebook.quasar.dev',
		},
		{
			title: 'Quasar Awesome',
			caption: 'Community Quasar projects',
			icon: 'favorite',
			link: 'https://awesome.quasar.dev',
		},
	]

	export default {
		name: 'MainLayout',
		components: {
			EssentialLink,
		},
		data() {
			return {
				leftDrawerOpen: false,
				essentialLinks: linksData,
			}
		},
		methods: {
			closeApp() {
				if (process.env.MODE === 'electron') {
					console.log(window)
					window.window.close()
				}
			},
		},
		mounted() {
			//this.$q.fullscreen.toggle()
		},
	}
</script>
