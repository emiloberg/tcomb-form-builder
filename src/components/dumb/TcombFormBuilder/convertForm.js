import uuid from 'uuid';

export function convertTcombDefToState(tcombDef) {
	const defs = {};
	const order = {};

	function walk({ schema, ownerId, propName, isRoot = false }) {
		const id = isRoot ? 'root' : uuid.v4();
		const cloneObject = {
			schema: Object.assign({}, schema),
			xPropName: propName
		};

		if (!isRoot) {
			if (!order[ownerId]) {
				order[ownerId] = [];
			}
		}

		if (schema.type === 'object') {
			delete cloneObject.schema.properties;
			defs[id] = cloneObject;

			if (!isRoot) {
				order[ownerId].push(id);
			}

			Object.keys(schema.properties).forEach(childKey => {
				walk({
					schema: schema.properties[childKey],
					ownerId: id,
					propName: childKey
				});
			});
		} else {
			defs[id] = cloneObject;
			order[ownerId].push(id);
		}
	}

	walk({
		schema: tcombDef.schema,
		propName: 'Root',
		isRoot: true
	});

	return {
		defs,
		order
	};
}
