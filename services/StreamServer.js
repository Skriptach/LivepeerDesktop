import ffmpeg from 'ffmpeg-static'
import child_process from 'child_process';
import http from 'http';
import { Server as WSServer } from 'ws';
const WSPORT = process.env.WSPORT || 9000;
const RTMP_PORT = process.env.RTMP_PORT || 1935;

export default class StreamServer {

	constructor () {
		const self = this;

		this.ffmpegProc = null;

		const server = http.createServer().listen(WSPORT, err => {
			if (err) return console.error(err);

			console.log(`StreamServer listening on ${WSPORT}`);
		});

		const WSS = new WSServer({ server });

		WSS.on('connection', (ws) => {
			ws.on('message', (msg) => {
				self.ffmpegProc.stdin.write(msg);
			});

			ws.on('close', (e) => {
				self.stop();
			});
		});

	}

	run () {
		return new Promise((resolve, reject) => {
			console.log('Running FFMPEG');
			this.ffmpegProc = child_process.spawn(ffmpeg.path, [
				//'-f', 'avfoundation',
				'-i', 'pipe:',
				'-preset', 'ultrafast',
				'-vcodec', 'copy',
				'-tune', 'zerolatency',
				'-acodec', 'aac',
				'-f', 'flv',
				`rtmp://localhost:${RTMP_PORT}/live/cam`
			]);

			this.ffmpegProc.stdin.on('error', (e) => {
				console.log('FFmpeg STDIN Error', e);
			});

			this.ffmpegProc.stderr.on('data', (data) => {
				console.log('FFmpeg STDERR:', data.toString());
			});

			setTimeout(() => resolve(), 10);
		});
	}

	stop () {
		console.log('Stop FFMPEG')
		if (this.ffmpegProc != null) {
			this.ffmpegProc.kill('SIGINT');
			this.ffmpegProc = null;
		}
	}

}