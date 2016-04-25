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
        },
        required: [],
        type: 'object'
    },
    options: {
        disabled: false,
        fields: {
            Name1: {
                label: 'Contact Name'
            }
        }
    },
    value: {
        Name1: 'Some sample text123'
    }
};

export default formDef;
