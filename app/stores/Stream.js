
export default class Stream {

	constructor (videoStream) {
		const ws = new WebSocket(`ws://localhost:9000/`);
		let isReady = false;

		const mediaRecorder = this.mediaRecorder = new MediaRecorder(videoStream, {
			mimeType: 'video/webm;codecs=h264',
			videoBitsPerSecond : 3 * 1024 * 1024
		});

		mediaRecorder.addEventListener('dataavailable', (e) => {
			isReady && ws.send(e.data);
		});

		ws.addEventListener('open', (e) => {
			isReady = true;
		});

		ws.addEventListener('close', (e) => {
			mediaRecorder.state !== 'inactive' && mediaRecorder.stop();
		});

	}

	setStreamState (state) {
		if (state){
			this.mediaRecorder.start(1000);
		} else {
			this.mediaRecorder.state !== 'inactive' && this.mediaRecorder.stop();
		}
	}
}