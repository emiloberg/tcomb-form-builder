/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */

import React from 'react';
import Sortable from 'react-sortablejs';
import styles from './TcombFormBuilder.scss';

const List = ({ fullOrder, defs, listId, onChange }) => {
	const listItems = fullOrder[listId].map((curNodeId, key) => {
		const mayHaveChildren = defs[curNodeId].schema.type === 'object';
		const curNodeChildren = fullOrder[curNodeId];
		const childs = curNodeChildren && curNodeChildren.length //eslint-disable-line no-nested-ternary
			?	<List
					fullOrder={ fullOrder }
					defs={ defs }
					listId={ curNodeId }
					onChange={ onChange }
				/>
			: mayHaveChildren
				? <Sortable
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
				: null
				;

		return (
			<div className={ styles.item } key={key} data-id={curNodeId}>
				<div className={ styles.itemHeader}>
					Item: { defs[curNodeId].xPropName }
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

export default List;
