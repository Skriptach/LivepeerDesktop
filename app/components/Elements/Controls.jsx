import React from 'react';
import { observer, inject } from 'mobx-react';
/* WTF? if immported via '../ it fail on prod env*/
import Toggler from '../Actions/Toggler';
import ControlsBroadcast from '../Media/ControlsBroadcast';
import ControlsPlayer from '../Media/ControlsPlayer';
import ControlsConfig from '../Media/ControlsConfig';


@inject('video')
@observer
class Controls extends React.Component {
	render() {
		const { broadcasting, playing, config } = this.props.video;

		return (
			<div className="controls-container">
				<Toggler />
				{broadcasting !== 0 && <ControlsBroadcast />}
				{playing !== 0 && <ControlsPlayer />}
				{config !== 0 && <ControlsConfig />}
			</div>
		);
	}
}

export default Controls;
