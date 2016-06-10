const widgetDefs = {
	'WidgetString': {
		label: 'String',
		schema: { type: 'string' },
		options: {
			label: 'New string'
		}
	},
	'WidgetObject': {
		label: 'Object',
		schema: { type: 'object' },
		options: {
			label: 'New object'
		}
	},
	'WidgetNumber': {
		label: 'Number',
		schema: { type: 'number' },
		options: {
			label: 'New number'
		}
	},
	'Boolean': {
		label: 'Boolean',
		schema: { type: 'boolean' },
		options: {
			label: 'New boolean'
		}
	},
	'Enum': {
		label: 'Enum',
		schema: {
			type: 'string',
			enum: ['a', 'b', 'c']
		},
		options: {
			label: 'New enum'
		}
	}
};

export default widgetDefs;
