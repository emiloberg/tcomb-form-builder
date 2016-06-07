import React from 'react';

//import uuid from 'uuid';
import { v4 } from 'uuid';
//import uuidv4 from 'uuid-v4';
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

import initWidgetDefs from '../definitions/widgetDefs';

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
		this.onClickList = this.onClickList.bind(this);
		this.onChangeOptions = this.onChangeOptions.bind(this);
	}

	onClickList(itemId) {
		this.setState({ selected: itemId });
	}

	onChangeList({ newOrder, listId }) {
		// Copy stuff
		const fixedDefs = { ...this.state.defs };
		const fixedOrder = [...newOrder];

		// Find the name of the new item if we added a new item
		const addedItemIdArr = newOrder
			.map(curId => (this.state.widgetDefs.hasOwnProperty(curId) ? curId : null))
			.filter(cur => cur !== null);

		// Did we just add an item?
		const hasAddedItem = addedItemIdArr.length ? true : false;

		let newUUID;
		if (hasAddedItem) {
			const addedItemId = addedItemIdArr[0];
			const newItemIndex = newOrder.findIndex(cur => cur === addedItemId);
			newUUID = v4();

			// Replace placeholder name with new UUID in order
			fixedOrder[newItemIndex] = newUUID;

			// Copy the widget definition to the new definition state
			fixedDefs[newUUID] = { ...this.state.widgetDefs[addedItemId] };

			// Set some default values of copied widget def
			fixedDefs[newUUID].show = true;
			fixedDefs[newUUID].name = newUUID;
		}

		this.setState({
			defs: fixedDefs,
			order: {
				...this.state.order,
				[listId]: fixedOrder
			},
			selected: newUUID
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

	render() {
		const formDef = convertStateToTcomb({
			order: this.state.order,
			defs: this.state.defs
		});

		return (
			<div className={ styles.wrap }>
				<div className={ styles.widgetWrap }>
					<Widgets
						widgetsList={ initWidgetDefs }
					/>
				</div>
				<div className={ styles.editor }>
					<List
						fullOrder={ this.state.order }
						defs={ this.state.defs }
						selected={ this.state.selected }
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

				{/*
				<div className={ styles.fullFormWrapper }>
					<FullForm
						formDef={ formDef }
					/>
				</div>
				 */}

				<div className={ styles.json }>
					<Json formDef={ formDef }/>
				</div>

			</div>
		);
	}
}
