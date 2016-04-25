import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';

import App from 'components/dumb/App/App';
import configureStore from 'store/configureStore.prod';
const store = configureStore();

const Index = () => {
	return (
		<Provider store={store} >
			<div>
				<App />
			</div>
		</Provider>

	);
};

export default Index;
