import LivepeerSDK from '@livepeer/sdk';

const RINKBEY_CONTROLLER_ADDRESS = process.env.RINKBEY_CONTROLLER_ADDRESS;
const RINKBEY_HTTP_PROVIDER = process.env.RINKBEY_HTTP_PROVIDER;
const STREAM_ROOT_URL = process.env.STREAM_ROOT_URL;
const LIVEPEER_TV_ADDRESS = process.env.LIVEPEER_TV_ADDRESS;
const LIVEPEER_TV_STREAM_ROOT_URL = process.env.LIVEPEER_TV_STREAM_ROOT_URL;
const CRYPTO_LIVEPEER_TV_ADDRESS = process.env.CRYPTO_LIVEPEER_TV_ADDRESS;
const CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL = process.env.CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL;

let rinkebySdk;
LivepeerSDK({
    controllerAddress: RINKBEY_CONTROLLER_ADDRESS,
    provider: RINKBEY_HTTP_PROVIDER
}).then(sdk => rinkebySdk = sdk);

/**
 * Returns current stream link by either Etherium account or stream ID
 * @params {string} anyId - either Etherium account or stream ID
 * returns {Promise<StreamLink>}
 */
export default function (anyId) {
    return rinkebySdk.rpc.getJobs({broadcaster: anyId})
        .then((jobs) => {
            const manifestId = jobs.length && jobs[0].streamId.substr(0, 132)
            anyId = anyId.toLowerCase();
            return anyId === LIVEPEER_TV_ADDRESS.toLowerCase() ? `${LIVEPEER_TV_STREAM_ROOT_URL}/${manifestId}.m3u8` :
                anyId === CRYPTO_LIVEPEER_TV_ADDRESS.toLowerCase() ? `${CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL}/${manifestId}.m3u8` :
                `${STREAM_ROOT_URL}/${manifestId}.m3u8`;
        })
}
