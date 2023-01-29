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
			}
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
