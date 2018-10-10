/*
	Listener to dialog bettween dependencies (LivePeer, FFMpeg, Electron) and the app
	@return a events received in the stores
*/

import { StreamNode, StreamServer } from '../services'

export const ffmpegEvents = ({ api, emitter, listener }) => {

	api.on('broadcast', (args) => { emitter.send('broadcast', args) })

	const streamNode = StreamNode();
	const streamServer = new StreamServer();

	listener.on('broadcast', (event, arg) => {
		const { fromState } = arg;
		if (!fromState) {
			streamNode.run()
			streamServer.run()
				.then(() => {
					emitter.send('broadcast', { hlsStrmID: 'streamNode' });
				});
		} else if (fromState) {
			streamServer.stop();
			streamNode.stop();
			emitter.send('broadcast', 0);
		}
	});

}
