export default function convertSingleStateToTcomb(state) {
	const out = {
		schema: {
			properties: {
				[state.name]: {
					...state.schema
				}
			},
			type: 'object'
		},
		options: {
			fields: {
				[state.name]: {
					...state.options
				}
			}
		},
		value: {}
	};

	if (state.required) {
		out.schema.required = [state.name];
	}

	if (state.value) {
		out.value[state.name] = state.value;
	}

	return out;
}
