import React from 'react';
import syntaxHighlight from '../helpers/syntaxHighlight';

const Json = ({ formDef }) => {
	function createMarkup() { return { __html: syntaxHighlight(JSON.stringify(formDef, null, '  ')) }; }
	return (
		<pre dangerouslySetInnerHTML={ createMarkup() } />
	);
};

export default Json;
