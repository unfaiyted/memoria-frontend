<script lang="ts">
	import type { TableHandler } from '@vincjo/datatables';
	export let table: TableHandler;
	const rowCount = table.rowCount;
</script>

<aside class="text-sm leading-8 mr-6">
	{#if rowCount.total > 0}
		<b>{rowCount.start}</b>
		- <b>{rowCount.end}</b>
		/ <b>{rowCount.total}</b>
	{:else}
		No entries found
	{/if}
</aside>
