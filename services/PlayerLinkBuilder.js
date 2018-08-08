import LivepeerSDK from '@livepeer/sdk'
import { get } from './index'

const RINKBEY_CONTROLLER_ADDRESS = process.env.RINKBEY_CONTROLLER_ADDRESS;
const RINKBEY_HTTP_PROVIDER = process.env.RINKBEY_HTTP_PROVIDER;
const STREAM_ROOT_URL = process.env.STREAM_ROOT_URL;
const LIVEPEER_TV_ADDRESS = process.env.LIVEPEER_TV_ADDRESS;
const LIVEPEER_TV_STREAM_ROOT_URL = process.env.LIVEPEER_TV_STREAM_ROOT_URL;
const CRYPTO_LIVEPEER_TV_ADDRESS = process.env.CRYPTO_LIVEPEER_TV_ADDRESS;
const CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL = process.env.CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL;

const rootUrls = [LIVEPEER_TV_STREAM_ROOT_URL, CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL, STREAM_ROOT_URL];

const hexDigitRx = '([0-9A-Fa-f]{2})';
const hexNumberRx = new RegExp(`0x${hexDigitRx}{20}`);
const hexStreamRx = new RegExp(`${hexDigitRx}{66}`);

let rinkebySdk;
LivepeerSDK({
	controllerAddress: RINKBEY_CONTROLLER_ADDRESS,
	provider: RINKBEY_HTTP_PROVIDER
}).then(sdk => rinkebySdk = sdk);

function probeLists(streamId) {
	return rootUrls.map((rootUrl) => {
		return get(`${rootUrl}/${streamId}.m3u8`)
			.catch((error) => ({success: false}));
	});
}


/**
 * Returns current stream link by either Etherium account or stream ID
 * @params {string} anyId - either Etherium account or stream ID
 * returns {Promise<StreamLink>}
 */
export default function (anyId) {
	return hexNumberRx.test(anyId) ? rinkebySdk.rpc.getJobs({broadcaster: anyId})
		.then((jobs) => {
			const manifestId = jobs.length && jobs[0].streamId.substr(0, 132)
			anyId = anyId.toLowerCase();
			return anyId === LIVEPEER_TV_ADDRESS.toLowerCase() ? `${LIVEPEER_TV_STREAM_ROOT_URL}/${manifestId}.m3u8` :
				anyId === CRYPTO_LIVEPEER_TV_ADDRESS.toLowerCase() ? `${CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL}/${manifestId}.m3u8` :
				`${STREAM_ROOT_URL}/${manifestId}.m3u8`;
		})
		: hexStreamRx.test(anyId) ? Promise.all(probeLists(anyId))
			.then((m3u8List) => {
				const response = m3u8List.find((m3u8) => m3u8.success)
				return response.url;
			})
		: Promise.reject(new Error('Unknown source'));
}
