import React from 'react';
import styles from './ItemControls.scss';

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

	const newButton = ({ method }) => { //eslint-disable-line react/no-multi-comp

		let buttonSVG;

		if (method === 0) {
			buttonSVG = 'M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z';
		} else if (method === -1) {
			buttonSVG = 'M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z';
		} else if (method === 1) {
			buttonSVG = 'M14.77,23.795L5.185,14.21c-0.879-0.879-0.879-2.317,0-3.195l0.8-0.801c0.877-0.878,2.316-0.878,3.194,0  l7.315,7.315l7.316-7.315c0.878-0.878,2.317-0.878,3.194,0l0.8,0.801c0.879,0.878,0.879,2.316,0,3.195l-9.587,9.585  c-0.471,0.472-1.104,0.682-1.723,0.647C15.875,24.477,15.243,24.267,14.77,23.795z';
		}

		return (
			<button
				className={ styles.controlButton }
				onClick={(e) => { //eslint-disable-line react/jsx-no-bind
					e.stopPropagation();
					move({ method });
				}}
			>
				<svg
					enable-background="new 0 0 32 32"
					height="32px"
					version="1.1"
					viewBox="0 0 32 32"
					width="32px"
				>
					<path
						d={ buttonSVG }
						fill="#515151"
					/>
				</svg>
			</button>
		);
	};

	const MoveUp = order.indexOf(nodeId) !== 0 ? newButton({ method: -1 }) : null;
	const MoveDown = order.indexOf(nodeId) !== order.length - 1 ? newButton({ method: 1 }) : null;

	return (
		<div className={ isWrapper ? styles.itemControlWrapper : styles.itemControl }>
			{ MoveUp }
			{ MoveDown }
			{ newButton({ method: 0 }) }
		</div>
	);
};

export default ItemControls;
