/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */


import React from 'react';
import Sortable from 'react-sortablejs';

import SortList from 'components/dumb/Sort/List';

import styles from './Sort.scss';

// Functional Component
const SortableList = ({ fullOrder, defs, listId, listOrder, onChange }) => {
	const listItems = fullOrder.get(listId).map((curNodeId, key) => {
		const curNodeChildren = fullOrder.get(curNodeId);
		const childs = curNodeChildren && curNodeChildren.size
			?	<SortList
					fullOrder={ fullOrder }
					defs={ defs }
					listId={ curNodeId }
					onChange={ onChange }
				/>
			:	<Sortable
					className={ styles.placeholder }
					options={{
						group: {
							name: 'clone',
							pull: false,
							put: true
						},
						animation: 180
					}}
					onChange={(newOrder) => {
						onChange({ newOrder, listId: curNodeId });
					}}
				/>
			;

		return (
			<div className={ styles.item } key={key} data-id={curNodeId}>
				<div className={ styles.itemHeader}>
					Item: { defs.getIn([curNodeId, 'text']) }
				</div>
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
					ghostClass: styles.ghost,
					animation: 180
                }}
				onChange={(newOrder) => {
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
