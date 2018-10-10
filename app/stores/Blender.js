import * as PIXI from 'pixi.js';

export default class Blender {
	
	constructor (video, logoCanvas) {
		const _self = this;
		_self.app = new PIXI.Application({ autoResize: true, backgroundColor:0x000000 });
		this.stream = this.app.view.captureStream();

		const videoTexture = new PIXI.Texture.fromVideo(video);
		const videoSprite = new PIXI.Sprite(videoTexture);

		const base = PIXI.Texture.from(logoCanvas)
		const logo = this.logo = new PIXI.Sprite(base);

		video.onchange = function () {
			const audioTracks = _self.stream.getAudioTracks();
			if (audioTracks.length) {
				_self.stream.removeTrack(audioTracks[0])
			}
			_self.stream.addTrack(video.srcObject.getAudioTracks()[0]);
			
			const mediaStreamTrack = video.srcObject.getVideoTracks()[0];
			const videoSettings = mediaStreamTrack.getSettings();
			_self.app.renderer.resize(videoSettings.width, videoSettings.height);
		}

		logoCanvas.onchange = function (event) {
			base.update();
		}

		logo.x = 10;
		logo.y = 10;
		logo.alpha = 0.5;
		logo.visible = false;

		_self.app.stage.addChild(videoSprite);
		_self.app.stage.addChild(logo);

	}

	getURL () {
		return window.URL.createObjectURL(this.stream);
	}

	setLogoState (state) {
		this.logo.visible = state;
		this.app.renderer.render(this.app.stage);
	}

}
