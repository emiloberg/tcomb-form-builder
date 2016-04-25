/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React from 'react';
import Sortable from 'react-sortablejs';

import SortList from 'components/dumb/Sort/List';

import styles from './Sort.scss';

// Functional Component
const SortableList = ({ fullOrder, defs, listId, listOrder, onChange }) => {
	console.log('Rendering');

	let sortable = null;

	const listItems = listOrder.map((curNodeId, key) => {
		let childs = (
			<Sortable
				className={ styles.placeholder }
				options={{
						group: {
							name: 'clone',
							pull: true,
							put: true
						},
						chosenClass: styles.chosen,
						ghostClass: styles.ghost
					}}
				onChange={(newOrder, curSortable) => {
                    onChange({ newOrder, listId: [curNodeId] });
                }}
				ref={(c) => {
						if (c) {
							sortable = c.sortable;
						}
					}}
				tag="div"
			>

			</Sortable>
		);

		const curNodeChildren = fullOrder.get(curNodeId);
		if (curNodeChildren && curNodeChildren.size) {
			childs = (
				<SortList
					fullOrder={ fullOrder }
					defs={ defs }
					listId={ [curNodeId] }
					onChange={ onChange }
				/>
			);
		}

		return (
			<div className={ styles.item } key={key} data-id={curNodeId}>
				<div className={ styles.itemHeader} >Item: { defs.getIn([curNodeId, 'text']) }</div>
				<div className={ styles.itemBody }>
					{ childs }
				</div>
			</div>
		);
	});

	return (
		<div>
			<Sortable
				options={{
					group: {
						name: 'clone',
						pull: true,
						put: true
					},
					chosenClass: styles.chosen,
					ghostClass: styles.ghost
                }}
				ref={(c) => {
                    if (c) {
                        sortable = c.sortable;
                    }
                }}
				tag="div"
				onChange={(newOrder, curSortable) => {
                    onChange({ newOrder, listId });
                }}
			>
				{listItems}
			</Sortable>
		</div>
	);
};

SortableList.propTypes = {
	listOrder: React.PropTypes.any,
	onChange: React.PropTypes.func
};

export default SortableList;
