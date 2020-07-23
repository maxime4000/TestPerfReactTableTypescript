import React from "react";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useSortBy,
	useGroupBy,
	useExpanded,
	usePagination,
	useRowSelect,
	useColumnOrder,
	useResizeColumns,
	useFlexLayout,
	UseTableOptions,
	TableInstance,
	CellProps,
	HeaderProps,
	useBlockLayout,
	Column,
} from "react-table";
import matchSorter from "match-sorter";


export interface ITableProps {
	columns: Column[];
	data: any[];
	updateMyData: (rowIndex: number, columnId: number, value: any) => void;
	skipReset: boolean;
}

const headerProps = (props: any, { column }: any) => getStyles(props, column.align);

const cellProps = (props: any, { cell }: any) => getStyles(props, cell.column.align);

const getStyles = (props: any, align = "left") => [
	props,
	{
		style: {
			justifyContent: align === "right" ? "flex-end" : "flex-start",
			alignItems: "flex-start",
			display: "flex",
		},
	},
];

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref: any) => {
	const defaultRef = React.useRef();
	const resolvedRef = ref || defaultRef;

	React.useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate;
	}, [resolvedRef, indeterminate]);

	return (
		<>
			<input type="checkbox" ref={resolvedRef} {...rest} />
		</>
	);
});
/*
// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
	const count = preFilteredRows.length;

	return (
		<input
			value={filterValue || ""}
			onChange={(e) => {
				setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`Search ${count} records...`}
		/>
	);
}

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [(row: any) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;
*/

const TestTable: React.FC<ITableProps> = ({ columns, data, updateMyData, skipReset }: ITableProps) => {
	/*
	const filterTypes = React.useMemo(
		() => ({
			// Add a new fuzzyTextFilterFn filter type.
			fuzzyText: fuzzyTextFilterFn,
			// Or, override the default text filter to use
			// "startWith"
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
						: true;
				});
			},
		}),
		[]
	);
	*/
	const defaultColumn = React.useMemo(
		() => ({
			// When using the useFlexLayout:
			minWidth: 30, // minWidth is only used as a limit for resizing
			width: 150, // width is used for both the flex-basis and flex-grow
			//maxWidth: 200, // maxWidth is only used as a limit for resizing
			// Let's set up our default Filter UI
			//Filter: DefaultColumnFilter,
			// And also our default editable cell
			//Cell: EditableCell
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows,
		page,
		allColumns,
		getToggleHideAllColumnsProps,

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: {
			pageIndex,
			pageSize,
			sortBy,
			groupBy,
			expanded,
			filters,
			selectedRowIds,
			hiddenColumns,
			columnOrder,
			globalFilter,
		},
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: {
				pageSize: 7,
				groupBy: [], //["Name", "Dataset", "Group"],
				hiddenColumns: ["progress"],
			},
			//filterTypes,

			// updateMyData isn't part of the API, but
			// anything we put into these options will
			// automatically be available on the instance.
			// That way we can call this function from our
			// cell renderer!
			updateMyData: updateMyData,
			// We also need to pass this so the page doesn't change
			// when we edit the data.
			autoResetPage: !skipReset,
			autoResetExpanded: !skipReset,
			autoResetGroupBy: !skipReset,
			autoResetSelectedRows: !skipReset,
			autoResetSortBy: !skipReset,
			autoResetFilters: !skipReset,
			autoResetRowState: !skipReset,
			autoResetHiddenColumns: !skipReset,
			autoResetResize: skipReset,
			disableMultiSort: true,
		},
		useGlobalFilter,
		useFilters,
		useColumnOrder,
		useGroupBy,
		useSortBy,
		useRowSelect,
		useExpanded,
		//useFlexLayout,
		useBlockLayout,
		useResizeColumns,
		usePagination,

		(hooks) => {
			hooks.allColumns.push((columns) => [
				// Let's make a column for selection
				{
					id: "selection",
					disableResizing: true,
					minWidth: 35,
					width: 35,
					maxWidth: 35,
					groupByBoundary: true,
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox
					Header: ({ getToggleAllRowsSelectedProps }) => (
						<div>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</div>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					Cell: ({ row }) => (
						<div>
							<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
						</div>
					),
				},
				...columns,
			]);
			hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
				// fix the parent group of the selection button to not be resizable
				const selectionGroupHeader = headerGroups[0].headers[0];
				selectionGroupHeader.canResize = false;
			});
		}
	);
	const state = {
		pageIndex,
		pageSize,
		sortBy,
		groupBy,
		expanded,
		filters,
		selectedRowIds,
		hiddenColumns,
		columnOrder,
		globalFilter,
	};
	return (
		<>
			<div style={{ display: "inline-block" }}>
				<div>
					<IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
				</div>
				{allColumns.map((column) => (
					<div key={column.id}>
						<label>
							<input type="checkbox" {...column.getToggleHiddenProps()} /> {column.id}
						</label>
					</div>
				))}
				<br />
			</div>
			<div style={{ display: "inline-block" }} {...getTableProps()} className="table">
				<div className="header">
					{headerGroups.map((headerGroup) => (
						<div {...headerGroup.getHeaderGroupProps()} className="tr">
							{headerGroup.headers.map((column) => (
								<div {...column.getHeaderProps()} className="th">
									<div>
										{column.canGroupBy ? (
											// If the column can be grouped, let's add a toggle
											<span {...column.getGroupByToggleProps()}>
												{column.isGrouped ? "🛑 " : "👊 "}
											</span>
										) : null}
										<span {...column.getSortByToggleProps()}>
											{column.render("Header")}
											{/* Add a sort direction indicator */}
											{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
										</span>
										{/* Use column.getResizerProps to hook up the events correctly */}
										{column.canResize && <div {...column.getResizerProps()} className="resizer" />}
									</div>
									{/* Render the columns filter UI 
									<div>{column.canFilter ? column.render("Filter") : null}</div>
									*/}
								</div>
							))}
						</div>
					))}
				</div>
				<div className="body">
					{page.map((row) => {
						prepareRow(row);
						return (
							<div
								{...row.getRowProps()}
								className={`tr row ${row.isSelected ? "selected" : ""}`}
								onClick={(e) => {
									console.log(row);
									row.toggleRowSelected(!row.isSelected);
								}}
							>
								{row.cells.map((cell) => {
									return (
										<div {...cell.getCellProps()} className="td">
											{cell.isGrouped ? (
												// If it's a grouped cell, add an expander and row count
												<>
													<span {...row.getToggleRowExpandedProps()}>
														{row.isExpanded ? "👇" : "👉"}
													</span>{" "}
													{cell.render("Cell", { editable: false })} ({row.subRows.length})
												</>
											) : cell.isAggregated ? (
												// If the cell is aggregated, use the Aggregated
												// renderer for cell
												cell.render("Aggregated")
											) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
												// Otherwise, just render the regular cell
												cell.render("Cell", { editable: true })
											)}
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
				<div className="footer">
					<div className="pagination">
						<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
							{"<<"}
						</button>{" "}
						<button onClick={() => previousPage()} disabled={!canPreviousPage}>
							{"<"}
						</button>{" "}
						<button onClick={() => nextPage()} disabled={!canNextPage}>
							{">"}
						</button>{" "}
						<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
							{">>"}
						</button>{" "}
						<span>
							Page{" "}
							<strong>
								{pageIndex + 1} of {pageOptions.length}
							</strong>{" "}
						</span>
						<span>
							| Go to page:{" "}
							<input
								type="number"
								defaultValue={pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									gotoPage(page);
								}}
								style={{ width: "100px" }}
							/>
						</span>{" "}
						<select
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
							}}
						>
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div style={{ display: "inline-block" }}>
				<pre>
					<code>{JSON.stringify(state, null, 2)}</code>
				</pre>
			</div>
		</>
	);
};

export { TestTable };
