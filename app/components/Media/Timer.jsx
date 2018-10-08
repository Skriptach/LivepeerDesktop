import React from 'react'
import { observer, inject } from 'mobx-react';
import camera from '../../static/camera.svg';

@inject('video')
@observer
class Timer extends React.Component {

	render() {
		const { timer } = this.props.video;
		return (
			<li className="control-action">
				<div className="control-action-item__timer-label">
					<i className="control-action-item__timer-icon" dangerouslySetInnerHTML={{ __html: camera }} />
					<span>LIVE</span>
				</div>
				<strong className="control-action-item__timer-time">{ timer || '00:00' }</strong>
			</li>);
	}
}


export default Timer
