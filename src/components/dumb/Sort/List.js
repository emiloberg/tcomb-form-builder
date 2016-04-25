/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import React from 'react';
import SortableList from './NewSort';

const List = ({ fullOrder, defs, listId, onChange }) => {
	const thisListOrder = fullOrder.get(listId);

	return (
		<SortableList
			listId={ listId }
			defs={ defs }
			listOrder={ thisListOrder }
			onChange={ onChange }
			fullOrder={ fullOrder }
		/>
	);
};

export default List;
