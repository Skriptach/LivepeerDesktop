/*
	Listener to dialog between dependencies (LivePeer, FFMpeg, Electron) and the app
	@return a events received in the stores
*/

import { PlayerLinkBuilder } from '../services';

export const livepeerEvents = ({ api, emitter, listener, config }) => {
	const { httpPort } = config;

	/*
		Listen for API callbacks
	*/
	api.on('notifier', (args) => {
		emitter.send('notifier', args);
	})

	/*
		Start LivePeer
	*/
	listener.on('startLivepeer', () => {
		//api.startLivepeer()
	})

	/*
		Reset LivePeer
	*/
	listener.on('resetLivepeer', () => {
		api.resetLivepeer()
	})

	/*
		Toggle the player state
	*/
	listener.on('play', (event, arg) => {
		const { strmID } = arg;
		if (strmID) {
			PlayerLinkBuilder(strmID)
				.then((videoURL) => {
					emitter.send('play', { videoURL });
				})
				.catch((error) => {
					emitter.send('notifier', {error: '6'});
				});

		} else if (!strmID) {
			emitter.send('play', { strmID: 0 });
		}
	})
}
