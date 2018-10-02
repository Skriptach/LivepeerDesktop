/*
	Listener to dialog bettween dependencies (LivePeer, FFMpeg, Electron) and the app
	@return a events received in the stores
*/

import { StreamNode } from '../services'

export const ffmpegEvents = ({ api, emitter, listener }) => {
	/*
		Listen for API callbacks
	*/
	api.on('broadcast', (args) => { emitter.send('broadcast', args) })

	/*
		Toggle the broadcaster state
	*/
	const streamNode = StreamNode();
	listener.on('broadcast', (event, arg) => {
		const { fromState } = arg;
		if (!fromState) {
			streamNode.run();
			emitter.send('broadcast', { hlsStrmID: 'streamNode' });
		} else if (fromState) {
			streamNode.stop();
			emitter.send('broadcast', 0);
		}
	});

}
