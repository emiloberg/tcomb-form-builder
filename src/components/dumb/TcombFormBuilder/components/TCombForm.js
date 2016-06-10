import React from 'react';
import t from 'tcomb-form/lib';
import templates from 'tcomb-form-templates-bootstrap';
import transform from 'tcomb-json-schema';
//import classnames from 'classnames';
//import styles from './TcombFormBuilder.scss';

const TCombForm = React.createClass({ //eslint-disable-line react/no-multi-comp
	propTypes: {
		formDef: React.PropTypes.object,
		onChange: React.PropTypes.func,
		isEditMode: React.PropTypes.bool
	},

	onChange(/*changeValue, path*/) {
		if (this.props.onChange) {
			//console.log('----------');
			//console.log('val', this.refs.form.getComponent(path).validate());
			// TODO Add validation
			//console.log('val1', this.refs.form.validate());
			//console.log('----------');
			//console.log('this.refs.form.getValue()', this.refs.form.getValue());
			this.props.onChange(this.refs.form.getValue());
			//this.refs.form.getComponent(path).validate();
		}
	},

	render() {
		const transformedJson = {
			type: transform(this.props.formDef.schema),
			options: this.props.formDef.options,
			value: this.props.formDef.value
		};

		/**
		 * REGISTER FACTORIES
		 * This is just a hack. Make it so that:
		 * 1) It loops nested fields
		 * 2) A user can add their own factories
 		 */
		Object.keys(transformedJson.options.fields).forEach(key => {
			const curField = transformedJson.options.fields[key];
			if (curField.hasOwnProperty('factory')) {
				if (curField.factory === 'Radio') {
					transformedJson.options.fields[key].factory = t.form.Radio;
				}
			}
		});

		t.form.Form.templates = templates;
		t.form.Form.i18n = {
			down: '	↓',
			up: '↑',
			add: 'Add',
			remove: '-',
			optional: '',
			required: ' *'
		};

		const stylesForm = this.props.isEditMode ? {
			margin: 0
		} : {};

		return (
			<div>
				{Comment}
				<form style={ stylesForm }>
					<t.form.Form
						ref="form"
						type={transformedJson.type}
						options={transformedJson.options}
						value={transformedJson.value}
						onChange={this.onChange}
						onBlur={this.onChange}
					/>
				</form>
			</div>
		);
	}

});

export default TCombForm;
