import React from 'react';
import Sortable from 'react-sortablejs';
import styles from './TcombFormBuilder.scss';

const Widgets = () => {
	const listItems = ([(
		<div
			className={ styles.widgetItem }
			key="apa"
			data-id="new-123"
		>
			Text
		</div>
	), (
		<div
			className={ styles.widgetItem }
			key="apaobj"
			data-id="an-object"
		>
			Object
		</div>
		)]
	);

	return (
		<div>
			<Sortable
				options={{
					group: {
						name: 'clone',
						pull: 'clone',
						put: false
					},
					chosenClass: styles.chosen,
					ghostClass: styles.ghost,
					animation: 180
                }}
			>
				{listItems}
			</Sortable>
		</div>
	);
};

export default Widgets;
