import React from 'react';

import uuid from 'uuid';
import List from './List';
import Widgets from './Widgets';
import Options from './Options';
import FullForm from './FullForm';
import Json from './Json';
import convertTcombDefToState from '../converters/convertTcombDefToState';
import convertStateToTcomb from './../converters/convertStateToTcomb';
import styles from './TcombFormBuilder.scss';
import optionsDefs from '../definitions/optionsDefs';

import sampleFormDef from '../definitions/sampleFormDef';

const initState = convertTcombDefToState(sampleFormDef);

const initDefs = initState.defs;
const initOrder = initState.order;

const initWidgetDefs = {
	'new-123': {
		schema: {
			type: 'string'
		},
		//options: {},
		//value: 'Some sample text123'
	},
	'an-object': {
		schema: {
			type: 'object'
		},
		options: {
			//label: 'New object'
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
	let justAddedItem;
	const fixedDefs = defs;
	const fixedNewOrder = newOrder.map(itemId => {
		if (!initDefs[itemId]) {
			const newItemId = uuid.v4();
			justAddedItem = newItemId;
			fixedDefs[newItemId] = widgetDefs[itemId];
			fixedDefs[newItemId].name = uuid.v4().split('-')[0];
			fixedDefs[newItemId].show = true;
			return newItemId;
		}
		return itemId;
	});

	return {
		newOrder: fixedNewOrder,
		defs: fixedDefs,
		justAddedItem
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

		const newState = {
			order,
			defs: newOrderAndDefs.defs
		};

		if (newOrderAndDefs.justAddedItem) {
			newState.selected = newOrderAndDefs.justAddedItem;
		}

		this.setState(newState);
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
		const formDef = convertStateToTcomb({
			order: this.state.order,
			defs: this.state.defs
		});

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
				<div className={ styles.fullFormWrapper }>
					<FullForm
						formDef={ formDef }
					/>
				</div>

				{/*<div className={ styles.json }><pre dangerouslySetInnerHTML={ this.createMarkup() }></pre></div>*/}
				<div className={ styles.json }>
					<Json formDef={ formDef }/>
				</div>
			</div>
		);
	}
}
