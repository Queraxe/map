function clearAllCookies() {
	document.cookie.split("; ").forEach((cookie) => {
		const cookieName = cookie.split("=")[0];
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
	});
}

function getCookieValue(name) {
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((row) => row.startsWith(name + "="));
	return cookie ? cookie.split("=")[1] : null;
}

function setCookies(la, lo) {
	const now = new Date();
	const reset = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
        now.getHours() + 1
	); // Mitternacht des nächsten Tages
	const expires = reset.toUTCString(); // In UTC-Format konvertieren

	// Cookies setzen
	document.cookie = `longitude=${lo}; expires=${expires}; path=/`;
	document.cookie = `latitude=${la}; expires=${expires}; path=/`;
}