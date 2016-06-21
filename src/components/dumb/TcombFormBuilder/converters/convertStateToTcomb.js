import objectPath from 'object-path';

export default function convertStateToTcomb({ order, defs }) {
	const out = {};

	walk();

	return out;

	function walk({ path, itemId } = { path: [], itemId: 'root' }) {
		/**
		 * Options
		 */
		const optionsPath = path
			.map(i => ['fields', i])
			.reduce((a, b) => a.concat(b), []);
		const curOptions = { ...defs[itemId].options };
		objectPath.set(out, ['options', ...optionsPath], curOptions);

		/**
		 * Options depending on childs
		 */
		const childIds = order[itemId] || [];
		const hasChilds = childIds.length > 0;
		if (hasChilds) {
			// Set order
			// Exclude hidden fields from order
			const curOrder = childIds.map(curItemId => {
				if (defs[curItemId].show) {
					return defs[curItemId].name;
				}
				return null;
			})
			.filter(cur => cur !== null);
			objectPath.set(out, ['options', ...optionsPath, 'order'], curOrder);

			// Set required
			const curRequired = childIds.map(curItemId => {
					return {
						required: defs[curItemId].required,
						name: defs[curItemId].name
					};
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
				path: [...path, defs[curItemId].name],
				itemId: curItemId
			});
		});
	}
}
