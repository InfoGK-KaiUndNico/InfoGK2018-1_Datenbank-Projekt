export default function getCommonHeaders() {
	const token = localStorage.getItem('token');

	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', `Bearer ${token}`);

	return headers;
}
