import random from 'lodash/random';
import React from 'react';
import Sortable from 'react-sortablejs';
import classnames from 'classnames';

import styles from './Sort.scss';

class App extends React.Component {
	state = {
		cloneControlledSource: ['Apple', 'Banana', 'Cherry'],
		cloneControlledTarget: []
	};

	render() {
		const cloneControlledSource = this.state.cloneControlledSource.map((val, key) => (
			<div
				key={key}
				data-id={val}
				className={ classnames(styles.item, styles.source) }
			>
				Source {val}
			</div>
		));
		const cloneControlledTarget = this.state.cloneControlledTarget.map((val, key) => (
			<div
				key={key}
				data-id={val}
				className={ classnames(styles.item, styles.target) }
			>
				{val}
			</div>
		));

		return (
			<div>
				<div>
					<div>
						<div className={ styles.cont }>
							<Sortable
								options={{
                                    sort: false,
                                    group: {
                                        name: 'clone2',
                                        pull: 'clone',
                                        put: false
                                    }
                                }}
								onChange={(items) => {
                                    this.setState({ cloneControlledSource: items });
                                }}
								tag="div"
							>
								{cloneControlledSource}
							</Sortable>
						</div>
						<div className={ styles.cont }>
							<Sortable
								options={{
                                    group: {
                                        name: 'clone2',
                                        pull: false,
                                        put: true
                                    }
                                }}
								className={ styles.list }
								onChange={(items) => {
                                    this.setState({ cloneControlledTarget: items });
                                    console.log('this.state.cloneControlledTarget', this.state.cloneControlledTarget);
                                }}
								tag="div"
							>
								{cloneControlledTarget}
							</Sortable>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
