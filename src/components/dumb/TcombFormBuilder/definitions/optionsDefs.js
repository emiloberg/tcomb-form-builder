const optionsDefs = {
	string: {
		schema:  {
			properties: {
				type:     { type: 'string' },
				name:     { type: 'string' },
				label:    { type: 'string' },
				hide:     { type: 'boolean' },
				pattern:  { type: 'string' },
				disabled: { type: 'boolean' },
				defaultValue: { type: 'string' },
				required: { type: 'boolean' },
				enum: {
					type: 'array',
					items: {
						type: 'string'
					}
				},
				factory: {
					type: 'string',
					enum: [
						'Radio'
					]
				},
				disableNullOption: { type: 'boolean' },
				nullOptionValue: { type: 'string' },
				nullOptionText: { type: 'string' }
			},
			type: 'object'
		},
		options: {
			fields: {
				type: { disabled: true },
				factory: {
					nullOption: {
						value: '',
						text: 'Default'
					},
					options: [
						{
							text: 'Radio',
							value: 'Radio'
						}
					]
				}
			}
		}
	},
	number: {
		schema:  {
			properties: {
				type:     { type: 'number' },
				name:     { type: 'string' },
				label:    { type: 'string' },
				hide:     { type: 'boolean' },
				pattern:  { type: 'string' },
				defaultValue: { type: 'string' },
				disabled: { type: 'boolean' },
				required: { type: 'boolean' },
				enum: {
					type: 'array',
					items: {
						type: 'number'
					}
				},
				factory: {
					type: 'string',
					enum: [
						'Radio'
					]
				},
				disableNullOption: { type: 'boolean' },
				nullOptionValue: { type: 'string' },
				nullOptionText: { type: 'string' }
			},
			type: 'object'
		},
		options: {
			fields: {
				type: { disabled: true },
				factory: {
					nullOption: {
						value: '',
						text: 'Default'
					},
					options: [
						{
							text: 'Radio',
							value: 'Radio'
						}
					]
				}
			}
		}
	},
	boolean: {
		schema:  {
			properties: {
				type:     { type: 'string' },
				name:     { type: 'string' },
				label:    { type: 'string' },
				hide:     { type: 'boolean' },
				pattern:  { type: 'string' },
				defaultValue: { type: 'boolean' },
				disabled: { type: 'boolean' },
				required: { type: 'boolean' }
			},
			type: 'object'
		},
		options: {
			fields: {
				type: { disabled: true }
			}
		}
	},
	object: {
		schema:  {
			properties: {
				type:     { type: 'string' },
				name:     { type: 'string' },
				label:    { type: 'string' },
				hide:     { type: 'boolean' },
				disabled: { type: 'boolean' }
			},
			type: 'object'
		},
		options: {
			fields: {
				type: { disabled: true }
			}
		}
	},
	crossReference: {
		disableNullOption: 'disableNullOption',
		factory: 'options.factory',
		nullOptionValue: 'options.nullOption.value',
		nullOptionText: 'options.nullOption.text',
		enum: 'schema.enum',
		type: 'schema.type',
		pattern: 'schema.pattern',
		label: 'options.label',
		disabled: 'options.disabled',
		defaultValue: 'value',
		required: 'required'
	}
};

export default optionsDefs;
