import React from 'react';
import classnames from 'classnames';

import styles from './HeaderBar.scss';

const Button = ({ onClick, currentMode, mode, children, disablePreview }) => ( //eslint-disable-line react/no-multi-comp
	<button
		className={
			classnames({
				[styles.headerButton]: true,
				[styles.headerButtonActive]: currentMode === mode
			})
		}
		onClick={ onClick }
		disabled={ disablePreview }
	>
		{children}
	</button>
);

const HeaderBar = ({ currentMode, setModeEdit, setModeJson, setModeForm, setModeState, disablePreview, selectRoot }) => ( //eslint-disable-line react/no-multi-comp
	<div className={ styles.headerBar }>
		<div className={ styles.headerButtonGroup }>
			<Button onClick={ setModeEdit } currentMode={ currentMode } mode="edit">Edit</Button>
			<Button onClick={ setModeJson } currentMode={ currentMode } mode="json">JSON</Button>
			<Button onClick={ setModeState } currentMode={ currentMode } mode="state">State</Button>
			<Button onClick={ setModeForm } currentMode={ currentMode } mode="form" disablePreview={ disablePreview }>Preview</Button>
		</div>
	</div>
);

export default HeaderBar;
