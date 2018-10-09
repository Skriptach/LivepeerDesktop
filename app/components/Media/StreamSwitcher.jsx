import React from 'react'
import { observer, inject } from 'mobx-react';

@inject('video')
@inject('media')
@observer
export default class StreamSwitcher extends React.Component {
	constructor(props) {
		super(props);

		this.props.media.on('stream', this.successCallback.bind(this));
	}

	successCallback = (stream) => {
		const self = this;

		const { onError } = this.props.video;
		const mediaStreamTrack = stream.getVideoTracks()[0];
		if (typeof mediaStreamTrack !== 'undefined') {
			mediaStreamTrack.onended = () => { // for Chrome.
				// busy camera
				self.props.video.toggleCamera(false);
				onError({ error: 5 })
			}

		}
	}

	render() {
		const { broadcasting } = this.props.video;

		this.props.media.blend.setLogoState(!!broadcasting);

		return (null);
	}
}
