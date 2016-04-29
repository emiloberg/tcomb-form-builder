/* eslint-disable */

console.log('apa');

import objectPath from 'object-path';


//
// TEMP STUFF
//
const formDef = {
	schema: {
		properties: {
			aTextbox: {
				type: 'string'
			},
			anObject: {
				properties: {
					aBool: {
						type: 'boolean'
					},
					aString: {
						type: 'string'
					}
				},
				required: ['aBool'],
				type: 'object'
			}
		},
		required: [],
		type: 'object'
	},
	options: {
		order: ['aTextbox', 'anObject'],
		disabled: false,
		help: 'This is my help text<br>Apa boll',
		fields: {
			aTextbox: {
			},
			anObject: {
				fields: {
					aBool: {
						label: 'My boolean'
					},
					aString: {
						label: 'My string'
					}
				},
				label: 'An Object with Two fields',
				order: ['aString', 'aBool']
			}
		}
	},
	value: {
		aTextbox: true,
		anObject: {
			aString: 'My default value',
			aBool: true
		}
	}
};


/* eslint-disable quotes */
const state = {
	"order": {
		"root": [
			"56aabde2-0cc9-4522-ac9f-02db2e371edd",
			"368ec15b-9b44-4c23-adc5-d7f45acdf3e5"
		],
			"368ec15b-9b44-4c23-adc5-d7f45acdf3e5": [
			"9faa9e85-618d-4ab9-8956-82eafd5eb385",
			"6fac5df6-d71b-425b-962f-74ac3208c384"
		]
	},
	"defs": {
		"root": {
			"show": true,
			"name": "Root",
			"schema": {
				"required": [],
				"type": "object"
			},
			"options": {
					"disabled": false,
					"help": "This is my help text<br>Apa boll"
				}
			},
		"56aabde2-0cc9-4522-ac9f-02db2e371edd": {
			"show": true,
			"name": "aTextbox",
			"schema": {
				"type": "string"
			},
			"options": {},
			"value": true,
			"required": true
		},
		"368ec15b-9b44-4c23-adc5-d7f45acdf3e5": {
			"show": true,
				"name": "anObject",
				"schema": {
				"required": [
					"aBool"
				],
					"type": "object"
			},
			"options": {
				"label": "An Object with Two fields"
			}
		},
		"9faa9e85-618d-4ab9-8956-82eafd5eb385": {
			"show": true,
				"name": "aString",
				"schema": {
				"type": "string"
			},
			"options": {
				"label": "My string"
			},
			"value": "My default value",
			"required": true
		},
		"6fac5df6-d71b-425b-962f-74ac3208c384": {
			"show": true,
				"name": "aBool",
				"schema": {
				"type": "boolean"
			},
			"options": {
				"label": "My boolean"
			},
			"value": true
		}
	}
};
/* eslint-enable quotes */




const out = {};

walk({
	defs: state.defs,
	order: state.order,
	itemId: 'root'
});

function walk({ defs, order, type, path = [], itemId }) {
	const curType = defs[itemId].schema.type;

	/**
	 * Options
	 */
	const optionsPath = path
		.map(i => ['fields', i])
		.reduce((a, b) => a.concat(b), []);
	const curOptions = {...defs[itemId].options };
	objectPath.set(out, ['options', ...optionsPath], curOptions);

	/**
	 * Options depending on childs
	 * @type {*|Array}
	 */
	const childIds = order[itemId] || [];
	const hasChilds = childIds.length > 0;
	if (hasChilds) {
		// Set order
		const curOrder = childIds.map(curItemId => defs[curItemId].name);
		objectPath.set(out, ['options', ...optionsPath, 'order'], curOrder);

		// Set required
		const curRequired = childIds.map(curItemId => {
			return {
				required: defs[curItemId].required,
				name: defs[curItemId].name
			}
		})
		.filter(item => item.required)
		.map(item => item.name);
		if (curRequired.length > 0) {
			objectPath.set(out, ['options', ...optionsPath, 'required'], curRequired);
		}
	}

	/**
	 * Schema
	 */
	const schemaPath = path
		.map(i => ['properties', i])
		.reduce((a, b) => a.concat(b), []);
	const curSchema = { ...defs[itemId].schema };
	delete curSchema.required; // Todo, remove when required works.
	objectPath.set(out, ['schema', ...schemaPath], curSchema);


	/**
	 * Value
	 */
	const curValue = defs[itemId].value;
	if (curValue !== undefined) {
		objectPath.set(out, ['value', ...path], curValue);
	}

	/**
	 * Walk
	 */
	childIds.map(curItemId => {
		walk({
			defs,
			order,
			path: [...path, defs[curItemId].name],
			type: curType,
			itemId: curItemId
		});
	});
}
