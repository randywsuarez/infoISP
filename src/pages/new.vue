<template>
	<div class="q-pa-md">
		<q-table
			class="my-sticky-column-table"
			title="Treats"
			:data="data"
			:columns="columns"
			row-key="name"
		>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td key="name" :props="props">{{ props.row.prod_num }} ({{ props.row.units }})</q-td>
					<q-td :props="props" v-for="(e, k) in ej" :key="e">
						{{ e }}
						<q-popup-edit v-model="props.row.calories" title="Update calories" buttons v-slot="scope">
							<q-input type="number" v-model="scope.value" dense autofocus />
						</q-popup-edit>
					</q-td>
				</q-tr>
			</template>
		</q-table>
	</div>
</template>

<script>
	import axios from 'axios'
	import si from 'systeminformation'
	import sudo from 'sudo-prompt'
	import exec from 'child_process'
	export default {
		data() {
			return {
				ej: [1023, 1024],
				columns: [
					{
						name: 'name',
						required: true,
						label: 'Prod Num (Units)',
						align: 'left',
						field: (row) => `${row.prod_num} (${row.units})`,
						format: (val) => `${val}`,
						sortable: true,
						classes: 'bg-grey-2 ellipsis',
						headerClasses: 'bg-primary text-white',
					},
					{
						name: 1021,
						required: true,
						label: '1021',
						align: 'left',
					},
					{
						name: 1022,
						required: true,
						label: '1021',
						align: 'left',
					},
					{
						name: 1023,
						required: true,
						label: '1021',
						align: 'left',
					},
					{
						name: 1024,
						required: true,
						label: '1021',
						align: 'left',
					},
				],

				data: [
					{
						prod_num: '10M54UA#ABL',
						units: 1,
					},
					{
						prod_num: '18W55UA#ABA',
						units: 2,
					},
					{
						prod_num: '1G128UA#ABA',
						units: 31,
					},
					{
						prod_num: '1X497UA#ABA',
						units: 7,
					},
					{
						prod_num: '2L8P1UA#ABA',
						units: 1,
					},
					{
						prod_num: '350G6UA#ABA',
						units: 186,
					},
					{
						prod_num: '350H8UA#ABA',
						units: 147,
					},
					{
						prod_num: '350M0UA#ABA',
						units: 13,
					},
					{
						prod_num: '370W4UA#ABL',
						units: 26,
					},
					{
						prod_num: '43N60UA#ABA',
						units: 31,
					},
					{
						prod_num: '482Z1UA#ABA',
						units: 1,
					},
					{
						prod_num: '4N1B0UA#ABA',
						units: 9,
					},
					{
						prod_num: '4N941UA#ABA',
						units: 200,
					},
					{
						prod_num: '4P616UA#ABA',
						units: 13,
					},
					{
						prod_num: '542F0UA#ABA',
						units: 82,
					},
					{
						prod_num: '7PD76UA#ABA',
						units: 1,
					},
					{
						prod_num: '9VU03UA#ABL',
						units: 8,
					},
					{
						prod_num: '2L7L0UA#ABL',
						units: 7,
					},
				],
				serial: 'asdasdas',
			}
		},
		methods: {
			async test(data) {
				console.log(data, this.serial)
				console.log(data.includes('Error'))
				const regex = /\<h1\>([\w\s]*)\<\/h1\>/g

				console.log(data.match(regex))
			},
			async getSystemInfo() {
				try {
					// Obtener información del sistema
					const osInfo = await si.osInfo()
					const cpu = await si.cpu()
					const memory = await si.mem()
					const battery = await si.battery()
					const diskLayout = await si.diskLayout()
					const networkInterfaces = await si.networkInterfaces()
					const graphics = await si.graphics()
					const processes = await si.processes()
					const services = await si.services()
					const users = await si.users()
					const wifiNetworks = await si.wifiNetworks()

					// Imprimir información del sistema
					console.log(`Sistema operativo: ${osInfo.distro} ${osInfo.release}`)
					console.log(`Nombre del host: ${osInfo.hostname}`)
					console.log(`Arquitectura del procesador: ${cpu.arch}`)
					console.log(`Modelo del procesador: ${cpu.manufacturer} ${cpu.brand} @ ${cpu.speed}GHz`)
					console.log(`Memoria total: ${Math.round(memory.total / 1024 / 1024)}MB`)
					console.log(`Nivel de carga de la batería: ${battery.percent}%`)
					console.log(`Redes inalámbricas disponibles:`)
					wifiNetworks.forEach((network) => {
						console.log(`  ${network.ssid} (${network.quality}%)`)
					})
					console.log(`Discos duros:`)
					diskLayout.forEach((device) => {
						if (device.type === 'HDD' || device.type === 'SSD') {
							console.log(`  ${device.name} (${Math.round(device.size / 1024 / 1024 / 1024)}GB)`)
						}
					})
					console.log(`Interfaces de red:`)
					networkInterfaces.forEach((iface) => {
						console.log(`  ${iface.iface} (${iface.ip4})`)
					})
					console.log(`Procesos en ejecución:`)
					processes.list.slice(0, 5).forEach((process) => {
						console.log(`  ${process.name} (${process.pid})`)
					})
					console.log(`Servicios en ejecución:`)
					services.list.slice(0, 5).forEach((service) => {
						console.log(`  ${service.name} (${service.status})`)
					})
					console.log(`Usuarios conectados:`)
					users.forEach((user) => {
						console.log(`  ${user.user}`)
					})
					console.log(`Controladores gráficos:`)
					graphics.controllers.forEach((controller) => {
						console.log(`  ${controller.model} (${controller.vendor})`)
					})
				} catch (error) {
					console.error(error)
				}
			},
		},
		async mounted() {
			await this.getSystemInfo()

			/* let options = {
					method: 'POST',
					url: 'http://image./inv/scanimagedchrome.py',
					data: { serial: 'C1L13402GG' },
				}
				axios
					.request(options)
					.then(function (response) {
						console.log('save')
						console.log(response.data)
					})
					.catch(function (error) {
						console.error(error)
						Loading.hide()
					}) */
			/* si
					.graphics()
					.then((data) => {
						// Filtrar para obtener información de la tarjeta gráfica dedicada
						const dedicatedGPU = data.controllers.find(
							(controller) =>
								controller.vendor.toLowerCase().includes('nvidia') ||
								controller.vendor.toLowerCase().includes('amd')
						)

						if (dedicatedGPU) {
							console.log(`VRAM de la tarjeta gráfica dedicada: ${dedicatedGPU.vram}`)
						} else {
							console.log('No se encontró información de una tarjeta gráfica dedicada')
						}
					})
					.catch((error) => { */
			/* 		console.error(error)
					})
				si.cpu().then((data) => {
					console.log(data)
				})

				si.mem().then((data) => {
					console.log(data)
				})

				si.osInfo().then((data) => {
					console.log(data)
				})

				si.system().then((data) => {
					console.log(data)
				})

				const options = {
					name: 'Nombre de la aplicación', // Nombre de la aplicación que solicita los permisos
				}

				const command = 'dxdiag' */

			/* sudo.exec(command, options, (error, stdout, stderr) => {
					if (error) {
						console.error(error)
						return
					}
					console.log(stdout)
				}) */
			// Ejecutar el comando dxdiag
			/* exec('dxdiag', (err, stdout, stderr) => {
					if (err) {
						console.error(err)
						return
					}

					// Buscar la sección "Display Devices" en la salida de dxdiag
					const displayDevicesIndex = stdout.indexOf('Display Devices')
					if (displayDevicesIndex < 0) {
						console.error('No se encontró la sección "Display Devices" en la salida de dxdiag')
						return
					}

					// Buscar el nombre del dispositivo de video en la sección "Display Devices"
					const deviceNameRegex = /Name:\s*(.+)/i
					const displayDevicesSection = stdout.slice(displayDevicesIndex)
					const deviceNameMatch = displayDevicesSection.match(deviceNameRegex)
					if (!deviceNameMatch) {
						console.error(
							'No se pudo encontrar el nombre del dispositivo de video en la sección "Display Devices"'
						)
						return
					}

					const deviceName = deviceNameMatch[1]
					console.log('Nombre del dispositivo de video:', deviceName)
				}) */
		},
	}
</script>

<style lang="sass">
	.my-sticky-column-table
	  /* specifying max-width so the example can
	    highlight the sticky column on any browser window */
	  //max-width: 600px

	  thead tr:first-child th:first-child
	    /* bg color is important for th; just specify one */
	    background-color: #fff

	  td:first-child
	    background-color: #f5f5dc

	  th:first-child,
	  td:first-child
	    position: sticky
	    left: 0
	    z-index: 1
</style>
