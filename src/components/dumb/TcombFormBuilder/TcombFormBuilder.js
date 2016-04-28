import React from 'react';

import uuid from 'uuid';
import List from './List';
import Widgets from './Widgets';
import Options from './Options';
import { syntaxHighlight } from './helpers';
import { convertTcombDefToState } from './convertForm';
import styles from './TcombFormBuilder.scss';
import optionsDefs from './optionsDefs';

import sampleFormDef from './sampleFormDef';

const initState = convertTcombDefToState(sampleFormDef);

const initDefs = initState.defs;
const initOrder = initState.order;

const initWidgetDefs = {
	'new-123': {
		show: true,
		name: 'New 134',
		schema: {
			type: 'string'
		},
		options: {
			label: 'New Name'
		},
		value: 'Some sample text123'
	},
	'an-object': {
		show: true,
		name: 'anObject',
		schema: {
			type: 'object'
		},
		options: {
			label: 'New object'
		}
	}
};

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
			selected: null,
			order: initOrder,
			defs: initDefs,
			widgetDefs: initWidgetDefs
		};
		this.onChangeList = this.onChangeList.bind(this);
		this.createMarkup = this.createMarkup.bind(this);
		this.onClickList = this.onClickList.bind(this);
		this.onChangeOptions = this.onChangeOptions.bind(this);
	}

	onClickList(itemId) {
		this.setState({ selected: itemId });
	}

	onChangeList({ newOrder, listId }) {
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

	onChangeOptions({ def, id }) {
		this.setState({
			defs: {
				...this.state.defs,
				[id]: def
			}
		});
	}

	createMarkup() { return { __html: syntaxHighlight(JSON.stringify(this.state, null, '  ')) }; }

	render() {
		return (
			<div className={ styles.wrap }>
				<div className={ styles.widgetWrap }>
					<Widgets />
				</div>
				<div className={ styles.editor }>
					<List
						fullOrder={ this.state.order }
						defs={ this.state.defs }
						selected={ this.state.selected }
						listId="root"
						onChange={ this.onChangeList }
						onClick={ this.onClickList }
					/>
				</div>
				<div className={ styles.options }>
					<Options
						defs={ this.state.defs }
						selected={ this.state.selected }
						onChange={ this.onChangeOptions }
						optionsDefs={ optionsDefs }
					/>
				</div>
				<div className={ styles.json }><pre dangerouslySetInnerHTML={ this.createMarkup() }></pre></div>
			</div>
		);
	}
}
