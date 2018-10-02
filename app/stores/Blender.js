import * as PIXI from 'pixi.js';

export default class Blender {
	
	constructor (video, logoCanvas) {
		const _self = this;
		_self.app = new PIXI.Application({ autoResize: true, backgroundColor:0x000000 });

		const videoTexture = new PIXI.Texture.fromVideo(video);
		const videoSprite = new PIXI.Sprite(videoTexture);

		const base = PIXI.Texture.from(logoCanvas)
		const logo = new PIXI.Sprite(base);

		video.onchange = function () {
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

		_self.app.stage.addChild(videoSprite);
		_self.app.stage.addChild(logo);

	}

	getURL () {
		return window.URL.createObjectURL(this.app.view.captureStream());
	}

}
