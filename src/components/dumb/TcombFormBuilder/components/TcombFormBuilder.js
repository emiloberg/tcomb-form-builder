/* eslint-disable no-unused-vars */

import React from 'react';

import { v4 } from 'uuid';
import List from './List';
import Widgets from './Widgets';
import Options from './Options';
import FullForm from './FullForm';
import Json from './Json';
import convertTcombDefToState from '../converters/convertTcombDefToState';
import convertStateToTcomb from './../converters/convertStateToTcomb';
import removeStateOrphans from './../helpers/removeStateOrphans';
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
			widgetDefs: initWidgetDefs,
			optionsTop: 0
		};
		this.onChangeList = this.onChangeList.bind(this);
		this.onClickList = this.onClickList.bind(this);
		this.onChangeOptions = this.onChangeOptions.bind(this);
	}

	onClickList(itemId) {
		const optionsTop = document.getElementById('item-' + itemId).offsetTop;
		this.setState({
			optionsTop,
			selected: itemId
		});
	}

	onChangeList({ newOrder, listId, deletedId }) {
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

		const selected = hasAddedItem ? newUUID : this.state.selected;

		const order = {
			...this.state.order,
			[listId]: fixedOrder
		};

		// Remove the def if we removed an item
		const fixedDefsAndOrder = deletedId
			? 	removeStateOrphans({
					defs: fixedDefs,
					order
				})
			: 	{
					defs: fixedDefs,
					order
				};

		this.setState({
			...fixedDefsAndOrder,
			selected
		});

		if (selected) {
			setTimeout(() => {
				const el = document.getElementById('item-' + selected);
				if (el) {
					this.setState({
						optionsTop: document.getElementById('item-' + selected).offsetTop
					});
				}
			}, 0);
		}
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

		const optionsStyle = {
			transition: 'transform 180ms',
			transform: 'translateY(' + this.state.optionsTop + 'px)'
		};

		const options = () => {
			const flatOrder = Object.keys(this.state.order)
				.map(key => [key, ...this.state.order[key]])
				.reduce((a, b) => a.concat(b), [])
				.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

			const isSelectedAvailable = this.state.selected && flatOrder.indexOf(this.state.selected) > -1;
			return isSelectedAvailable ? (
				<div className={ styles.colOptions } style={ optionsStyle }>
					<div className={ styles.colOptionsInner }>
						<Options
							defs={ this.state.defs }
							selected={ this.state.selected }
							onChange={ this.onChangeOptions }
							optionsDefs={ optionsDefs }
						/>
					</div>
				</div>
			) : null;
		};

		return (
			<div>
				<div className={ styles.pageWrap }>
					<div className={ styles.colWidgets }>
						<Widgets
							widgetsList={ initWidgetDefs }
						/>
					</div>
					<div className={ styles.colEditor }>
						<div className={ styles.colEditorInner }>
							<List
								fullOrder={ this.state.order }
								defs={ this.state.defs }
								selected={ this.state.selected }
								onChange={ this.onChangeList }
								onClick={ this.onClickList }
						/>
						</div>
					</div>

					{ options() }


					{/*
					<div className={ styles.fullFormWrapper }>
						<FullForm
							formDef={ formDef }
						/>
					</div>


					<div className={ styles.json }>

					</div>
					 */}

				</div>
				<Json formDef={ formDef }/>
				<Json formDef={ this.state }/>
			</div>
		);
	}
}
