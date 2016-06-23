export default function convertStateToTcomb({ order, defs }) {
	return {
		schema: {
			...walk({ walkType: 'schema' })
		},
		options: {
			...walk({ walkType: 'options' })
		},
		value: {
			...walkValue({})
		}
	};


	function walk({ id = 'root', walkType }) {
		const out = {
			...defs[id][walkType]
		};

		const propIsArray = defs[id].schema.type === 'array';
		const childIds = order[id];
		const delimiter = walkType === 'schema' //eslint-disable-line no-nested-ternary
			? propIsArray
				? 'items'
				: 'properties'
			: propIsArray
				? 'item'
				: 'fields';

		/**
		 * Add order array to options if it's an object.
		 */
		if (walkType === 'options' && defs[id].schema.type === 'object' && order[id]) {
			out.order = order[id].map(curId => {
				if (!defs[curId].show) {
					return null;
				}
				return defs[curId].name;
			})
			.filter(cur => !!cur);
		}

		/**
		 * Add required array to schema if it's an object.
		 */
		if (walkType === 'schema' && defs[id].schema.type === 'object' && order[id]) {
			out.required = order[id].map(curId => {
				if (!defs[curId].required) {
					return null;
				}
				return defs[curId].name;
			})
			.filter(cur => !!cur);
		}


		/**
		 * Check if it has childs (is an object or an array), or if it's a leaf
		 * (which actually holds the value)
		 */
		if (childIds) {
			/**
			 * Get the childs
			 */
			const childDataArr = childIds.map(curId => {
				return {
					...walk({ id: curId, walkType }),
					xName: defs[curId].name
				};
			});
			const childDataObj = {};
			childDataArr.forEach(cur => {
				childDataObj[cur.xName] = { ...cur };
			});
			Object.keys(childDataObj).forEach(key => {
				delete childDataObj[key].xName;
			});

			if (propIsArray) {
				/**
				 * If the child object is a child to an array, then we need to remove the
				 * field name. As arrays only allow 1 child, then we can easily just grab
				 * the first property in the object.
				 */
				out[delimiter] = childDataObj[Object.keys(childDataObj)[0]];
			} else {
				out[delimiter] = childDataObj;
			}
		}
		return out;
	}


	function walkValue({ id = 'root', walkType }) {
		const propIsArray = defs[id].schema.type === 'array';
		const childIds = order[id];

		/**
		 * Check if it has childs (is an object or an array), or if it's a leaf
		 * (which actually holds the value)
		 */
		if (childIds) {
			/**
			 * Get the childs
			 */
			const childDataArr = childIds.map(curId => {
				const walker = walkValue({ id: curId, walkType });
				if (!walker) { return null; }
				return {
					[defs[curId].name]: walker
				};
			})
			.filter(cur => !!cur);

			/**
			 * If it's an array, return the first value (arrays can
			 * only have 1 value)
			 */
			if (propIsArray) {
				if (!!childDataArr.length) {
					const outer = childDataArr[Object.keys(childDataArr)[0]];
					const inner = outer[Object.keys(outer)[0]];
					return [inner];
				}
				return undefined;
			}

			/**
			 * If it's not an array (therefor an object) return an
			 * object with all values.
			 */
			const out = {};
			childDataArr.forEach(child => {
				Object.keys(child).forEach(key => {
					out[key] = child[key];
				});
			});
			return out;
		}

		/**
		 * If it doesn't have child (and is therefor a leaf),
		 * return the actual default value
		 */
		return defs[id].value;
	}
}
