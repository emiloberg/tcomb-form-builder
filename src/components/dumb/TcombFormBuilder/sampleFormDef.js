const formDef = {
    schema: {
        properties: {
            Name1: {
                type: 'string'
            },
			Name2: {
				type: 'string'
			},
			Name3: {
				type: 'number'
			},
			anObject: {
				properties: {
					aBool: {
						type: 'boolean'
					},
					aSecondBool: {
						type: 'boolean'
					}
				},
				required: [
					'objectBoolean'
				],
				type: 'object'
			},
        },
        required: [],
        type: 'object'
    },
    options: {
        disabled: false,
        fields: {
            Name1: {
                label: 'Contact Name'
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
				label: 'An Object with Two fields'
			}
        }
    },
    value: {
        Name1: 'Some sample text123'
    }
};

export default formDef;
