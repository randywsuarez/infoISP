<template>
	<q-table :data="systemInfo">
		<template v-slot:header>
			<q-tr>
				<q-th>Sistema operativo</q-th>
				<q-th>Procesador</q-th>
				<q-th>Memoria</q-th>
				<q-th>Batería</q-th>
				<q-th>Discos duros</q-th>
			</q-tr>
		</template>

		<template v-slot:body="props">
			<q-tr :props="props">
				<q-td>{{ props.row.os }}</q-td>
				<q-td>{{ props.row.cpu }}</q-td>
				<q-td>{{ props.row.memory }}</q-td>
				<q-td>{{ props.row.battery }}</q-td>
				<q-td>{{ props.row.disks }}</q-td>
			</q-tr>
		</template>
	</q-table>
</template>
<script>
	import { getSystemInfo } from 'src/utils/systemInfo'
	export default {
		name: 'SystemInfo',

		data() {
			return {
				systemInfo: [],
			}
		},

		async created() {
			try {
				const info = await getSystemInfo()

				// Formatear los datos del sistema para mostrarlos en la tabla
				const systemInfo = [
					{
						os: `${info.os.distro} ${info.os.release}`,
						cpu: `${info.cpu.manufacturer} ${info.cpu.brand} @ ${info.cpu.speed}GHz`,
						memory: `${Math.round(info.memory.total / 1024 / 1024)}MB`,
						battery: `${info.battery.percent}%`,
						disks: info.disks
							.filter((disk) => disk.type === 'HDD' || disk.type === 'SSD')
							.map((disk) => `${disk.name} (${Math.round(disk.size / 1024 / 1024 / 1024)}GB)`)
							.join(', '),
					},
				]

				this.systemInfo = systemInfo
			} catch (error) {
				console.error(error)
			}
		},
	}
</script>
