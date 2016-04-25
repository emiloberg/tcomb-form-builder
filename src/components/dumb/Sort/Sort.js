/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */

import random from 'lodash/random';
import React from 'react';
import Sortable from 'react-sortablejs';
import classnames from 'classnames';

import styles from './Sort.scss';

const allData = {
	100: {
		text: 'Apple'
	},
	200: {
		text: 'Lemon'
	},
	300: {
		text: 'Pear'
	}
};

class App extends React.Component {
	state = {
		sourceList: [100, 200, 300],
		targetList: []
	};

	render() {
		const SourceList = this.state.sourceList.map((itemId, key) => (
			<div
				key={key}
				data-id={itemId}
				className={ classnames(styles.item, styles.source) }
			>
				Source { allData[itemId].text }
			</div>
		));
		const TargetList = this.state.targetList.map((itemId, key) => {
			return (
				<div
					key={key}
					data-id={itemId}
					className={ classnames(styles.item, styles.target) }
				>
					Target { allData[itemId].text }

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
										this.setState({ targetList: items });
										console.log('this.state.targetList', this.state.targetList);
									}}
							tag="div"
						>
							{TargetList}
						</Sortable>
					</div>

				</div>
			);
		});

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
								onChange={(items, sortable) => {
									console.log('sortable', sortable);
                                    this.setState({ sourceList: items });
                                }}
								tag="div"
							>
								{SourceList}
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
                                    this.setState({ targetList: items });
                                    console.log('this.state.targetList', this.state.targetList);
                                }}
								tag="div"
							>
								{TargetList}
							</Sortable>
						</div>

					</div>
				</div>
			</div>
		);
	}
}


export default App;
