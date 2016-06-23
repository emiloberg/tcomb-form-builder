const widgetDefs = {
	WidgetString: {
		label: 'String',
		schema: { type: 'string' },
		options: {
			label: 'New string'
		}
	},
	WidgetNumber: {
		label: 'Number',
		schema: { type: 'number' },
		options: {
			label: 'New number'
		}
	},
	Boolean: {
		label: 'Boolean',
		schema: { type: 'boolean' },
		options: {
			label: 'New boolean'
		}
	},
	WidgetObject: {
		label: 'Object',
		schema: { type: 'object' },
		options: {
			label: 'New object'
		}
	},
	ArrayObject: {
		label: 'Array',
		schema: { type: 'array' },
		options: {
			label: 'New array'
		}
	}
};

export default widgetDefs;
