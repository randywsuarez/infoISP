import readXlsxFile from 'read-excel-file'


export default (ctx) => {
	
  ctx.Vue.prototype.$readExcel = file => {
  	var vm = this
  	return new Promise(resolve => {
  		readXlsxFile(file)
  		.then(rows => resolve(rows))
  		.catch(async error => {
  			//console.log('error',error.message)
  			//console.log(ctx.app.store._vm.$files)
  			//console.log(file)
  			await ctx.app.store._vm.$files('files/' + file.name).put(file)
  			var values = await ctx.app.store._vm.$db.functions('excel-to-json', 'files/' + file.name)
  			//console.log(values)
  			resolve(values)
  		})
  	})
  }

}
