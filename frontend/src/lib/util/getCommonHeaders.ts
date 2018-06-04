export default function getCommonHeaders(noBody: boolean = false) {
	const token = localStorage.getItem('token');

	const headers = new Headers();

	if (!noBody) {
		headers.append('Content-Type', 'application/json');
	}

	headers.append('Authorization', `Bearer ${token}`);

	return headers;
}
