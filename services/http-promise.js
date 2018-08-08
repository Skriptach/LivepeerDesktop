import http from 'http'
import https from 'https'

export default function (url) {
	return new Promise((resolve, reject) => {
		const lib = url.startsWith('https') ? https : http;
		const request = lib.get(url, (response) => {
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			const body = [];
			response.on('data', (chunk) => body.push(chunk));
			response.on('end', () => resolve({
				url, 
				success: true,
				data: body.join(''),
				statusCode: response.statusCode
			}));
		});
		request.on('error', (err) => reject(err))
	})
}
