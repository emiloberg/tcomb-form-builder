import React from 'react';
import Sortable from 'react-sortablejs';
import styles from './Widgets.scss';

const Widgets = ({ widgetsList }) => {
	const listItems = Object.keys(widgetsList).map(key => {
		return (
			<div
				className={ styles.widgetItem }
				key={key}
				data-id={key}
			>
				{widgetsList[key].label}
			</div>
		);
	});

	return (
		<div>
			<Sortable
				options={{
					group: {
						name: 'clone',
						pull: 'clone',
						put: false
					},
					//chosenClass: styles.chosen,
					//ghostClass: styles.ghost,
					animation: 180,
					sort: false
                }}
			>
				{ listItems }
			</Sortable>
		</div>
	);
};

export default Widgets;
