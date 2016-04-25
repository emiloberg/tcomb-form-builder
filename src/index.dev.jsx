import 'babel-polyfill';
import React from 'react';
import App from 'components/dumb/App/App';

const Index = () => {
	return (<App />);
};

export default Index;

/**
 * Immutable.js Custom Google Chrome Formatter
 *
 * Available in Chrome 47 and higher.
 * Go to Settings ("three dots" icon in the upper right corner of DevTools > Menu > Settings F1 > General > Console)
 * Open DevTools
 * Check-in "Enable custom formatters"
 * Close DevTools
 * Open DevTools
 */
const immutableJSFormatter = {
	header(x) {
		if (x && x.toJS) return ['span', {}, x.toString()];
		return null;
	},
	hasBody(x) {
		return x && x.toJS;
	},
	body(x) {
		return ['span', {}, JSON.stringify(x.toJS(), null, 2)];
	}
};
window.devtoolsFormatters = window.devtoolsFormatters || [];
window.devtoolsFormatters.push(immutableJSFormatter);
