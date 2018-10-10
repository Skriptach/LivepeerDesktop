import EventEmitter from 'events';
import { observable, action } from 'mobx';
import Blender from './Blender';
import Stream from './Stream';

export default class MediaStore extends EventEmitter {

	@observable currentLogo = document.createElement('canvas');
	@observable config = false;

	@observable videoId = true;
	@observable audioId = true;
	@observable resolution = 1280;
	@observable list = {
		video: [],
		mic: [],
		resolution: [
			{ width: 720, label: '720x480' },
			{ width: 800, label: '800x600' },
			{ width: 1280, label: 'HD 720p' },
			{ width: 1920, label: 'Full HD 1080p' },
			{ width: 3840, label: '4K UHD' },
			{ width: 4096, label: 'DCI 4K' },
			{ width: 7680, label: '8K UHD' }
		]
	};

	constructor () {
		super();

		this.video = document.createElement('video');
		this.blend = new Blender(this.video, this.currentLogo);
		this.streamURL = this.blend.getURL();
		this.wsStream = new Stream(this.blend.stream);
	}

	@action toggleConfig () {
		this.config = !this.config;
		this.config && this.getCams();
	}

	@action apply ({logo, videoId, audioId, res}) {
		if (logo) {
			this.currentLogo.width = logo.width;
			this.currentLogo.height = logo.height;
			const ctx = this.currentLogo.getContext('2d');
			ctx.drawImage(logo, 0, 0, logo.width, logo.height);
			this.currentLogo.onchange();
		}
		if (videoId !== this.videoId || audioId !== this.audioId) {
			this.videoId = videoId;
			this.audioId = audioId;
			this.resolution = res;
			this.play();
		} else if (res !== this.resolution) {
			this.resolution = res;
			const mediaStreamTrack = this.video.srcObject.getVideoTracks()[0];
			mediaStreamTrack.applyConstraints({
				width: {min: this.resolution, ideal: this.resolution }
			}).then((res) => {
				this.video.onchange()
			}).catch(console.error)
		}
	}

	successCallback (stream) {
		this.video.srcObject = stream;
		this.video.onchange();

		this.emit('stream', stream);
	}

	errorCallback (err) {
		console.error('Rejected', err);
	}

	@action play () {
		const self = this;

		this.stop();
		self.getStream()
			.then(self.successCallback.bind(self))
			.catch(self.errorCallback.bind(self));
	}

	getCams () {
		function equal(source) {
			return source.deviceId === this;
		}

		return navigator.mediaDevices.enumerateDevices().then((sourceInfos) => {
			this.list.video = [];
			this.list.mic = [];

			sourceInfos.forEach(source => {
				if (source.kind === 'videoinput') {
					this.list.video.push(source);
				} else if (source.kind === 'audioinput') {
					this.list.mic.push(source);
				}
			});

			if (!this.list.video.some(equal, this.videoId) && this.list.video.length) {
				this.videoId = this.list.video[0].deviceId;
			}

			if (!this.list.mic.some(equal, this.audioId) && this.list.mic.length) {
				this.audioId = this.list.mic[0].deviceId;
			}

			return this.list;
		})
	}

	stop () {
		this.video.srcObject && this.video.srcObject.getTracks().forEach(track => track.stop());
	}

	getStream (videoId, audioId, resolution) {
		this.audioId = audioId || this.audioId;
		this.videoId = videoId || this.videoId;
		this.resolution = resolution || this.resolution;

		const constraints = {
			audio: {deviceId: {exact: this.audioId}},
			video: {
				deviceId: {exact: this.videoId},
				width: {min: this.resolution }
			}
		}
		return navigator.mediaDevices.getUserMedia(constraints);
	}

	setAirState (state) {
		this.blend.setLogoState(state);
		this.wsStream.setStreamState(state);
	}

}