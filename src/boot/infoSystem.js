const PowerShell = require('powershell')
let result = {}
var rsValue = (lines, property, separator, trimmed, lineMatch) => {
	separator = separator || ':'
	property = property.toLowerCase()
	trimmed = trimmed || false
	lineMatch = lineMatch || false
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].toLowerCase().replace(/\t/g, '')
		if (trimmed) {
			line = line.trim()
		}
		if (line.startsWith(property) && (lineMatch ? line.match(property + separator) : true)) {
			const parts = trimmed ? lines[i].trim().split(separator) : lines[i].split(separator)
			if (parts.length >= 2) {
				parts.shift()
				return parts.join(separator).trim()
			} else {
				return ''
			}
		}
	}
	return ''
}
// win32_computerSystem
let compSys = () => {
	let r = {}
	let ps = new PowerShell([
		'Get-WmiObject win32_computerSystem | Select-Object SystemSKUNumber, Model | fl; Get-WmiObject Win32_computerSystemProduct | select IdentifyingNumber | fl; Get-CimInstance Win32_OperatingSystem | select Caption |fl',
	])

	// Handle process errors (e.g. powershell not found)
	ps.on('error', (err) => {
		console.error(err)
	})

	// Stdout
	ps.on('output', (data) => {
		data = data.toString().split('\r\n')
		result.sku = rsValue(data, 'SystemSKUNumber', ':')
		result.model = rsValue(data, 'Model', ':')
		result.serial = rsValue(data, 'IdentifyingNumber', ':')
		result.os = rsValue(data, 'Caption', ':')
	})
	ps.on('error-output', (data) => {
		console.error(data)
	})

	// End
	ps.on('end', (code) => {
		// Do Something on end
	})
}
let vdCtrl = () => {
	let r = {}
	// Win32_VideoController
	let ps = new PowerShell([
		'Get-WmiObject Win32_VideoController | Select Description, VideoProcessor | fl; Get-CimInstance win32_physicalmemory | Select Manufacturer, Capacity, Speed| fl',
	])

	// Handle process errors (e.g. powershell not found)
	ps.on('error', (err) => {
		console.error(err)
	})

	// Stdout
	ps.on('output', (data) => {
		data = data.toString().split('\r\n')
		result.graphic = rsValue(data, 'Description', ':')
		result.nameGraphic = rsValue(data, 'VideoProcessor', ':')
	})

	// Stderr
	ps.on('error-output', (data) => {
		console.error(data)
	})

	// End
	ps.on('end', (code) => {
		// return r;
		// Do Something on end
	})
}
let memRam = () => {
	let r = {}
	// Win32_VideoController
	let ps = new PowerShell([
		'Get-CimInstance win32_physicalmemory | Select Manufacturer, Capacity, Speed| fl',
	])

	// Handle process errors (e.g. powershell not found)
	ps.on('error', (err) => {
		console.error(err)
	})

	// Stdout
	ps.on('output', (data) => {
		data = data.toString().split('\r\n')
		result.memoryRam = `${rsValue(data, 'Manufacturer', ':')} ${(
			rsValue(data, 'Capacity', ':') /
			(1000 * 1000 * 1000)
		).toFixed(2)}GB ${rsValue(data, 'Speed', ':')} GHz`
	})
	//(rsValue(data,"Capacity",":") / (1000 * 1000 * 1000)).toFixed(2);
	// Stderr
	ps.on('error-output', (data) => {
		console.error(data)
	})

	// End
	ps.on('end', (code) => {
		console.log('finish')
		// Do Something on end
	})
}
let infoCpu = () => {
	let r = {}
	// Win32_VideoController
	let ps = new PowerShell([
		'Get-CimInstance Win32_Processor | Select Name, NumberOfCores, CurrentClockSpeed | fl',
	])

	// Handle process errors (e.g. powershell not found)
	ps.on('error', (err) => {
		console.error(err)
	})

	// Stdout
	ps.on('output', (data) => {
		data = data.toString().split('\r\n')
		result.cpu = rsValue(data, 'Name', ':')
		result.cpuSpeed = `${(rsValue(data, 'CurrentClockSpeed', ':') / 1000).toFixed(2)} GHz, ${rsValue(
			data,
			'NumberOfCores',
			':'
		)} Cores`
	})
	//(rsValue(data,"Capacity",":") / (1000 * 1000 * 1000)).toFixed(2);
	// Stderr
	ps.on('error-output', (data) => {
		console.error(data)
	})

	// End
	ps.on('end', (code) => {
		console.log('finish')
		// Do Something on end
	})
}
let infoHhd = () => {
	let r = {}
	// Win32_VideoController
	let ps = new PowerShell([
		`Get-CimInstance Win32_Diskdrive -Filter "Partitions>0" | ForEach-Object {
    $disk = Get-CimInstance -ClassName MSFT_PhysicalDisk -Namespace root\\Microsoft\\Windows\\Storage -Filter "SerialNumber='$($_.SerialNumber.trim())'"

    foreach($partition in $_ | Get-CimAssociatedInstance -ResultClassName Win32_DiskPartition){
        foreach($logicaldisk in $partition | Get-CimAssociatedInstance -ResultClassName Win32_LogicalDisk){
            [PSCustomObject]@{
                Disk          = $_.DeviceID
                DiskModel     = $_.Model
                DiskSize      = $_.Size
                HealthStatus  = $disk.HealthStatus
                BusType       = $disk.BusType
                MediaType     = $disk.MediaType
                Partition     = $partition.Name
                PartitionSize = $partition.Size
                VolumeName    = $logicaldisk.VolumeName
                DriveLetter   = $logicaldisk.DeviceID
                VolumeSize    = $logicaldisk.Size
                FreeSpace     = $logicaldisk.FreeSpace
            }
        }
    }
} | ConvertTo-Json`,
	])
	ps.on('error', (err) => {
		console.error(err)
	})

	// Stdout
	ps.on('output', async (data) => {
		let info = await JSON.parse(data)
		let n = 1
		for (let x in info) {
			if (info[x].MediaType == 4 || info[x].MediaType == 3) {
				result[`storage${n}`] = `${info[x].DiskModel} ${info[x].MediaType} ${(
					info[x].DiskSize /
					(1000 * 1000 * 1000)
				).toFixed(2)}GB`
				n++
			}
		}
	})
	ps.on('error-output', (data) => {
		console.error(data)
	})

	// End
	ps.on('end', (code) => {
		console.log('finish')
	})
}
result = { ...compSys(), ...vdCtrl(), ...memRam(), ...infoCpu(), ...infoHhd() }
setTimeout(() => console.log('Ready'), 5000)
export default ({ Vue }) => {
	Vue.prototype.$infoSystem = result
}
