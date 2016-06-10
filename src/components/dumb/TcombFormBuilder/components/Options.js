/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */

import React from 'react';
//import styles from './TcombFormBuilder.scss';
//import classnames from 'classnames';

import TCombForm from './TCombForm';
import objectPath from 'object-path';

function transformStateToOptionsDef({ itemDef, optionsDef }) {
	const out = { ...optionsDef[itemDef.schema.type] };
	Object.keys(optionsDef.crossReference).forEach(key => {
		const val = objectPath.get(itemDef, optionsDef.crossReference[key]);
		objectPath.set(out, ['value', key], val);
	});
	out.value.name = itemDef.name;
	out.value.hide = !itemDef.show;

	return out;
}

function transformOptionsDefToState({ formValues, crossReference }) {
	const out = {
		schema: {
			type: 'object'
		},
		options: {}
	};
	Object.keys(crossReference).forEach(key => {
		if (formValues[key] === null) {
			objectPath.del(out, crossReference[key]);
		} else {
			objectPath.set(out, crossReference[key], formValues[key]);
		}
	});
	out.name = formValues.name;
	out.show = !formValues.hide;


	/**
	 * Setting nullOptions to false if asked for
	 */
	// TODO: We might need to add this to the full render mode as well
	if (out.disableNullOption) {
		out.options.nullOption = false;
	}

	return out;
}

const Options = ({ defs, selected, onChange, optionsDefs }) => {
	if (!selected) { return <span />; } // Change this to return null when available

	const thisDef = transformStateToOptionsDef({
		itemDef: defs[selected],
		optionsDef: optionsDefs,
	});

	function onChangeForm(formValues) {
		const def = transformOptionsDefToState({
			formValues,
			crossReference: optionsDefs.crossReference
		});

		onChange({
			def,
			id: selected
		});
	}

	return (
		<div>
			<TCombForm
				formDef={ thisDef }
				onChange={ onChangeForm }
			/>
		</div>
	);
};

export default Options;
