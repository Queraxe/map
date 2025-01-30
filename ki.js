
// Dein API-Schlüssel hier einfügen
const apiKey = 'DEIN_API_SCHLÜSSEL';

// Die URL der DeepSeek API
const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

// Funktion, um eine Anfrage zu senden
async function askDeepSeek(question) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",  // Modell, das du verwenden möchtest
        messages: [{
          role: "user",
          content: question  // Die Frage, die du an die KI stellst
        }]
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Die Antwort von der API
      console.log("Antwort der KI:", data.choices[0].message.content);
      return data.choices[0].message.content;
    } else {
      console.error("Fehler bei der Anfrage:", data);
      return "Entschuldigung, es gab ein Problem mit der Anfrage.";
    }
  } catch (error) {
    console.error("Fehler bei der API-Anfrage:", error);
    return "Entschuldigung, es gab ein Problem bei der Verbindung.";
  }
}