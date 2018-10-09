import React from 'react'
import { observer, inject } from 'mobx-react';
import { Video } from '../';
import { StreamSwitcher } from '../';

const recorderProps = {
	autoplay: true,
	controls: false,
	sources: [{
		src: '',
		type: 'video/mp4'
	}]
};

const playerProps = {
	autoplay: true,
	controls: true,
	sources: [{
		src: '',
		type: 'application/x-mpegURL'
	}]
};

@inject('video')
@inject('media')
@observer
class VideoSwitcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url: '',
			videoJsOptions: {}
		}
	}

	componentDidMount = () => {
		const { playing } = this.props.video;

		/* broadcasting state ?*/
		if (!playing) {
			this.setState({ url: this.props.media.streamURL })
			this.props.media.getCams()
				.then(() => this.props.media.play())
		}
	}

	isPlaying = () => this.props.video.toggleCamera(true)


	render() {
		const { playing } = this.props.video;
		let props;

		if (!this.state.url && !playing) {
			/* url of media not yet ready...*/
			return null;
		}

		if (playing) {
			playerProps.sources[0].src = playing;
			props = playerProps;
		} else {
			recorderProps.sources[0].src = this.state.url;
			recorderProps.onPlaying = this.isPlaying;
			props = recorderProps;
		}

		return (
			<div className="video-wrapper">
				<Video {...props} />
				<StreamSwitcher />
			</div>
		);
	}
}


export default VideoSwitcher
