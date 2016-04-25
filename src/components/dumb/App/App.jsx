import React from 'react';

//import Forms from 'components/dumb/Forms/Forms';
//import DND from 'components/dumb/DND/Container';
//import Sort from 'components/dumb/Sort/Sort';
import SortList from 'components/dumb/Sort/List';
//import fullFormDef from './../Forms/sampleFormDef.js';

import classnames from 'classnames';

import { fromJS, List, Map } from 'immutable';
import styles from 'components/dumb/Sort/Sort.scss';

const defs = fromJS({
	'1a': { text: '11111' },
	'2a': { text: '22222' },
	'3a': { text: '33333' },
	'4a': { text: '44444' },
	'5a': { text: '55555' },
	'6a': { text: '66666' },
	'placeholder': { text: 'placeholder' },
});

const order = new Map({
	root: new List([
		'1a',
		'2a',
		'3a'
	]),
	'1a': new List([
		'5a'
	]),
	'2a': new List([
		'4a'
	]),
	'5a': new List(),
	'6a': new List(),
	'3a': new List(),
	'4a': new List([
		'6a'
	])

});


function syntaxHighlight(json) {
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		var cls = styles.syntaxNumber;
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = styles.syntaxKey;
			} else {
				cls = styles.syntaxString;
			}
		} else if (/true|false/.test(match)) {
			cls = styles.syntaxBoolean;
		} else if (/null/.test(match)) {
			cls = styles.syntaxNull;
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}

export default class AppRoot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			order
		};
		this.onChange = this.onChange.bind(this);
		this.createMarkup = this.createMarkup.bind(this);
	}

	onChange({ newOrder, listId }) {
		const newState = this.state.order.set(listId, new List(newOrder));
		this.setState({
			order: newState
		});
	}

	createMarkup() { return { __html: syntaxHighlight(JSON.stringify(this.state, null, '  ')) }; }

	render() {
		const wrapperStyle = {
			[styles.wrap]: true,
		};

		return (
			<div className={ classnames(wrapperStyle) }>
				<div className={ styles.editor }>
					<SortList
						fullOrder={ this.state.order }
						defs={ defs }
						listId="root"
						onChange={ this.onChange }
					/>
				</div>
				<div className={ styles.json }><pre dangerouslySetInnerHTML={ this.createMarkup() }></pre></div>
			</div>
		);
	}
}
