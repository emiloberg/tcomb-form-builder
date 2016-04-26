import React from 'react';

import uuid from 'uuid';
import List from './List';
import Widgets from './Widgets';
import { syntaxHighlight } from './helpers';
import { convertTcombDefToState } from './convertForm';
import styles from './TcombFormBuilder.scss';

import sampleFormDef from './sampleFormDef';

const apa = convertTcombDefToState(sampleFormDef);

const initDefs = apa.defs;
const initOrder = apa.order;

const initWidgetDefs = {
	'new-123': {
		xPropName: 'NY 123'
	}
};

//const initDefs = {
//	'1a': { text: '11111' },
//	'2a': { text: '22222' },
//	'3a': { text: '33333' },
//	'4a': { text: '44444' },
//	'5a': { text: '55555' },
//	'6a': { text: '66666' }
//};
//
//const initOrder = {
//	root: [
//		'1a',
//		'2a',
//		'3a'
//	],
//	'1a': [
//		'5a'
//	],
//	'2a': [
//		'4a'
//	],
//	'4a': [
//		'6a'
//	]
//};


//const initDefs = {
//	'16db339c-6822-43e4-9c7d-1faf85fc9e69': {required: [], type: 'object', xPropName: 'not-set'},
//	'18673842-fcd1-46f7-bbd2-fcbc6d6771c0': {type: 'string', xPropName: 'Name1'},
//	'8bf02f80-4682-42b8-851a-1129eeed5f48': {type: 'string', xPropName: 'Name2'},
//	'605b5e56-039e-4c24-819d-253d87425ee6': {type: 'number', xPropName: 'Name3'},
//	'6a5d96e7-7ab8-4e45-86cd-350d156c2345': {
//		required:  ['objectBoolean'],
//		type:      'object',
//		xPropName: 'anObject'
//	},
//	'5bab5d99-cc4d-434e-8896-392d1d68195d': {type: 'boolean', xPropName: 'aBool'},
//	'c180c59c-6fa3-45a3-83b6-677f52209e12': {type: 'boolean', xPropName: 'aSecondBool'}
//};
//
//const initOrder = {
//	root:                                   ['16db339c-6822-43e4-9c7d-1faf85fc9e69'],
//	'16db339c-6822-43e4-9c7d-1faf85fc9e69': ['18673842-fcd1-46f7-bbd2-fcbc6d6771c0',
//		'8bf02f80-4682-42b8-851a-1129eeed5f48',
//		'605b5e56-039e-4c24-819d-253d87425ee6',
//		'6a5d96e7-7ab8-4e45-86cd-350d156c2345'],
//	'6a5d96e7-7ab8-4e45-86cd-350d156c2345': ['5bab5d99-cc4d-434e-8896-392d1d68195d',
//		'c180c59c-6fa3-45a3-83b6-677f52209e12']
//};


/**
 * If a user drags a new item (from widget) to the list, this function
 * clones the item definition from widgetDefs and put it in the item
 * definitions (defs).
 *
 * @param newOrder
 * @param defs
 * @param widgetDefs
 * @returns {{newOrder: *, defs: *}}
 */
function prepareNewOrderAndDefs({ newOrder, defs, widgetDefs }) {
	const fixedDefs = defs;
	const fixedNewOrder = newOrder.map(itemId => {
		if (!initDefs[itemId]) {
			const newItemId = uuid.v4();
			fixedDefs[newItemId] = widgetDefs[itemId];
			return newItemId;
		}
		return itemId;
	});

	return {
		newOrder: fixedNewOrder,
		defs: fixedDefs
	};
}


export default class AppRoot extends React.Component {
	constructor() {
		super();
		this.state = {
			order: initOrder,
			defs: initDefs,
			widgetDefs: initWidgetDefs
		};
		this.onChange = this.onChange.bind(this);
		this.createMarkup = this.createMarkup.bind(this);
	}

	onChange({ newOrder, listId }) {
		const newOrderAndDefs = prepareNewOrderAndDefs({
			newOrder,
			widgetDefs: this.state.widgetDefs,
			defs: this.state.defs
		});

		const order = {
			...this.state.order,
			[listId]: newOrderAndDefs.newOrder
		};

		this.setState({
			order,
			defs: newOrderAndDefs.defs
		});
	}

	createMarkup() { return { __html: syntaxHighlight(JSON.stringify(this.state, null, '  ')) }; }

	render() {
		return (
			<div className={ styles.wrap }>
				<Widgets />
				<div className={ styles.editor }>
					<List
						fullOrder={ this.state.order }
						defs={ this.state.defs }
						listId="root"
						onChange={ this.onChange }
					/>
				</div>
				<div className={ styles.json }><pre dangerouslySetInnerHTML={ this.createMarkup() }></pre></div>
			</div>
		);
	}
}
