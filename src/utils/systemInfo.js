const si = require('systeminformation')

async function getSystemInfo() {
	try {
		const osInfo = await si.osInfo()
		const cpu = await si.cpu()
		const memory = await si.mem()
		const battery = await si.battery()
		const disks = await si.diskLayout()

		return {
			os: {
				distro: osInfo.distro,
				release: osInfo.release,
			},
			cpu: {
				manufacturer: cpu.manufacturer,
				brand: cpu.brand,
				speed: cpu.speed,
			},
			memory: {
				total: memory.total,
			},
			battery: {
				percent: battery.percent,
			},
			disks: disks.map((disk) => ({
				name: disk.name,
				size: disk.size,
				type: disk.type,
			})),
		}
	} catch (error) {
		console.error(error)
		return {}
	}
}

module.exports = {
	getSystemInfo,
}
