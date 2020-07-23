import React, { useState, useEffect } from "react";
import { TestTable } from "./TestTable";
import styled from "styled-components";

import MakeData from "./MakeData";

const Styles = styled.div`
	padding: 1rem;

	.table {
		display: inline-block;
		border-spacing: 0;
		border: 1px solid black;

		.tr {
			:last-child {
				.td {
					border-bottom: 0;
				}
			}
			.selected {
				background: #7fceff;
			}
			:hover {
				background: #a6ddff;
			}
		}

		.th,
		.td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			${"" /* In this example we use an absolutely position resizer,
       so this is required. */}
			position: relative;

			:last-child {
				border-right: 0;
			}

			.resizer {
				display: inline-block;
				background: blue;
				width: 10px;
				height: 100%;
				position: absolute;
				right: 0;
				top: 0;
				transform: translateX(50%);
				z-index: 1;
				${"" /* prevents from scrolling while dragging on touch devices */}
				touch-action:none;

				&.isResizing {
					background: red;
				}
			}
		}
	}
`;

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

export interface IGridProps {}

const TestGrid: React.FC<IGridProps> = ({}) => {
	const columns = React.useMemo(
		() => [
			{
				Header: "Name",
				columns: [
					{
						Header: "First Name",
						accessor: "firstName",
					},
					{
						Header: "Last Name",
						accessor: "lastName",
					},
				],
			},
			{
				Header: "Info",
				columns: [
					{
						Header: "Age",
						accessor: "age",
					},
					{
						Header: "Visits",
						accessor: "visits",
					},
					{
						Header: "Status",
						accessor: "status",
					},
					{
						Header: "Profile Progress",
						accessor: "progress",
					},
				],
			},
		],
		[]
	);
	const [newlimit, setNewLimit] = React.useState(1000);
	const [data, setData] = React.useState(() => MakeData(newlimit));
	const [originalData] = React.useState(data);
	const [check, setCheck] = useState(true);

	// We need to keep the table from resetting the pageIndex when we
	// Update data. So we can keep track of that flag with a ref.
	const skipResetRef = React.useRef(false);

	// When our cell renderer calls updateMyData, we'll use
	// the rowIndex, columnId and new value to update the
	// original data
	const updateMyData = (rowIndex, columnId, value) => {
		// We also turn on the flag to not reset the page
		skipResetRef.current = true;
		console.log("update true");
		setData((old) =>
			old.map((row, index) => {
				if (index === rowIndex) {
					return {
						...row,
						[columnId]: value,
					};
				}
				return row;
			})
		);
	};

	React.useEffect(() => {
		console.log("current change :" + skipResetRef.current);
	}, [skipResetRef.current]);
	// After data changes, we turn the flag back off
	// so that if data actually changes when we're not
	// editing it, the page is reset
	React.useEffect(() => {
		skipResetRef.current = false;
		console.log("current false");
	}, [data]);

	// Let's add a data resetter/randomizer to help
	// illustrate that flow...
	const newData = () => {
		// Don't reset the page when we do this
		skipResetRef.current = true;
		console.log("newData");
		setData(() => MakeData(newlimit));
		setNewLimit(newlimit + 10);
	};

	React.useEffect(() => {
		let timerID;
		if (!check) {
			timerID = setInterval(() => newData(), 5000);
		}
		return function cleanup() {
			clearInterval(timerID);
		};
	});
	return (
		<>
			<Styles>
				<input type="checkbox" onClick={(e) => setCheck(!check)} checked={check} />

				<button onClick={newData}>Make New Data</button>
				<TestTable skipReset={skipResetRef.current} updateMyData={updateMyData} data={data} columns={columns} />

				<pre>
					<code>{JSON.stringify({ skipResetRef }, null, 2)}</code>
				</pre>
			</Styles>
		</>
	);
};

export { TestGrid };
