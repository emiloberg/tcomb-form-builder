import React from 'react';
import TCombForm from './TCombForm';

const FullForm = ({ formDef }) => {
	if (!formDef.schema.hasOwnProperty('properties')) {
		return <div>No form</div>;
	}

	return (
		<TCombForm formDef={ formDef }/>
	);
};

export default FullForm;
