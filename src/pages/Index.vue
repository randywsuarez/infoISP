<template>
	<q-page class="flex flex-center bg-white">
		<pre v-show="!(typeof result == 'object')">{{ result }}</pre>
		<div class="row col justify-center">
			<div class="col-9">
				<q-card flat bordered style="height: 80vh; width: 95%" class="inset-shadow q-ma-md">
					<q-card-section>
						<div class="text-h6">Description Commercial Laptop</div>
					</q-card-section>

					<q-card-section class="row col q-pt-none">
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.sku" label="Product Number" readonly />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.serial" label="Serial Number" readonly />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.product" label="Product" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input
								:bg-color="window ? 'green' : 'red'"
								outlined
								v-model="form.winver"
								label="Operative System"
								:hint="numberCheck"
							>
								<template v-slot:hint> {{ numberCheck }} </template>

								<template v-slot:after>
									<q-btn
										round
										dense
										flat
										icon="refresh"
										@click="license()"
										class="cursor-pointer"
										:loading="loadingL"
									/>
								</template>
							</q-input>
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.cpu" label="CPU" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.cpuSpeed" label="Speed CPU" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.gpu1" label="GPU" />
						</div>
						<div class="col-sm-6 col-xs-12" v-if="form.hasOwnProperty('gpu2')">
							<q-input outlined v-model="form.gpu2" label="GPU 2" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.storage1" label="Primary Storage" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.storage2" label="Second Storage" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.memoryRam" label="Memory RAM" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.psu" label="Power Supply" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-select
								outlined
								v-model="form.cooler"
								:options="type"
								map-options
								emit-value
								label="Select Cooler System"
							/>
						</div>
						<q-btn
							outline
							label="Save"
							color="primary"
							class="col col-12 self-end q-mt-md fixed-bottom"
							@click="save"
						/>
					</q-card-section>
				</q-card>
			</div>
			<div class="col-3" style="padding: 0px 40px">
				<q-card flat bordered style="height: 80vh; width: 80%" class="inset-shadow q-ma-md">
					<q-card-section class="row col q-pt-none justify-center" style="padding: 20px">
						<q-btn
							v-if="!barcode"
							label="Generate barcode"
							color="black"
							class="col col-12 self-end q-mt-md"
							@click="fnBarcode()"
						/>
						<div class="col-12 justify-center" v-show="barcode">
							<svg width="100%" id="barcode"></svg>
						</div>
						<div class="col-12 justify-center" v-show="barcode">
							<svg width="100%" id="barcode2"></svg>
						</div>

						<q-btn
							v-if="!window"
							label="Open Troubleshoot settings"
							color="primary"
							class="col col-12 self-end q-mt-md"
							href="ms-settings:troubleshoot?activation"
						/>
					</q-card-section>
				</q-card>
			</div>
		</div>
		<q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
			<q-card class="bg-teal text-white" style="width: 300px">
				<q-card-section>
					<div class="text-h6">Trial</div>
				</q-card-section>

				<q-card-section class="q-pt-none">
					Trial time is over. Write to: rsuarez.dev@gmail.com for more information
				</q-card-section>

				<q-card-actions align="right" class="bg-white text-teal"> </q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script>
	import PowerShell from 'powershell'
	import { required } from 'vuelidate/lib/validators'
	import { Loading, QSpinnerGears, QSpinnerHourglass } from 'quasar'
	import axios from 'axios'
	import JsBarcode from 'jsbarcode'
	import { ref } from 'vue'

	export default {
		name: 'PageIndex',
		data() {
			return {
				form: {},
				result: {},
				window: false,
				barcode: false,
				persistent: false,
				loadingL: true,
				numberCheck: '',
				type: [
					{
						label: 'Liquid Cooler',
						value: 'Liquid Cooler',
					},
					{
						label: 'Fan Cooler',
						value: 'Fan Cooler',
					},
				],
			}
		},
		validations: {
			form: {
				serial: { required },
			},
		},
		created() {
			Loading.show()
			window.addEventListener('keypress', (event) => {
				if (event.keyCode === 13) {
					// key code of the keybord key
					this.save()
					// your code to Run
				}
			})

			this.license()
			let serial = 'randy'
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
			let convert = (bytes, decimals = 2) => {
				if (bytes === 0) return '0 Bytes'
				const k = 1024
				const dm = decimals < 0 ? 0 : decimals
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
				const i = Math.floor(Math.log(bytes) / Math.log(k))
				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
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
					this.form.sku = rsValue(data, 'SystemSKUNumber', ':')
					this.form.product = rsValue(data, 'Model', ':')
					this.form.serial = rsValue(data, 'IdentifyingNumber', ':')
					this.form.winver = rsValue(data, 'Caption', ':')
					serial = rsValue(data, 'IdentifyingNumber', ':')
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
					'Get-WmiObject Win32_VideoController | Select Description, AdapterRAM | ConvertTo-Json',
				])

				// Handle process errors (e.g. powershell not found)
				ps.on('error', (err) => {
					console.error(err)
				})

				// Stdout

				ps.on('output', async (data) => {
					let info = await JSON.parse(data)
					let n = 1
					console.log('vd: ', Array.isArray(info))
					if (Array.isArray(info))
						for (let x in info) {
							this.form[`gpu${n}`] = `${info[x].Description} ${convert(info[x].AdapterRAM)}`
							n++
						}
					else this.form[`gpu1`] = `${info.Description} ${convert(info.AdapterRAM)}`
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
					'Get-CimInstance win32_physicalmemory | Select Manufacturer, Capacity, Speed | convertTo-Json',
				])

				// Handle process errors (e.g. powershell not found)
				ps.on('error', (err) => {
					console.error(err)
				})

				// Stdout
				ps.on('output', async (data) => {
					let info = await JSON.parse(data)
					let n = 1
					let total = 0
					console.log('vd: ', Array.isArray(info))
					if (Array.isArray(info))
						for (let x in info) {
							total += info[x].Capacity
						}
					else total = info.Capacity
					this.form[`memoryRam`] = Array.isArray(info)
						? `${info[0].Manufacturer} ${convert(total)} ${info[0].Speed} GHz`
						: `${info.Manufacturer} ${convert(total)} ${info.Speed} GHz`
				})
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
					this.form.cpu = rsValue(data, 'Name', ':')
					this.form.cpuSpeed = `${(rsValue(data, 'CurrentClockSpeed', ':') / 1000).toFixed(
						2
					)} GHz, ${rsValue(data, 'NumberOfCores', ':')} Cores`
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
			/* let infoHhd = () => {
				let ps = new PowerShell([
					`Get-CimInstance Win32_Diskdrive -Filter "Partitions>0" | ForEach-Object {
	    $disk = Get-CimInstance -ClassName MSFT_PhysicalDisk -Namespace root\\Microsoft\\Windows\\Storage -Filter "SerialNumber='$($_.SerialNumber.trim())'"

	    foreach($partition in $_ | Get-CimAssociatedInstance -ResultClassName Win32_DiskPartition){
	        foreach($logicaldisk in $partition | Get-CimAssociatedInstance -ResultClassName Win32_LogicalDisk){
	            [PSCustomObject]@{
	                DiskModel     = $_.Model
	                DiskSize      = $_.Size
	                MediaType     = $disk.MediaType
	            }
	        }
	    }
	} | ConvertTo-Json`,
				])
				ps.on('error', (err) => {
					console.error(err)
				})

				// Stdout
				console.log('ps: ', ps)
				ps.on('output', async (data) => {
					let info = await JSON.parse(data)
					let n = 1
					for (let x in info) {
						if (info[x].MediaType == 4 || info[x].MediaType == 3) {
							this.form[`storage${n}`] = `${info[x].DiskModel} ${info[x].MediaType} ${convert(
								info[x].DiskSize
							)}`
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
			} */
			this.result = {
				...compSys(),
				...vdCtrl(),
				...memRam(),
				...infoCpu(),
				//...infoHhd(),
			}
			return setTimeout(() => {
				this.result = this.form
				console.log('result: ', this.result)
				//JsBarcode('.barcode').init()
				console.log(serial)
				Loading.hide()
				/* this.form.serial = this.result.serial;
	      this.form.sku = this.result.sku;
	      this.form.product = this.result.model;
	      this.form.winver = this.result.winver;
	      this.form.cpu = this.result.cpu;
	      this.form.cpuSpeed = this.result.cpuSpeed;
	      this.form.gpu1 = this.result.gpu1;
	      if (this.result.hasOwnProperty("gpu2"))
	        this.form.gpu2 = this.result.gpu2;
	      this.form.memoryRam = this.result.memoryRam;
	      this.form.storage1 = this.result.storage1;
	      if (this.result.hasOwnProperty("storage2"))
	        this.form.storage2 = this.result.storage2; */

				Loading.hide()
			}, 10000)
		},
		methods: {
			async rsValue(lines, property, separator, trimmed, lineMatch) {
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
			},
			async rsConvert(bytes, decimals = 2) {
				if (bytes === 0) return '0 Bytes'
				const k = 1024
				const dm = decimals < 0 ? 0 : decimals
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
				const i = Math.floor(Math.log(bytes) / Math.log(k))
				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
			},
			async compSys() {
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
					this.form.sku = rsValue(data, 'SystemSKUNumber', ':')
					this.form.product = rsValue(data, 'Model', ':')
					this.form.serial = rsValue(data, 'IdentifyingNumber', ':')
					this.form.winver = rsValue(data, 'Caption', ':')
					serial = rsValue(data, 'IdentifyingNumber', ':')
				})
				ps.on('error-output', (data) => {
					console.error(data)
				})

				// End
				ps.on('end', (code) => {
					// Do Something on end
				})
			},
			async vdCtrl() {
				let r = {}
				// Win32_VideoController
				let ps = new PowerShell([
					'Get-WmiObject Win32_VideoController | Select Description, AdapterRAM | ConvertTo-Json',
				])

				// Handle process errors (e.g. powershell not found)
				ps.on('error', (err) => {
					console.error(err)
				})

				// Stdout

				ps.on('output', async (data) => {
					let info = await JSON.parse(data)
					let n = 1
					console.log('vd: ', Array.isArray(info))
					if (Array.isArray(info))
						for (let x in info) {
							this.form[`gpu${n}`] = `${info[x].Description} ${convert(info[x].AdapterRAM)}`
							n++
						}
					else this.form[`gpu1`] = `${info.Description} ${convert(info.AdapterRAM)}`
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
			},
			async memRam() {
				let r = {}
				// Win32_VideoController
				let ps = new PowerShell([
					'Get-CimInstance win32_physicalmemory | Select Manufacturer, Capacity, Speed | convertTo-Json',
				])

				// Handle process errors (e.g. powershell not found)
				ps.on('error', (err) => {
					console.error(err)
				})

				// Stdout
				ps.on('output', async (data) => {
					let info = await JSON.parse(data)
					let n = 1
					let total = 0
					console.log('vd: ', Array.isArray(info))
					if (Array.isArray(info))
						for (let x in info) {
							total += info[x].Capacity
						}
					else total = info.Capacity
					this.form[`memoryRam`] = Array.isArray(info)
						? `${info[0].Manufacturer} ${convert(total)} ${info[0].Speed} GHz`
						: `${info.Manufacturer} ${convert(total)} ${info.Speed} GHz`
				})
				ps.on('error-output', (data) => {
					console.error(data)
				})

				// End
				ps.on('end', (code) => {
					console.log('finish')
					// Do Something on end
				})
			},
			async infoCpu() {
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
					this.form.cpu = rsValue(data, 'Name', ':')
					this.form.cpuSpeed = `${(rsValue(data, 'CurrentClockSpeed', ':') / 1000).toFixed(
						2
					)} GHz, ${rsValue(data, 'NumberOfCores', ':')} Cores`
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
			},
			async hdd() {
				return new Promise(async (resolve) => {
					// Start the process
					let ps = await new PowerShell(
						`Get-CimInstance -ClassName MSFT_PhysicalDisk -Namespace root\\Microsoft\\Windows\\Storage | Select SerialNumber, MediaType | convertTo-Json;
	           Get-CimInstance Win32_Diskdrive -Filter "Partitions>0" | Select Caption, Size, Model, serialNumber | convertTo-Json`
					)

					// Handle process errors (e.g. powershell not found)
					ps.on('error', (err) => {
						console.error(err)
					})

					// Stdout
					ps.on('output', async (data) => {
						//console.log(data)
						let cadena = data
						let expresion = /\[([^\]]+)]/gm
						let info = await cadena.match(expresion)
						let master = await JSON.parse(info[0])
						let detall = info[1]
						detall = await JSON.parse(detall)
						console.log(typeof detall, detall)
						//console.log(typeof master, master)
						//console.log(typeof detall, detall)
						let n = 1
						let t = ''
						master = await master.filter((v) => v.MediaType == 3 || v.MediaType == 4)
						console.log('master: ', master.length)
						for (let x = 0; x < master.length; x++) {
							let s = master[x].SerialNumber
							console.log(s, detall[1])
							//detall = detall.find(async (v) => v.serialNumber == s)
							for (let a = 0; a < detall.length; a++) {
								if (s == detall[a].serialNumber) {
									console.log(detall[a].serialNumber)
									let type = detall[a].MediaType == 3 ? 'HDD' : 'SDD'
									console.log('detall: ', a, typeof detall[a], detall[a])
									this.form[`storage${n}`] = `${detall[a].Model} ${type} ${await this.rsConvert(
										detall[a].Size
									)}`
									await console.log(`${detall[a].Model} ${type} ${await this.rsConvert(detall[a].Size)}`)
									n++
								}
							}
						}
						resolve('randy')
					})

					// Stderr
					ps.on('error-output', (data) => {
						console.error(data)
					})

					// End
					ps.on('end', (code) => {
						// Do Something on end
					})
				})
			},
			async srSave() {
				Loading.show({
					message: 'Please wait, updating...',
				})
				let options = {
					method: 'POST',
					url: 'http://172.16.1.10/inv/add_details.py',
					data: {
						serial: this.form.serial,
						gpu1: this.form.gpu1,
						cooler: this.form.cooler,
						psu: this.form.psu,
						winver: this.form.winver,
					},
				}
				if (this.form.hasOwnProperty('gpu2')) options.data['gpu2'] = this.form.gpu2
				console.log('options: ', options)
				axios
					.request(options)
					.then(function (response) {
						console.log('save')
						console.log(response.data)
						Loading.show({
							spinner: QSpinnerGears,
							spinnerColor: 'red',
							messageColor: 'black',
							backgroundColor: 'yellow',
							message: 'Update!',
						})
						setTimeout(() => {
							Loading.hide()
							timer = void 0
						}, 4000)
					})
					.catch(function (error) {
						console.error(error)
						Loading.hide()
					})
			},
			async save() {
				Loading.show({
					message: 'Please wait, updating...',
				})
				const options = {
					method: 'POST',
					body: new URLSearchParams(this.form),
				}

				fetch('http://172.16.1.10/inv/add_details.py', options)
					//.then((response) => response.json())
					.then((response) => {
						Loading.show({
							spinner: QSpinnerHourglass,
							spinnerColor: 'white',
							messageColor: 'black',
							backgroundColor: 'green',
							message: `Updated serial number: ${this.form.serial}`,
						})
						setTimeout(() => {
							Loading.hide()
							timer = void 0
						}, 5000)
					})
					.catch((err) => {
						console.error(err)
						Loading.show({
							spinner: QSpinnerHourglass,
							spinnerColor: 'white',
							messageColor: 'black',
							backgroundColor: 'red',
							message: 'Error!',
						})
						setTimeout(() => {
							Loading.hide()
							timer = void 0
						}, 8000)
					})
				Loading.hide()
			},
			async actdWin() {
				return new Promise(async (resolve) => {
					let ps = new PowerShell(['slmgr /ato'])

					// Handle process errors (e.g. powershell not found)
					ps.on('error', (err) => {
						console.error(err)
					})

					// Stdout
					ps.on('output', (data) => {
						this.license()
						resolve()
					})
					ps.on('error-output', (data) => {
						console.error(data)
					})

					// End
					ps.on('end', (code) => {
						// Do Something on end
					})
				})
			},
			async license() {
				this.loadingL = true
				process.nextTick(() => {
					let ps = new PowerShell([
						'Get-CimInstance SoftwareLicensingProduct | select Name, LicenseStatus, PartialProductKey | ConvertTo-Json',
					])

					// Handle process errors (e.g. powershell not found)
					ps.on('error', (err) => {
						console.error(err)
					})

					// Stdout
					ps.on('output', async (data) => {
						let info = await JSON.parse(data)
						console.log('License: ', info, info[0].Name.substr(0, 3))
						for (let x in info) {
							if (info[x].Name.substr(0, 3) == 'Win' && info[x].LicenseStatus == 1) {
								this.window = info[x].LicenseStatus == 1 ? true : false
								this.numberCheck = `XXXXX-XXXXX-XXXXX-XXXXX-${info[x].PartialProductKey}`
								break
							}
						}
						if (!this.numberCheck) {
							await this.actdWin()
							this.license()
						} else this.loadingL = false
						console.log(this.window)
					})
					ps.on('error-output', (data) => {
						console.error(data)
					})

					// End
					ps.on('end', (code) => {
						// Do Something on end
					})
				})
			},
			async fnBarcode() {
				JsBarcode('#barcode', this.form.serial, {
					format: 'CODE128',
					lineColor: '#000',
					width: 1,
					height: 50,
					displayValue: true,
					//text: this.form.serial,
					textAlign: 'center',
					fontSize: 12,
				})
				JsBarcode('#barcode2', this.form.sku, {
					format: 'CODE128',
					lineColor: '#000',
					width: 1,
					height: 50,
					displayValue: true,
					//text: this.form.sku,
					textAlign: 'center',
					fontSize: 12,
				})
				this.barcode = true
			},
		},
		async mounted() {
			let limit = new Date(2022, 12, 31)
			let today = new Date()
			if (today.valueOf() > limit.valueOf()) this.persistent = true
			//await this.license()
			//JsBarcode('#seial', '12345670')
			/* this.document.addEventListener('keyup', (event) => {
				if (event.code == 'control' && event.code == 'KeyS') {
					console.log('guarda')
				}
				var keyValue = event.key
				var codeValue = event.code

				console.log('keyup event, keyValue: ' + keyValue)
				console.log('keyup event, codeValue: ' + codeValue)
			}) */
			let test = await this.hdd()
			console.log('test: ', test)

			this.$forceUpdate()
		},
	}
</script>
