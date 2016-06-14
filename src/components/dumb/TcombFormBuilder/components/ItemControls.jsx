import React from 'react';
import styles from './TcombFormBuilder.scss';

const ItemControls = ({ show, order, listId, nodeId, onChange, isWrapper }) => { //eslint-disable-line react/no-multi-comp

	if (!show) {
		return <span />;
	}

	const move = ({ method }) => {
		const newOrder = [...order];
		const oldPosition = order.indexOf(nodeId);
		if (method === 0) { // delete
			newOrder.splice(oldPosition, 1);
		} else { // move
			const newPosition = oldPosition + method;
			const oldItem = newOrder[oldPosition];
			newOrder[oldPosition] = newOrder[newPosition];
			newOrder[newPosition] = oldItem;
		}
		onChange({
			newOrder,
			listId,
			deletedId: method === 0 ? nodeId : null
		});
	};

	const itemButton = ({ method, style }) => { //eslint-disable-line react/no-multi-comp
		return (
			<div
				className={ styles.itemControlOuter}
				onClick={(e) => { //eslint-disable-line react/jsx-no-bind
					e.stopPropagation();
					move({ method });
				}}
			>
				<div className={ style }></div>
			</div>
		);
	};

	const MoveUp = order.indexOf(nodeId) !== 0 ? itemButton({ method: -1, style: styles.itemControlUp }) : null;
	const MoveDown = order.indexOf(nodeId) !== order.length - 1 ? itemButton({ method: 1, style: styles.itemControlDown }) : null;

	return (
		<div className={ isWrapper ? styles.itemControlWrapper : styles.itemControl }>
			{ MoveUp }
			{ MoveDown }
			{ itemButton({ method: 0, style: styles.itemControlDelete }) }
		</div>
	);
};

export default ItemControls;
