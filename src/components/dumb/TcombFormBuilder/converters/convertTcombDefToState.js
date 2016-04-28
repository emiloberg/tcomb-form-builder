import uuid from 'uuid';
import objectPath from 'object-path';

export default function convertTcombDefToState(tcombDef) {
	const defs = {};
	const order = {};

	function walk({
		schema,
		ownerId,
		propName,
		show = true,
		optionsPath = [],
		valuePath = [],
		isRoot = false
	}) {
		const id = isRoot ? 'root' : uuid.v4();

		const options = { ...objectPath.get(tcombDef.options, optionsPath, {}) };
		delete options.fields;
		delete options.order;

		let value = isRoot
			? undefined
			: objectPath.get(tcombDef.value, valuePath, undefined);

		if (typeof value === 'object') {
			value = undefined;
		}

		const cloneObject = {
			show,
			name: propName,
			schema: { ...schema },
			options
		};

		if (value) {
			cloneObject.value = value;
		}

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

			/**
			 * If the current object has an order array specifying which
			 * fields should be shown (and in what order) then first iterate over them
			 * and add `show: true`. Then iterate over *all* properties in the schema
			 * and if we find fields there which are not in the order array then add them
			 * to the list of all children but with `show: false`.
			 *
			 * If the current object does not have an order array, then all should be
			 * shown in the order of the properties.
			 */
			const childKeysSchema = Object.keys(schema.properties);
			const orderPath = optionsPath.slice(0);
			orderPath.push('order');
			const childKeysOrder = objectPath.get(tcombDef.options, orderPath);

			let childKeys;
			if (childKeysOrder) {
				const newOrder = childKeysOrder.map(key => ({ key, show: true }));
				childKeysSchema.forEach(key => {
					if (!(newOrder.findIndex(cur => cur.key === key) > -1)) {
						newOrder.push({
							key,
							show: false
						});
					}
				});
				childKeys = newOrder;
			} else {
				childKeys = childKeysSchema.map(key => ({ key, show: true }));
			}

			/**
			 * Recurse
			 */
			childKeys.forEach(({ key, show: curShow }) => {
				const newOptionsPath = optionsPath.slice(0);
				newOptionsPath.push('fields', key);
				const newValuePath = valuePath.slice(0);
				newValuePath.push(key);
				walk({
					schema: schema.properties[key],
					ownerId: id,
					propName: key,
					optionsPath: newOptionsPath,
					valuePath: newValuePath,
					show: curShow
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
