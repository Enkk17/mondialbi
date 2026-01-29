// Placeholder image for missing covers
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x400?text=Copertina+Non+Disponibile';

// Get albums from localStorage or return empty array
function getAlbums() {
    const stored = localStorage.getItem('albums');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('❌ Errore parsing localStorage:', e);
            return [];
        }
    }
    return [];
}

// Transform Airtable data to the expected format
function transformAirtableData(airtableRecords) {
    const transformed = airtableRecords.map((record, index) => {
        const fields = record.fields || {};
        
        // Extract title - try "Titolo" first, then "Title"
        const title = fields.Titolo || fields.Title || 'Titolo Sconosciuto';
        
        // Extract author - try "Autore" first, then "Author Name"
        // Handle both string and array formats
        let author = fields.Autore || 'Autore Sconosciuto';
        if (!author || author === 'Autore Sconosciuto') {
            if (Array.isArray(fields['Author Name']) && fields['Author Name'].length > 0) {
                author = fields['Author Name'][0];
            } else if (fields['Author Name']) {
                author = fields['Author Name'];
            }
        }
        
        // Extract cover image
        // Try different field names: Copertina (attachment), CoverImage (attachment), Image Link (URL)
        let coverImage = PLACEHOLDER_IMAGE;
        
        // Check for attachment arrays first
        if (fields.Copertina && Array.isArray(fields.Copertina) && fields.Copertina.length > 0) {
            coverImage = fields.Copertina[0].url || PLACEHOLDER_IMAGE;
        } else if (fields.CoverImage && Array.isArray(fields.CoverImage) && fields.CoverImage.length > 0) {
            coverImage = fields.CoverImage[0].url || PLACEHOLDER_IMAGE;
        } else if (fields['Image Link']) {
            // Use direct URL if available
            coverImage = fields['Image Link'];
        }
        
        // Validate image URL
        if (!coverImage || coverImage.trim() === '') {
            coverImage = PLACEHOLDER_IMAGE;
        }
        
        // Extract other fields
        const translator = fields.Translator || fields.Traduttore || '';
        
        let illustrator = '';
        if (Array.isArray(fields['Illustrator Name']) && fields['Illustrator Name'].length > 0) {
            illustrator = fields['Illustrator Name'][0];
        } else if (fields.Illustrator || fields.Illustratore) {
            illustrator = fields.Illustrator || fields.Illustratore;
        }
        
        let publisher = 'Editore Sconosciuto';
        if (Array.isArray(fields['Publisher Name']) && fields['Publisher Name'].length > 0) {
            publisher = fields['Publisher Name'][0];
        } else if (fields.Publisher || fields.Editore) {
            publisher = fields.Publisher || fields.Editore;
        }
        
        const year = fields['Publication Year'] || fields.Year || fields.Anno || new Date().getFullYear();
        const rating = fields.Rating || fields.Voto || 0;
        const description = fields.Synopsis || fields.Description || fields.Descrizione || '';
        const fullDescription = fields['Full Description'] || fields.Synopsis || fields.Description || '';
        
        // Extract purchase links
        const purchaseLinks = {
            amazon: fields['Amazon Link'] || fields.AmazonLink || '',
            feltrinelli: fields['Feltrinelli Link'] || fields.FeltrinelliLink || '',
            mondadori: fields['Mondadori Link'] || fields.MondadoriLink || ''
        };
        
        // Extract tags (empty for now as not in current data)
        const tags = [];
        if (fields.Tags && Array.isArray(fields.Tags)) {
            tags.push(...fields.Tags);
        }
        
        return {
            id: record.id || `album-${index + 1}`,
            title,
            author,
            translator,
            illustrator,
            publisher,
            year,
            rating,
            coverImage,
            tags,
            description,
            fullDescription,
            purchaseLinks
        };
    });
    
    console.log(`✅ Caricati con successo ${transformed.length} record dal file data.json`);
    return transformed;
}

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
            console.warn("⚠️ Il file data.json è vuoto o non contiene record.");
            return getAlbums();
        }

        const transformedAlbums = transformAirtableData(data);
        
        // Sovrascrivi SEMPRE il localStorage con i nuovi dati da Airtable
        localStorage.setItem('albums', JSON.stringify(transformedAlbums));
        
        return transformedAlbums;
    } catch (error) {
        console.error('❌ Errore caricamento data.json:', error.message);
        console.warn('⚠️ Il file data.json non è stato trovato o non può essere letto. Usando dati dal localStorage.');
        return getAlbums();
    }
}
