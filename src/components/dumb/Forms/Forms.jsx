import React from 'react';

import TCombForm from 'components/dumb/TCombForm/TCombForm';
import fullFormDef from './sampleFormDef.js';

const Forms = () => {
	const formsDefs = Object.keys(fullFormDef.schema.properties).map((key, index) => {
		const out = {
			id: index + 1,
			def: {
				schema:  {
					properties: {
						[key]: fullFormDef.schema.properties[key]
					},
					type: 'object'
				},
				options: {
					fields: {}
				},
				value:   {}
			}
		};

		if (fullFormDef.options.fields.hasOwnProperty(key)) {
			out.def.options.fields[key] = fullFormDef.options.fields[key];
		}

		if (fullFormDef.value.hasOwnProperty(key)) {
			out.def.value[key] = fullFormDef.value[key];
		}

		return out;
	});

	return (
		<div>
			{formsDefs.map(def => {
				return (
					<TCombForm
						formDef={ def.def }
					/>
				);
			})}
		</div>
	);
};



export default Forms;
