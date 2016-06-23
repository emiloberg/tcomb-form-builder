/* eslint-disable no-unused-vars */

import React from 'react';
import classnames from 'classnames';
import StickyDiv from 'react-stickydiv';
import { v4 } from 'uuid';
import List from './List';
import Widgets from './Widgets';
import Options from './Options';
import FullForm from './FullForm';
import HeaderBar from './HeaderBar';
import Json from './Json';
import convertTcombDefToState from '../converters/convertTcombDefToState';
import convertStateToTcomb from './../converters/convertStateToTcomb';
import removeStateOrphans from './../helpers/removeStateOrphans';
import styles from './TcombFormBuilder.scss';
import optionsDefs from '../definitions/optionsDefs';
import objectPath from 'object-path';

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
			optionsTop: 0,
			mode: 'edit',
			showErrors: false
		};
		this.onChangeList = this.onChangeList.bind(this);
		this.onClickList = this.onClickList.bind(this);
		this.onChangeOptions = this.onChangeOptions.bind(this);
		this.selectRoot = this.selectRoot.bind(this);
		this.onChangeShowErrors = this.onChangeShowErrors.bind(this);
		this.setModeForm = this.changeMode.bind(this, { mode: 'form' });
		this.setModeEdit = this.changeMode.bind(this, { mode: 'edit' });
		this.setModeJson = this.changeMode.bind(this, { mode: 'json' });
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

		// Delete empty arrays
		if (!(!!fixedOrder.length)) {
			delete order[listId];
		}

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

		this.recalculateOptionsPosition({ selected });
	}

	onChangeShowErrors() {
		this.setState({
			showErrors: !this.state.showErrors
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

	recalculateOptionsPosition({ selected }) {
		if (selected) {
			setTimeout(() => {
				if (selected === 'root') {
					this.setState({ optionsTop: 20 }); // 0 + margin
				} else {
					const el = document.getElementById('item-' + selected);
					if (el) {
						this.setState({ optionsTop: document.getElementById('item-' + selected).offsetTop });
					}
				}
			}, 0);
		}
	}

	changeMode({ mode }) {
		this.setState({ mode });
	}

	selectRoot() {
		this.setState({ selected: 'root' });
		this.recalculateOptionsPosition({ selected: 'root' });
	}

	render() {
		const forceErrors = this.state.mode === 'form'
			? this.state.showErrors
			: false;

		const formDef = convertStateToTcomb({
			order: this.state.order,
			defs: this.state.defs,
			forceErrors
		});

		const optionsStyle = {
			//transition: 'transform 180ms',
			//transform: 'translateY(' + this.state.optionsTop + 'px)'
			paddingTop: this.state.optionsTop,
			transition: 'padding 180ms',

		};

		const options = () => {
			const flatOrder = Object.keys(this.state.order)
				.map(key => [key, ...this.state.order[key]])
				.reduce((a, b) => a.concat(b), [])
				.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

			const isSelectedAvailable = this.state.selected && flatOrder.indexOf(this.state.selected) > -1;
			return isSelectedAvailable ? (
				<div className={ styles.colOptions } style={ optionsStyle }>
					<div className={ styles.colOptionsMiddle } >
						<div className={ styles.optionsArrow }></div>
						<div className={ styles.colOptionsInner }>
							<div className={ styles.boxTitle } >
								Options
							</div>
							<Options
								defs={ this.state.defs }
								selected={ this.state.selected }
								onChange={ this.onChangeOptions }
								optionsDefs={ optionsDefs }
							/>
						</div>
					</div>
				</div>
			) : <div className={ styles.colOptions }></div>;
		};

		const formName = objectPath.get(this.state.defs, 'root.options.label') ||
			objectPath.get(this.state.defs, 'root.options.legend') ||
			'unnamed form';

		const editMode = (
			<div className={ styles.pageWrap }>
				<div className={ styles.colWidgets }>
					<StickyDiv
						offsetTop={ 16 }
					>
					<div className={ styles.colWidgetsInner }>
						<div className={ styles.boxTitle } >
							Widgets
						</div>
						<Widgets widgetsList={ initWidgetDefs } />
					</div>
					</StickyDiv>
				</div>
				<div className={ styles.colEditor }>
					<div className={ styles.colEditorInner }>
						<div className={ styles.editorTitleWrapper } onClick={ this.selectRoot }>
							<span className={ styles.editorTitle }>{ formName }</span>
							<button
								className={
									classnames({
										[styles.formSettingsButton]: true,
										[styles.formSettingsButtonActive]: this.state.selected === 'root'
									})
								}
								onClick={ this.selectRoot }
							>
								Form Settings
							</button>
						</div>
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
			</div>
		);

		const formMode = (
			<div>
				<div className={ styles.subBar }>
					<label className={ styles.checkbox }>
						<input
							type="checkbox"
							checked={this.state.showErrors}
							onChange={this.onChangeShowErrors}
						/>
						<span className={ styles.checkboxLabel }>Preview errors</span>
					</label>
				</div>

			<div className={ styles.fullFormWrapper }>
				<FullForm
					formDef={ formDef }
				/>
			</div>
			</div>
		);

		const jsonMode = (
			<div>
				<Json formDef={ formDef }/>
			</div>
		);

		let mode = editMode;
		if (this.state.mode === 'form') { mode = formMode; }
		if (this.state.mode === 'json') { mode = jsonMode; }
		const disablePreview = !formDef.schema.hasOwnProperty('properties');

		return (
			<div className={ classnames({
				[styles.component]: true,
				[styles.componentPreview]: this.state.mode === 'form'
			})}>
				<HeaderBar
					currentMode={ this.state.mode }
					setModeEdit={ this.setModeEdit }
					setModeJson={ this.setModeJson }
					setModeForm={ this.setModeForm }
					disablePreview={disablePreview}
				/>
				{ mode }
			</div>
		);
	}
}
