export default [
    {
        title: 'Tablero',
        path: '/admin/dashboard'
    },
    {
        title: 'Seguridad',
        path: '/admin/seguridad',
        children: [
            {
                title: 'Códigos de aprobación',
                path: '/admin/dashboard/codigos'
            }
        ]
    },
    {
        title: 'Sistema',
        path: '/admin/sistema',
        children: [
            {
                title: 'Usuarios',
                path: '/admin/users',
                children: [
                    {
                        title: 'Crear',
                        isAction: true,
                        permission: 'users-store'
                    },
                    {
                        title: 'Editar',
                        isAction: true,
                        permission: 'users-update'
                    },
                    {
                        title: 'Eliminar',
                        isAction: true,
                        permission: 'users-delete'
                    }
                ]
            },
            {
                title: 'Roles',
                path: '/admin/roles'
            }
        ]
    }
]