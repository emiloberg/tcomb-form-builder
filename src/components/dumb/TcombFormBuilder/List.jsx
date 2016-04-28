/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */

import React from 'react';
import Sortable from 'react-sortablejs';
import styles from './TcombFormBuilder.scss';
import classnames from 'classnames';

import convertSingleStateToTcomb from './convertSingleStateToTcomb';
import TCombForm from './TCombForm';

const List = ({ fullOrder, defs, listId, selected, onChange, onClick }) => {
	const listItems = fullOrder[listId].map((curNodeId, key) => {
		const isWrapper = defs[curNodeId].schema.type === 'object';
		const curNodeChildren = fullOrder[curNodeId];
		const childs = curNodeChildren && curNodeChildren.length //eslint-disable-line no-nested-ternary
			?	<List
					fullOrder={ fullOrder }
					defs={ defs }
					selected={ selected }
					listId={ curNodeId }
					onChange={ onChange }
					onClick={ onClick }
				/>
			: isWrapper
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

		const wrapperStyle = {
			[styles.item]: true,
			[styles.itemSelected]: selected === curNodeId,
			[styles.itemNoShow]: !defs[curNodeId].show,
			[styles.itemIsWrapper]: isWrapper
		};

		return (
			<div
				className={ classnames(wrapperStyle) }
				key={key}
				data-id={curNodeId}
				onClick={(e) => {
					e.stopPropagation();
					onClick(curNodeId);
				}}
			>
				<div className={ styles.itemHeader}>
					{
						isWrapper
							? defs[curNodeId].name
							: null
					}
				</div>
				{
					!isWrapper
						? <TCombForm formDef={ convertSingleStateToTcomb(defs[curNodeId]) }/>
						: null
				}
				{
					childs
						? <div className={ styles.itemChild }>{ childs }</div>
						: null
				}

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
					animation: 180,
					//delay: 100
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
