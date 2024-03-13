// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from 'react';

import ReactDataGrid from 'react-data-grid';
import CSV from 'comma-separated-values';

class CsvViewer extends Component {

	static parse(data) {
		const rows = [];
		const columns = [];

		new CSV(data).forEach((array) => {
			if (columns.length < 1) {
				array.forEach((cell, idx) => {
					columns.push({
						key: `key-${idx}`,
						name: cell,
						resizable: true,
						sortable: true,
						filterable: true,
					});
				});
			} else {
				const row = {};
				array.forEach((cell, idx) => {
					row[`key-${idx}`] = cell;
				});
				rows.push(row);
			}
		});

		return { rows, columns };
	}

	// Helper function to apply highlights to a text
	applyHighlights = (text, highlights) => {
		let highlightedText = text;
		highlights.forEach((highlight) => {
			const highlightRegex = new RegExp(highlight.text, 'gi');
			highlightedText = highlightedText.replace(highlightRegex, (match) => {
				return `<span id="${highlight.id}" style="background-color: ${highlight.color}">${match}</span>`;
			});
		});
		return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
	};

	constructor(props) {
		super(props);
		this.state = CsvViewer.parse(props.data);
		this.state.highlights = props.highlights || [{
			text: "Installation of red stamped pavers as approved per drawing",
			id: "123",
			type: 'new-task',
			color: "green"
		}, {
			text: "Demo and Excavation of originally installed walkway pavers",
			id: "1234",
			type: "already-completed",
			color: 'red'
		}];
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ ...CsvViewer.parse(nextProps.data), highlights: nextProps.highlights || [] });
	}

	render() {
		const { rows, columns, highlights } = this.state;
		return (
			<div>
				<div>
					<Table style={{ backgroundColor: 'white' }}>
						<Thead>
							<Tr>
								{columns.map((key, index) => (
									<Th key={index} style={{
										border: '1px solid #ddd',
										padding: '8px',
										textAlign: 'left',
										width: key.minWidth
									}}>
										{key.name}
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{rows.map((product, rowIndex) => (
								<tr key={rowIndex}>
									{Object.values(product).map((value, colIndex) => (
										<Td key={colIndex} style={{ border: '1px solid #ddd', padding: '8px', width: "200px" }}>
											{this.applyHighlights(value, highlights)}
										</Td>
									))}
								</tr>
							))}
						</Tbody>
					</Table>
				</div>

			</div>
		);
	}
}

export default CsvViewer;
