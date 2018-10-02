import React from 'react'
import { observer, inject } from 'mobx-react';
import { Modal } from '../';

@inject('media')
@observer
class ControlsConfig extends React.Component {
	constructor(props) {
		super(props);
		this.props.media.currentLogo.width = 64;
		this.props.media.currentLogo.height = 64;
		this.state = {
			src: this.props.media.currentLogo.toDataURL()
		}
	}

	preview (event) {
		const _self = this;
		const reader = new FileReader();
		reader.onload = (e) => {
			_self.setState({
				src: e.target.result
			});
		}
		reader.readAsDataURL(imageLogo.files[0]);
	}

	apply () {
		this.props.media.apply({
			logo: previewLogo,
			videoId: videoSource.value,
			audioId: audioSource.value,
			res: +videoResolution.value
		});
	}

	close () {
		this.setState({
			src: this.props.media.currentLogo.toDataURL()
		});
		this.props.media.toggleConfig();
	}

	render() {
		function mediaSourceOption (source) {
			return (<option
				key={source.deviceId}
				value={source.deviceId}
			>{source.label}</option>);
		}
		return (
			<div className="control-container">
				
				<Modal title="Air Options"
					show={this.props.media.config}
					panel
					onClose={() => this.close()}
				>
					<div className="fieldset">
						<div className="legend">
							<b>Video Source</b>
							<select id="videoSource" defaultValue={this.props.media.videoId}>
								{this.props.media.list.video.map(mediaSourceOption)}
							</select>
						</div>
						<div className="legend">
							<b>Audio Source</b>
							<select id="audioSource" defaultValue={this.props.media.audioId}>
								{this.props.media.list.mic.map(mediaSourceOption)}
							</select>
						</div>
						<div className="legend">
							<b>Video Resolution</b>
							<select id="videoResolution" defaultValue={this.props.media.resolution}>
								{this.props.media.list.resolution.map((res, i) => <option
									key={res.width}
									value={res.width}
								>{res.label}</option>)}
							</select>
						</div>
						<div className="legend">
							<label htmlFor="imageLogo"><b>Image Logo</b></label>
							<input id="imageLogo" type="file" accept="image/*"
								onChange={() => this.preview()}
							/>
							<img id="previewLogo" height="64"
								src={this.state.src}
								onClick={() => imageLogo.click()}
							/>
						</div>
					</div>
					<div className="action">
						<button
							onClick={() => this.apply()}
						>Apply</button>
					</div>
				</Modal>
			</div>

		);
	}
}


export default ControlsConfig
