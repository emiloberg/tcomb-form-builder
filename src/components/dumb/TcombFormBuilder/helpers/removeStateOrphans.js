import clone from 'clone';

function removeStateOrphans({ defs, order }) {
	const listOfValidIds = getListOfAllIds({ order });
	return {
		defs: cleanDefsOrOrder({ listOfValidIds, defsOrOrder: defs }),
		order: cleanDefsOrOrder({ listOfValidIds, defsOrOrder: order })
	};
}

function cleanDefsOrOrder({ listOfValidIds, defsOrOrder }) {
	const fixedDefsOrOrder = clone(defsOrOrder);
	Object.keys(fixedDefsOrOrder).forEach(key => {
		if (listOfValidIds.indexOf(key) === -1) {
			delete fixedDefsOrOrder[key];
		}
	});
	return fixedDefsOrOrder;
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
		if (!order[nextId] || order[nextId].length === 0) {
			return [nextId];
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
