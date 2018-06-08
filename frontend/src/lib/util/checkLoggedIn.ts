export default function checkLoggedIn() {
	return localStorage.getItem('token') !== null && localStorage.getItem('userName') !== null && localStorage.getItem('userRang') !== null;
}
