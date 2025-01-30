async function loadMapping() {
  const mapping = await fetch("./mapping.json")
      .then(response => response.json())
      .catch(error => console.error("Fehler beim Laden der JSON:", error));
  return mapping;
}

async function getOverpassTag(germanTerm) {
  const mapping = await loadMapping();
  const lowerCaseTerm = germanTerm.toLowerCase(); // Groß- und Kleinschreibung ignorieren

  // Durchsuche die JSON-Datei nach dem Begriff
  for (const [tag, synonyms] of Object.entries(mapping)) {
      if (synonyms.map((s) => s.toLowerCase()).includes(lowerCaseTerm)) {
          return tag; // Gib den Overpass-Tag zurück, falls gefunden
      }
  }

  return null; // Gib null zurück, falls der Begriff nicht gefunden wurde
}

async function find(word) {
  return await getOverpassTag(word);
  
}
