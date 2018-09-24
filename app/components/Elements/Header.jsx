import React from 'react'
import { ipcRenderer } from 'electron';
import { observer, inject } from 'mobx-react';
import arrowRight from '../../static/arrowRight.svg';
import close from '../../static/traffic-light-close.svg';
import minimize from '../../static/traffic-light-minimize.svg';

@inject('video') @observer
class Header extends React.Component {

	back = () => {
		this.props.video.playing = 0;
	}

	closeWindow = (event) => {
		ipcRenderer.send('close');
	}

	minimizeWindow = () => {
		ipcRenderer.send('minimize');
	}

	render() {
		return (
			<header className="window-header">
				<ul>
					<li className="switch__controls">
						<button
							onClick={() => this.back()}
							className="switch__controls-back"
						>
							<i dangerouslySetInnerHTML={{ __html: arrowRight }} />
						</button>
					</li>
					<li className="window__controls">
						<a
							onClick={() => this.minimizeWindow()}
							className="window__controls-minimize"
							dangerouslySetInnerHTML={{ __html: minimize }}
						/>
						<a
							onClick={(event) => this.closeWindow(event)}
							className="window__controls-close"
							dangerouslySetInnerHTML={{ __html: close }}
						/>
					</li>
					<li className="window__title" />
				</ul>
			</header>
		);
	}
}

export default Header
