const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/index.vue') },
			{ path: 'system-information', component: () => import('pages/information.vue') },
			{ path: 'parts', component: () => import('src/pages/information.vue') },
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
