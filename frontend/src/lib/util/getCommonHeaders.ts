// get headers with token to send to backend with fetch to validate request
export default function getCommonHeaders(noBody: boolean = false) {
	const token = localStorage.getItem('token');

	const headers = new Headers();

	if (!noBody) {
		headers.append('Content-Type', 'application/json');
	}

	headers.append('Authorization', `Bearer ${token}`);

	return headers;
}
