function removeStateOrphans({ defs, order }) {
	const fixedDefs = { ...defs };
	const fixedOrder = { ...order };

	const listOfAllCurrentIds = getListOfAllIds({ order: fixedOrder });

	// Clean Defs
	Object.keys(fixedDefs).forEach(key => {
		if (listOfAllCurrentIds.indexOf(key) === -1) {
			delete fixedDefs[key];
		}
	});

	// Clean order
	Object.keys(fixedOrder).forEach(key => {
		if (listOfAllCurrentIds.indexOf(key) === -1) {
			delete fixedOrder[key];
		}
	});

	return {
		defs: fixedDefs,
		order: fixedOrder
	};
}

/**
 * Traverses the 'order' from 'root' and returns a list of all field id:s
 * which are currently used. Does *not* return orphans (id:s in the
 * order which can not be reached from 'root')
 * Yes, it's a ugly function.
 * @param order
 * @returns {*}
 */
function getListOfAllIds({ order }) {
	function walk({ nextId }) {
		if (!order[nextId]) {
			return nextId;
		}

		return order[nextId].map((id) => {
			return [nextId, walk({ nextId: id })];
		});
	}

	function flattenArray(list) {
		return list.reduce(
			(a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []
		);
	}

	return flattenArray(walk({ nextId: 'root' }))
		.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
}

export default removeStateOrphans;
