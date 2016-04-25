import 'babel-polyfill'; // Needed for PhantomJS

const context = require.context('./src', true, /.*\.spec\.(js|jsx)$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
