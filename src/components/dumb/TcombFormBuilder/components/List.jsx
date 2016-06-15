/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */

import React from 'react';
import Sortable from 'react-sortablejs';
import styles from './List.scss';
import classnames from 'classnames';

import convertSingleStateToTcomb from '../converters/convertSingleStateToTcomb';
import TCombForm from './TCombForm';
import ItemControls from './ItemControls';

const List = ({ fullOrder, defs, listId = 'root', selected, onChange, onClick }) => { //eslint-disable-line react/no-multi-comp
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
						chosenClass: styles.chosen,
						ghostClass: styles.ghost,
						animation: 180,
						delay: 140
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
				id={'item-' + curNodeId}
				data-id={curNodeId}
				onClick={(e) => {
					e.stopPropagation();
					onClick(curNodeId);
				}}
			>
				<div>
					{
						isWrapper
							? <div className={ styles.listItemWrapper }>
								<label className={ styles.labelForWrapper }>{defs[curNodeId].name}</label>
								<div className={ styles.itemControls }>
									<ItemControls
										show={ selected === curNodeId }
										order={ fullOrder[listId] }
										nodeId={ curNodeId }
										listId={ listId }
										onChange={ onChange }
										isWrapper
									/>
								</div>
							</div>
							: null
					}
				</div>
				{
					!isWrapper
						? <div className={ styles.listItemWrapper }>
							<div className={ styles.dragName }>{ defs[curNodeId].name }</div>
							<div className={ styles.itemForm }>
								<TCombForm isEditMode formDef={ convertSingleStateToTcomb(defs[curNodeId]) }/>
							</div>
							<div className={ styles.itemControls }>
								<ItemControls
									show={ selected === curNodeId }
									order={ fullOrder[listId] }
									nodeId={ curNodeId }
									listId={ listId }
									onChange={ onChange }
								/>
							</div>
						</div>
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
					delay: 140,
					onStart: (e) => {
						e.stopPropagation();
						onClick(e.item.dataset.id);
					}
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


//onEnd={() => {
//	console.log('onEnd');
//}}
//onAdd={() => {
//	console.log('onAdd');
//}}
//onSort={() => {
//	console.log('onSort');
//}}
//onUpdate={() => {
//	console.log('onUpdate');
//}}
//onRemove={() => {
//	console.log('onRemove');
//}}
//onFilter={() => {
//	console.log('onFilter');
//}}
//onMove={() => {
//	console.log('onMove');
//}}

export default List;
