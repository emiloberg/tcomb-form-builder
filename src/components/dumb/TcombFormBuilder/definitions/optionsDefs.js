const optionsDefs = {
	string: {
		schema:  {
			properties: {
				type:     {
					enum: [
						'string',
						'number',
						'boolean'
					],
					type: 'string'
				},
				name:     {
					type: 'string'
				},
				label:    {
					type: 'string'
				},
				hide:     {
					type: 'boolean'
				},
				pattern:  {
					type: 'string'
				},
				disabled: {
					type: 'boolean'
				},
				defaultValue: {
					type: 'string'
				},
				required: {
					type: 'boolean'
				}
			},
			type: 'object'
		},
		options: {
			fields: {
				type: {
					nullOption: false
				}
			}
		}
	},
	number: {
		schema:  {
			properties: {
				type:     {
					enum: [
						'string',
						'number',
						'boolean'
					],
					type: 'string'
				},
				name:     {
					type: 'string'
				},
				label:    {
					type: 'string'
				},
				hide:     {
					type: 'boolean'
				},
				pattern:  {
					type: 'string'
				},
				defaultValue: {
					type: 'string'
				},
				disabled: {
					type: 'boolean'
				},
				required: {
					type: 'boolean'
				}
			},
			type: 'object'
		},
		options: {
			fields: {
				type: {
					nullOption: false
				}
			}
		}
	},
	boolean: {
		schema:  {
			properties: {
				type:     {
					enum: [
						'string',
						'number',
						'boolean'
					],
					type: 'string'
				},
				name:     {
					type: 'string'
				},
				label:    {
					type: 'string'
				},
				hide:     {
					type: 'boolean'
				},
				pattern:  {
					type: 'string'
				},
				defaultValue: {
					type: 'boolean'
				},
				disabled: {
					type: 'boolean'
				},
				required: {
					type: 'boolean'
				}
			},
			type: 'object'
		},
		options: {
			fields: {
				type: {
					nullOption: false
				}
			}
		}
	},
	object: {
		schema:  {
			properties: {
				type:     {
					enum: [
						'object'
					],
					type: 'string'
				},
				name:     {
					type: 'string'
				},
				label:    {
					type: 'string'
				},
				hide:     {
					type: 'boolean'
				},
				disabled: {
					type: 'boolean'
				}
			},
			type: 'object'
		},
		options: {
			fields: {
				type: {
					disabled: true
				}
			}
		}
	},
	crossReference: {
		type: 'schema.type',
		pattern: 'schema.pattern',
		label: 'options.label',
		disabled: 'options.disabled',
		defaultValue: 'value',
		required: 'required'
	}
};

export default optionsDefs;
