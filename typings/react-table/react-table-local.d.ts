import {
	UseColumnOrderInstanceProps,
	UseColumnOrderState,
	UseExpandedInstanceProps,
	UseExpandedOptions,
	UseExpandedRowProps,
	UseExpandedState,
	UseFiltersColumnOptions,
	UseFiltersColumnProps,
	UseFiltersInstanceProps,
	UseFiltersOptions,
	UseFiltersState,
	UseGroupByCellProps,
	UseGroupByColumnOptions,
	UseGroupByColumnProps,
	UseGroupByInstanceProps,
	UseGroupByOptions,
	UseGroupByRowProps,
	UseGroupByState,
	UsePaginationInstanceProps,
	UsePaginationOptions,
	UsePaginationState,
	UseResizeColumnsColumnOptions,
	UseResizeColumnsColumnProps,
	UseResizeColumnsOptions,
	UseResizeColumnsState,
	UseRowSelectInstanceProps,
	UseRowSelectOptions,
	UseRowSelectRowProps,
	UseRowSelectState,
	UseRowStateCellProps,
	UseRowStateInstanceProps,
	UseRowStateRowProps,
	UseSortByColumnOptions,
	UseSortByColumnProps,
	UseSortByInstanceProps,
	UseSortByOptions,
	UseSortByState,
	UseTableCellProps,
	UseResizeColumnsColumnProps,
	UseResizeColumnsState,
} from "react-table";

declare module "react-table" {
	// take this file as-is, or comment out the sections that don't apply to your plugin configuration

	export interface TableOptions<D extends object>
		extends UseTableOptions<D>,
			UseExpandedOptions<D>,
			UseFiltersOptions<D>,
			UseGroupByOptions<D>,
			UsePaginationOptions<D>,
			UseRowSelectOptions<D>,
			UseSortByOptions<D>,
			UseFiltersOptions<D>,
			UseResizeColumnsOptions<D>,
			// note that having Record here allows you to add anything to the options, this matches the spirit of the
			// underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
			// feature set, this is a safe default.
			Record<string, any> {
		autoResetHiddenColumns?: boolean;
	}

	export interface TableInstance<D extends object = {}>
		extends Omit<TableOptions<D>, "columns" | "pageCount">,
			UseTableInstanceProps<D>,
			UseColumnOrderInstanceProps<D>,
			UseExpandedInstanceProps<D>,
			UseFiltersInstanceProps<D>,
			UseGroupByInstanceProps<D>,
			UseGlobalFiltersInstanceProps<D>,
			UsePaginationInstanceProps<D>,
			UseRowSelectInstanceProps<D>,
			UseRowStateInstanceProps<D>,
			UseSortByInstanceProps<D>,
			UseResizeColumnsColumnProps<D> {}

	export interface TableState<D extends object = {}>
		extends UseColumnOrderState<D>,
			UseExpandedState<D>,
			UseFiltersState<D>,
			UseGlobalFiltersState<D>,
			UseGroupByState<D>,
			UsePaginationState<D>,
			UseRowSelectState<D>,
			UseSortByState<D> {
		hiddenColumns?: Array<IdType<D>>;
	}

	export interface ColumnInterface<D extends object = {}>
		extends UseTableColumnOptions<D>,
			UseFiltersColumnOptions<D>,
			UseGlobalFiltersColumnOptions<D>,
			UseGroupByColumnOptions<D>,
			UseSortByColumnOptions<D>,
			UseResizeColumnsColumnOptions<D> {}

	export interface ColumnInstance<D extends object = {}>
		extends Omit<ColumnInterface<D>, "id">,
			ColumnInterfaceBasedOnValue<D>,
			UseTableColumnProps<D>,
			UseFiltersColumnProps<D>,
			UseGroupByColumnProps<D>,
			UseSortByColumnProps<D>,
			UseResizeColumnsColumnProps<D> {}

	export interface Cell<D extends object = {}, V = any>
		extends UseTableCellProps<D, V>,
			UseGroupByCellProps<D>,
			UseRowStateCellProps<D> {}

	export interface Row<D extends object = {}>
		extends UseTableRowProps<D>,
			UseExpandedRowProps<D>,
			UseGroupByRowProps<D>,
			UseRowSelectRowProps<D>,
			UseRowStateRowProps<D> {}
}
