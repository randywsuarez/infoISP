const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/index.vue') },
			{ path: 'system-information', component: () => import('pages/information.vue') },
			{ path: 'Testing-return', component: () => import('pages/testing.vue') },
			{ path: 'testing', component: () => import('pages/testing.vue') },
			{ path: 'new', component: () => import('pages/new.vue') },
			{ path: 'Label', component: () => import('pages/label.vue') },
			{ path: 'PalletReport', component: () => import('pages/palletReport.vue') },
			{ path: 'HP', component: () => import('pages/hpInformation.vue') },
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue'),
	},
]

export default routes
