const apiKey = "AIzaSyAU9i0Smwk3of5GVil8_S2NnDRCVH2GSV8"; //

const geminiApiUrl =
	"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" +
	apiKey;

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
};

async function ask(question) {
	const requestBody = {
		contents: [
			{
				parts: [{ text: question }],
			},
		],
		generationConfig: generationConfig,
	};

	try {
		const response = await fetch(geminiApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		const text = data.candidates[0].content.parts[0].text;
		console.log(text);
		return text;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

