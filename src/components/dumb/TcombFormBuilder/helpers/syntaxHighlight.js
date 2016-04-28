import styles from '../components/TcombFormBuilder.scss';

export default function syntaxHighlight(json) {
	const fixedjson = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return fixedjson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
		let cls = styles.syntaxNumber;
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = styles.syntaxKey;
			} else {
				cls = styles.syntaxString;
			}
		} else if (/true|false/.test(match)) {
			cls = styles.syntaxBoolean;
		} else if (/null/.test(match)) {
			cls = styles.syntaxNull;
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});
}
