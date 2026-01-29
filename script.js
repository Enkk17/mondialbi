async function loadDataFromJSON() {
    try {
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data.json?v=${cacheBuster}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Se data è vuoto, usa i default
        if (!data || data.length === 0) {
            console.warn("Il file data.json è vuoto.");
            return getAlbums();
        }

        const transformedAlbums = transformAirtableData(data);
        
        // Sovrascrivi SEMPRE il localStorage con i nuovi dati da Airtable
        localStorage.setItem('albums', JSON.stringify(transformedAlbums));
        
        return transformedAlbums;
    } catch (error) {
        console.error('Errore caricamento data.json:', error.message);
        return getAlbums();
    }
}
