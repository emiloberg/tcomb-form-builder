import React from 'react';
import t from 'tcomb-form/lib';
import templates from 'tcomb-form-templates-bootstrap';
import transform from 'tcomb-json-schema';

const TCombForm = React.createClass({ //eslint-disable-line react/no-multi-comp
	propTypes: {
		formDef: React.PropTypes.object,
		onChange: React.PropTypes.func
	},

	onChange(changeValue, path) {
		if (this.props.onChange) {
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

		t.form.Form.templates = templates;
		t.form.Form.i18n = {
			down: 'Down',
			up: 'Up',
			add: 'Add',
			remove: 'Remove',
			optional: '',
			required: ' *'
		};

		return (
			<div>
				{Comment}
				<form>
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
