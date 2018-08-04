/*
    Listener to dialog bettween dependencies (LivePeer, FFMpeg, Electron) and the app
    @return a events received in the stores
*/

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
            // create a stream, then startFFMpeg
            const videoURL = `https://d1k66rqp5xwvxb.cloudfront.net/stream/${strmID}.m3u8`;
            emitter.send('play', { videoURL });
        } else if (!strmID) {
            emitter.send('play', { strmID: 0 });
        }
    })
}
