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
						<div class="col-sm-6 col-xs-12" v-if="form.hasOwnProperty('storage2')">
							<q-input outlined v-model="form.storage2" label="Second Storage" />
						</div>
						<div class="col-sm-6 col-xs-12" v-if="form.hasOwnProperty('storage3')">
							<q-input outlined v-model="form.storage3" label="Third Storage" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input outlined v-model="form.memoryRam" label="Memory RAM" />
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-select
								v-if="psu"
								autofocus
								outlined
								v-model="form.cooler"
								:options="type"
								map-options
								emit-value
								label="Select Cooler System"
							/>
						</div>
						<div class="col-sm-6 col-xs-12">
							<q-input v-if="psu" outlined v-model="form.psu" label="Power Supply" />
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
							href="ms-settings:activation"
						/>
						<q-btn
							label="Shutdown"
							color="primary"
							class="col col-12 self-end q-mt-md"
							@click="shutdown()"
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
		<q-dialog v-model="list">
			<q-card>
				<q-card-section class="row items-center q-pb-none">
					<div class="text-h6">Loading Information</div>
					<q-space />
					<!-- <q-btn icon="close" flat round dense v-close-popup /> -->
				</q-card-section>

				<q-card-section>
					<q-list bordered>
						<q-item>
							<q-item-section>Computer Information</q-item-section>
							<q-item-section avatar v-if="!result.compSys">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>CPU Information</q-item-section>
							<q-item-section avatar v-if="!result.infoCpu">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>Hard Drive Information</q-item-section>
							<q-item-section avatar v-if="!result.hdd">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>GPU Information</q-item-section>
							<q-item-section avatar v-if="!result.vdCtrl">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>Ram Memory Information</q-item-section>
							<q-item-section avatar v-if="!result.memRam">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>Checking Windows License</q-item-section>
							<q-item-section avatar v-if="!result.license">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item v-if="act">
							<q-item-section>Activating Windows</q-item-section>
							<q-item-section avatar v-if="!result.license">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>Ram Memory Information</q-item-section>
							<q-item-section avatar v-if="!result.rmFiles">
								<q-spinner-rings color="red" />
							</q-item-section>
							<q-item-section avatar v-else>
								<q-icon color="primary" name="check_circle" />
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
			</q-card>
		</q-dialog>
		<q-dialog v-model="confirm" persistent>
			<q-card>
				<q-card-section class="row items-center">
					<q-avatar icon="power_settings_new" color="primary" text-color="white" />
					<span class="q-ml-sm">Do you want to turn off the computer?</span>
				</q-card-section>

				<q-card-actions align="right">
					<q-btn flat label="No" color="Red" v-close-popup />
					<q-btn flat label="Yes" color="primary" @click="shutdown()" />
				</q-card-actions>
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

	export default {
		name: 'PageIndex',
		data() {
			return {
				list: true,
				act: false,
				confirm: false,
				psu: true,
				touch: false,
				form: {},
				result: {
					compSys: false,
					vdCtrl: false,
					memRam: false,
					infoCpu: false,
					hdd: false,
					act: false,
					rmFiles: false,
				},
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
		async created() {
			Loading.show()
			window.addEventListener('keypress', (event) => {
				console.log('event: ', event)
				if ((event.code === 'KeyS' && event.ctrlKey) || (event.code === 'Enter' && event.repeat)) {
					this.save()
				}
			})
			//this.result.rmFiles = await this.rmFiles()
			for (let x = 0; x < 3; x++) {
				if (!this.result.compSys) this.result.compSys = await this.compSys()
				if (!this.result.infoCpu) this.result.infoCpu = await this.infoCpu()
				if (!this.result.hdd) this.result.hdd = await this.hdd()
				if (!this.result.vdCtrl) this.result.vdCtrl = await this.vdCtrl()
				if (!this.result.memRam) this.result.memRam = await this.memRam()
				if (!this.result.license) this.result.license = await this.license()
				if (
					this.result.compSys &&
					this.result.infoCpu &&
					this.result.hdd &&
					this.result.vdCtrl &&
					this.result.memRam &&
					this.result.license
				)
					break
			}
			let regex = /(\W|^)All-in-One|Desktop|Mini|Tower(\W|$)/gm
			let regTouch = /(\W|^)x360(\W|$)/gm
			this.psu = regex.test(this.form.product)
			if (regTouch.test(this.form.product)) {
				console.log('regex: ', regTouch.test(this.form.product))
				this.touch = true
			}
			await this.fnBarcode()
			console.log('result: ', this.result)
			this.list = false
			Loading.hide()
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
				return new Promise(async (resolve) => {
					let ps = new PowerShell([
						'Get-WmiObject win32_computerSystem | Select-Object SystemSKUNumber, Model | fl; Get-WmiObject Win32_computerSystemProduct | select IdentifyingNumber | fl; Get-CimInstance Win32_OperatingSystem | select Caption |fl',
					])
					ps.on('error', (err) => {
						console.error(err)
						resolve(false)
					})
					ps.on('output', async (data) => {
						data = data.toString().split('\r\n')
						this.form.sku = await this.rsValue(data, 'SystemSKUNumber', ':')
						this.form.product = await this.rsValue(data, 'Model', ':')
						this.form.serial = await this.rsValue(data, 'IdentifyingNumber', ':')
						this.form.winver = await this.rsValue(data, 'Caption', ':')
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})
					ps.on('end', (code) => {
						// Do Something on end
					})
				})
			},
			async vdCtrl() {
				return new Promise(async (resolve) => {
					let ps = new PowerShell([
						'Get-WmiObject Win32_VideoController | Select Description, AdapterRAM | ConvertTo-Json',
					])
					ps.on('error', (err) => {
						console.error(err)
						resolve(false)
					})
					ps.on('output', async (data) => {
						let info = await JSON.parse(data)
						let n = 1
						console.log('vd: ', Array.isArray(info))
						if (Array.isArray(info))
							for (let x in info) {
								this.form[`gpu${n}`] = `${info[x].Description} ${await this.rsConvert(info[x].AdapterRAM)}`
								n++
							}
						else this.form[`gpu1`] = `${info.Description} ${await this.rsConvert(info.AdapterRAM)}`
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})
					ps.on('end', (code) => {})
				})
			},
			async memRam() {
				return new Promise(async (resolve) => {
					let ps = new PowerShell([
						'Get-CimInstance win32_physicalmemory | Select Manufacturer, Capacity, Speed | convertTo-Json',
					])
					ps.on('error', (err) => {
						console.error(err)
						resolve(false)
					})
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
							? `${info[0].Manufacturer} ${await this.rsConvert(total)} ${info[0].Speed} GHz`
							: `${info.Manufacturer} ${await this.rsConvert(total)} ${info.Speed} GHz`
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})
					ps.on('end', (code) => {
						//console.log('finish')
					})
				})
			},
			async infoCpu() {
				return new Promise(async (resolve) => {
					let ps = new PowerShell([
						'Get-CimInstance Win32_Processor | Select Name, NumberOfCores, CurrentClockSpeed | fl',
					])
					ps.on('error', (err) => {
						console.error(err)
						resolve(false)
					})
					ps.on('output', async (data) => {
						data = data.toString().split('\r\n')
						this.form.cpu = await this.rsValue(data, 'Name', ':')
						this.form.cpuSpeed = `${((await this.rsValue(data, 'CurrentClockSpeed', ':')) / 1000).toFixed(
							2
						)} GHz, ${await this.rsValue(data, 'NumberOfCores', ':')} Cores`
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})
					ps.on('end', (code) => {
						//console.log('finish')
						// Do Something on end
					})
				})
			},
			async hdd() {
				return new Promise(async (resolve) => {
					try {
						// Start the process
						let ps = await new PowerShell(
							`Get-CimInstance -ClassName MSFT_PhysicalDisk -Namespace root\\Microsoft\\Windows\\Storage | Select SerialNumber, MediaType | convertTo-Json;
		           Get-CimInstance Win32_Diskdrive -Filter "Partitions>0" | Select Caption, Size, Model, serialNumber | convertTo-Json`
						)

						// Handle process errors (e.g. powershell not found)
						ps.on('error', (err) => {
							console.error(err)
							resolve(false)
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
							resolve(true)
						})

						// Stderr
						ps.on('error-output', (data) => {
							console.error(data)
							resolve(false)
						})

						// End
						ps.on('end', (code) => {
							// Do Something on end
						})
					} catch (e) {
						await this.hdd()
					}
				})
			},
			async rmFiles() {
				return new Promise(async (resolve) => {
					let ps = new PowerShell([
						`Remove-item 'C:\\Intel', 'C:\\PerfLogs', 'C:\\swsetup', 'C:\\SWSetup', 'C:\\System.sav', 'C:\\Windows.old', 'c:\\*.LOG'   –force -Recurse`,
					])
					ps.on('error', (err) => {
						console.error(err)
						resolve(false)
					})
					ps.on('output', async (data) => {
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})
					ps.on('end', (code) => {
						//console.log('finish')
						// Do Something on end
					})
				})
				/* await execSync(`cd c:/ && `, async (error, stdout, stderr) => {
							console.log(error)
							if (!error) {
							} else reject(new Error(error))
						}) */
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
							this.confirm = true
						}, 3000)
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
				/* Loading.show({
						message: 'Activating Windows...',
					}) */
				return new Promise(async (resolve) => {
					this.act = true
					let ps = new PowerShell(['slmgr /ato'])

					// Handle process errors (e.g. powershell not found)
					ps.on('error', (err) => {
						console.error(err)
					})

					// Stdout
					ps.on('output', async (data) => {
						await this.license()
						/* Loading.hide() */
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
					})

					// End
					ps.on('end', (code) => {
						// Do Something on end
					})
				})
			},
			async license() {
				this.loadingL = true
				let again = true
				return new Promise(async (resolve) => {
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
							console.log('Activar')
							again = await this.actdWin()
							//this.license()
						}
						if (!again) this.license()
						this.result.act = again
						this.loadingL = false
						console.log(this.window)
						resolve(true)
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
			async shutdown() {
				/* Loading.show({
						message: 'Activating Windows...',
					}) */
				return new Promise(async (resolve) => {
					this.act = true
					let ps = new PowerShell(['Stop-Computer -ComputerName localhost'])

					// Handle process errors (e.g. powershell not found)
					ps.on('error', (err) => {
						console.error(err)
					})

					// Stdout
					ps.on('output', async (data) => {
						resolve(true)
					})
					ps.on('error-output', (data) => {
						console.error(data)
						resolve(false)
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
					height: 100,
					displayValue: true,
					//text: this.form.serial,
					textAlign: 'center',
					fontSize: 12,
				})
				JsBarcode('#barcode2', this.form.sku, {
					format: 'CODE128',
					lineColor: '#000',
					width: 1,
					height: 100,
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
			this.$forceUpdate()
		},
	}
</script>
