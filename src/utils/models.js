export default [
    {
        value: 'System/User',
        label: 'Usuarios',
        url: 'user',
        children: [
            {
                value: 'email',
                label: 'Email',
                notArray: true
            },
            {
                value: 'name',
                label: 'Nombre',
                notArray: true
            },
            {
                value: 'last_name',
                label: 'Apellido',
                notArray: true
            },
            {
                value: 'roles',
                label: 'Roles',
                model: 'System/Role',
                children: []
            }
        ]
    },
    {
        value: 'System/Role',
        label: 'Rol',
        children: [
            {
                value: 'name',
                label: 'Nombre',
                notArray: true
            },
            {
                value: 'description',
                label: 'Descripción',
                notArray: true
            },
            {
                value: 'users',
                label: 'Usuarios',
                model: 'System/User',
                children: []
            }
        ]
    }
]