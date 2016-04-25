import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import fullFormDef from './../Forms/sampleFormDef.js';

function mangleFormDef(fullFormDef) {
	return Object.keys(fullFormDef.schema.properties).map((key, index) => {
		const out = {
			id:  index + 1,
			def: {
				schema:  {
					properties: {
						[key]: fullFormDef.schema.properties[key]
					},
					type:       'object'
				},
				options: {
					fields: {}
				},
				value:   {}
			}
		};

		// Copy options
		if (fullFormDef.options.fields.hasOwnProperty(key)) {
			out.def.options.fields[key] = fullFormDef.options.fields[key];
		}

		// Copy value
		if (fullFormDef.value.hasOwnProperty(key)) {
			out.def.value[key] = fullFormDef.value[key];
		}

		return out;
	});
}

@DragDropContext(HTML5Backend) //eslint-disable-line new-cap
export default class Container extends Component {
	constructor(props) {
		super(props);
		this.moveCard = this.moveCard.bind(this);
		this.state = Object.assign({}, {
			cards: mangleFormDef(this.props.initialFormDef)
		});
	}

	moveCard(dragIndex, hoverIndex) {
		console.log('dragIndex', dragIndex);
		console.log('hoverIndex', hoverIndex);

		const { cards } = this.state;
		const dragCard = cards[dragIndex];

		this.setState(update(this.state, {
			cards: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}));
	}

	render() {
		const { cards } = this.state;

		return (
			<div>
				{cards.map((card, i) => {
					return (
						<Card key={card.id}
							index={i}
							id={card.id}
							moveCard={this.moveCard}
							formDef={ card.def }
						/>
					);
				})}
				<Card key={5}
					  index={5}
					  id={5}
					  moveCard={this.moveCard}
					  formDef={ cards[0].def }
				/>
			</div>
		);
	}
}
