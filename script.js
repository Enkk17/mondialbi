// Placeholder image for missing covers
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x400?text=Copertina+Non+Disponibile';

// Get albi from localStorage or return empty array
function getAlbi() {
    const stored = localStorage.getItem('albi');
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
        
        // Extract title - use "Title" field from Airtable
        const title = fields.Title || 'Titolo Sconosciuto';
        
        // Extract author - prioritize Author, then Author Name
        let author = 'Autore Sconosciuto';
        if (fields.Author && typeof fields.Author === 'string' && fields.Author.trim() !== '') {
            author = fields.Author.trim();
        } else if (Array.isArray(fields['Author Name']) && fields['Author Name'].length > 0) {
            author = fields['Author Name'][0];
        } else if (fields['Author Name'] && typeof fields['Author Name'] === 'string' && fields['Author Name'].trim() !== '') {
            author = fields['Author Name'].trim();
        }
        
        // Extract cover image - prioritize Cover Image attachment, fallback to Image link
        let coverImage = PLACEHOLDER_IMAGE;
        if (fields['Cover Image'] && Array.isArray(fields['Cover Image']) && fields['Cover Image'].length > 0 && fields['Cover Image'][0]) {
            coverImage = fields['Cover Image'][0].url || PLACEHOLDER_IMAGE;
        } else if (fields['Image link']) {
            coverImage = fields['Image link'];
        }
        
        // Validate image URL
        if (!coverImage || typeof coverImage !== 'string' || coverImage.trim() === '') {
            coverImage = PLACEHOLDER_IMAGE;
        }
        
        // Extract translator - use Translator field
        const translator = fields.Translator || '';
        
        // Extract illustrator - prioritize Illustrator field
        let illustrator = '';
        if (fields.Illustrator && typeof fields.Illustrator === 'string' && fields.Illustrator.trim() !== '') {
            illustrator = fields.Illustrator.trim();
        } else if (Array.isArray(fields['Illustrator Name']) && fields['Illustrator Name'].length > 0) {
            illustrator = fields['Illustrator Name'][0];
        } else if (fields['Illustrator Name'] && typeof fields['Illustrator Name'] === 'string') {
            illustrator = fields['Illustrator Name'].trim();
        }
        
        // Extract publisher - prioritize Publisher field
        let publisher = 'Editore Sconosciuto';
        if (fields.Publisher && typeof fields.Publisher === 'string' && fields.Publisher.trim() !== '') {
            publisher = fields.Publisher.trim();
        } else if (Array.isArray(fields['Publisher Name']) && fields['Publisher Name'].length > 0) {
            publisher = fields['Publisher Name'][0];
        } else if (fields['Publisher Name'] && typeof fields['Publisher Name'] === 'string') {
            publisher = fields['Publisher Name'].trim();
        }
        
        // Extract year - use Publication Year field
        const year = fields['Publication Year'] || fields['Publication Years'] || null;
        
        // Extract ISBN
        const isbn = fields.ISBN || '';
        
        // Extract Book Age - validate it's numeric
        let bookAge = null;
        const rawBookAge = fields['Book Age (Years)'] || fields['Book Age'];
        if (rawBookAge && typeof rawBookAge === 'number') {
            bookAge = rawBookAge;
        }
        
        // Extract rating
        const rating = fields.Rating || fields.Voto || 0;
        
        // Extract synopsis/description
        const description = fields.Synopsis || '';
        const fullDescription = fields['Full Description'] || fields.Synopsis || '';
        
        // Extract purchase links
        const purchaseLinks = {
            amazon: fields['Amazon Link'] || '',
            feltrinelli: fields['Feltrinelli Link'] || '',
            mondadori: fields['Mondadori Link'] || ''
        };
        
        // Extract tags - handle both array and string formats
        const tags = [];
        if (fields.Tags) {
            if (Array.isArray(fields.Tags)) {
                tags.push(...fields.Tags);
            } else if (typeof fields.Tags === 'string') {
                tags.push(...fields.Tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0));
            }
        }
        
        return {
            id: record.id || `albo-${index + 1}`,
            title,
            author,
            translator,
            illustrator,
            publisher,
            year,
            isbn,
            bookAge,
            rating,
            coverImage,
            tags,
            description,
            fullDescription,
            purchaseLinks
        };
    });
    
    console.log(`✅ Caricati con successo ${transformed.length} albi dal file data.json`);
    return transformed;
}

async function loadDataFromJSON() {
    try {
        // Add anti-cache parameter with timestamp
        const cacheBuster = new Date().getTime();
        const response = await fetch(`data.json?v=${cacheBuster}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verify that data is an array and not empty
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn('⚠️ Il file data.json è vuoto o non contiene record validi.');
            console.warn('⚠️ Verifica che il file data.json contenga un array di record da Airtable.');
            return getAlbi();
        }

        // Transform Airtable data to app format
        const albiTrasformati = transformAirtableData(data);
        
        // IMPORTANTE: Sovrascrivi SEMPRE il localStorage con i nuovi dati da Airtable
        // Questo previene che vecchi dati di test blocchino la visualizzazione
        localStorage.setItem('albi', JSON.stringify(albiTrasformati));
        console.log(`✅ localStorage aggiornato con ${albiTrasformati.length} albi da data.json`);
        
        return albiTrasformati;
    } catch (error) {
        console.error('❌ ERRORE nel caricamento di data.json:', error.message);
        console.error('⚠️ Il file data.json non è stato trovato o non può essere letto.');
        console.error('⚠️ Dettagli errore:', error);
        console.warn('⚠️ Tentativo di recupero dati dal localStorage...');
        return getAlbi();
    }
}

// Global state
let tuttiGliAlbi = [];
let currentSort = 'random';

// Display albi in the grid
function displayAlbi(albi) {
    const container = document.getElementById('albums-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!albi || albi.length === 0) {
        container.innerHTML = '<p class="no-results">Nessun albo trovato. Prova una ricerca diversa.</p>';
        return;
    }
    
    albi.forEach(albo => {
        const card = document.createElement('article');
        card.className = 'album-card';
        card.setAttribute('data-album-id', albo.id);
        
        // Cover image
        const coverDiv = document.createElement('div');
        coverDiv.className = 'album-cover';
        const img = document.createElement('img');
        img.src = albo.coverImage || PLACEHOLDER_IMAGE;
        img.alt = `Copertina di ${albo.title}`;
        img.loading = 'lazy';
        img.onerror = () => img.src = PLACEHOLDER_IMAGE;
        coverDiv.appendChild(img);
        
        // Info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'album-info';
        
        const title = document.createElement('h3');
        title.className = 'album-title';
        title.textContent = albo.title;
        
        const author = document.createElement('p');
        author.className = 'album-author';
        author.textContent = albo.author;
        
        const publisher = document.createElement('p');
        publisher.className = 'album-publisher';
        publisher.textContent = albo.publisher;
        
        infoDiv.appendChild(title);
        infoDiv.appendChild(author);
        infoDiv.appendChild(publisher);
        
        if (albo.year) {
            const year = document.createElement('p');
            year.className = 'album-year';
            year.textContent = albo.year;
            infoDiv.appendChild(year);
        }
        
        // Tags
        if (albo.tags && albo.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'album-tags';
            albo.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });
            infoDiv.appendChild(tagsDiv);
        }
        
        card.appendChild(coverDiv);
        card.appendChild(infoDiv);
        
        // Click handler to open modal
        card.addEventListener('click', () => openModal(albo));
        card.style.cursor = 'pointer';
        
        container.appendChild(card);
    });
}

// Filter albi based on search query
function filterAlbi(searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
        return tuttiGliAlbi;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return tuttiGliAlbi.filter(albo => {
        const titleMatch = albo.title.toLowerCase().includes(query);
        const authorMatch = albo.author.toLowerCase().includes(query);
        const publisherMatch = albo.publisher.toLowerCase().includes(query);
        const tagsMatch = albo.tags && albo.tags.some(tag => 
            tag.toLowerCase().includes(query)
        );
        const illustratorMatch = albo.illustrator && 
            albo.illustrator.toLowerCase().includes(query);
        const translatorMatch = albo.translator && 
            albo.translator.toLowerCase().includes(query);
        
        return titleMatch || authorMatch || publisherMatch || tagsMatch || 
               illustratorMatch || translatorMatch;
    });
}

// Sort albi
function sortAlbi(albi, sortBy) {
    const sorted = [...albi];
    
    switch (sortBy) {
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            sorted.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'year':
            sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case 'random':
            // Fisher-Yates shuffle
            for (let i = sorted.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
            break;
    }
    
    return sorted;
}

// Handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value : '';
    
    const filtered = filterAlbi(query);
    const sorted = sortAlbi(filtered, currentSort);
    displayAlbi(sorted);
}

// Handle sort change
function handleSortChange(event) {
    currentSort = event.target.value;
    handleSearch(); // Re-apply search with new sort
}

// Open modal with albo details
function openModal(albo) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Helper function to safely create text elements
    const createTextElement = (tag, text) => {
        const el = document.createElement(tag);
        el.textContent = text;
        return el;
    };
    
    // Helper function to sanitize and validate URL
    const sanitizeUrl = (url) => {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();
        // Only allow http and https protocols
        if (trimmed.match(/^https?:\/\//i)) {
            return trimmed;
        }
        return '';
    };
    
    // Create modal structure safely
    const modalDetails = document.createElement('div');
    modalDetails.className = 'modal-album-details';
    
    // Cover image
    const coverDiv = document.createElement('div');
    coverDiv.className = 'modal-album-cover';
    const img = document.createElement('img');
    img.src = albo.coverImage || PLACEHOLDER_IMAGE;
    img.alt = `Copertina di ${albo.title}`;
    img.onerror = function() { this.src = PLACEHOLDER_IMAGE; };
    coverDiv.appendChild(img);
    
    // Album info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'modal-album-info';
    
    // Title
    const titleEl = createTextElement('h2', albo.title);
    infoDiv.appendChild(titleEl);
    
    // Author
    const authorP = document.createElement('p');
    const authorStrong = createTextElement('strong', 'Autore: ');
    authorP.appendChild(authorStrong);
    authorP.appendChild(document.createTextNode(albo.author));
    infoDiv.appendChild(authorP);
    
    // Illustrator
    if (albo.illustrator) {
        const illustratorP = document.createElement('p');
        const illustratorStrong = createTextElement('strong', 'Illustratore: ');
        illustratorP.appendChild(illustratorStrong);
        illustratorP.appendChild(document.createTextNode(albo.illustrator));
        infoDiv.appendChild(illustratorP);
    }
    
    // Translator
    if (albo.translator) {
        const translatorP = document.createElement('p');
        const translatorStrong = createTextElement('strong', 'Traduttore: ');
        translatorP.appendChild(translatorStrong);
        translatorP.appendChild(document.createTextNode(albo.translator));
        infoDiv.appendChild(translatorP);
    }
    
    // Publisher
    const publisherP = document.createElement('p');
    const publisherStrong = createTextElement('strong', 'Editore: ');
    publisherP.appendChild(publisherStrong);
    publisherP.appendChild(document.createTextNode(albo.publisher));
    infoDiv.appendChild(publisherP);
    
    // Year
    if (albo.year) {
        const yearP = document.createElement('p');
        const yearStrong = createTextElement('strong', 'Anno: ');
        yearP.appendChild(yearStrong);
        yearP.appendChild(document.createTextNode(String(albo.year)));
        infoDiv.appendChild(yearP);
    }
    
    // ISBN
    if (albo.isbn) {
        const isbnP = document.createElement('p');
        const isbnStrong = createTextElement('strong', 'ISBN: ');
        isbnP.appendChild(isbnStrong);
        isbnP.appendChild(document.createTextNode(albo.isbn));
        infoDiv.appendChild(isbnP);
    }
    
    // Book Age
    if (albo.bookAge && typeof albo.bookAge === 'number') {
        const bookAgeP = document.createElement('p');
        const bookAgeStrong = createTextElement('strong', 'Età libro: ');
        bookAgeP.appendChild(bookAgeStrong);
        // Handle singular/plural for Italian
        const yearsText = albo.bookAge === 1 ? 'anno' : 'anni';
        bookAgeP.appendChild(document.createTextNode(`${albo.bookAge} ${yearsText}`));
        infoDiv.appendChild(bookAgeP);
    }
    
    // Rating
    if (albo.rating && albo.rating > 0) {
        const ratingP = document.createElement('p');
        const ratingStrong = createTextElement('strong', 'Valutazione: ');
        ratingP.appendChild(ratingStrong);
        ratingP.appendChild(document.createTextNode(`${albo.rating}/5`));
        infoDiv.appendChild(ratingP);
    }
    
    // Tags
    if (albo.tags && albo.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'modal-tags';
        albo.tags.forEach(tag => {
            const tagSpan = createTextElement('span', tag);
            tagSpan.className = 'tag';
            tagsDiv.appendChild(tagSpan);
        });
        infoDiv.appendChild(tagsDiv);
    }
    
    // Description
    if (albo.fullDescription || albo.description) {
        const descDiv = document.createElement('div');
        descDiv.className = 'modal-description';
        const descTitle = createTextElement('h3', 'Descrizione');
        const descText = createTextElement('p', albo.fullDescription || albo.description);
        descDiv.appendChild(descTitle);
        descDiv.appendChild(descText);
        infoDiv.appendChild(descDiv);
    }
    
    // Purchase links
    const amazonUrl = sanitizeUrl(albo.purchaseLinks?.amazon);
    const feltrinelliUrl = sanitizeUrl(albo.purchaseLinks?.feltrinelli);
    const mondadoriUrl = sanitizeUrl(albo.purchaseLinks?.mondadori);
    const hasLinks = amazonUrl || feltrinelliUrl || mondadoriUrl;
    
    if (hasLinks) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'modal-purchase-links';
        const linksTitle = createTextElement('h3', 'Dove acquistare');
        linksDiv.appendChild(linksTitle);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'purchase-buttons';
        
        if (amazonUrl) {
            const amazonLink = document.createElement('a');
            amazonLink.href = amazonUrl;
            amazonLink.target = '_blank';
            amazonLink.rel = 'noopener noreferrer';
            amazonLink.className = 'purchase-link amazon';
            amazonLink.textContent = 'Amazon';
            buttonsDiv.appendChild(amazonLink);
        }
        
        if (feltrinelliUrl) {
            const feltrinelliLink = document.createElement('a');
            feltrinelliLink.href = feltrinelliUrl;
            feltrinelliLink.target = '_blank';
            feltrinelliLink.rel = 'noopener noreferrer';
            feltrinelliLink.className = 'purchase-link feltrinelli';
            feltrinelliLink.textContent = 'Feltrinelli';
            buttonsDiv.appendChild(feltrinelliLink);
        }
        
        if (mondadoriUrl) {
            const mondadoriLink = document.createElement('a');
            mondadoriLink.href = mondadoriUrl;
            mondadoriLink.target = '_blank';
            mondadoriLink.rel = 'noopener noreferrer';
            mondadoriLink.className = 'purchase-link mondadori';
            mondadoriLink.textContent = 'Mondadori';
            buttonsDiv.appendChild(mondadoriLink);
        }
        
        linksDiv.appendChild(buttonsDiv);
        infoDiv.appendChild(linksDiv);
    }
    
    modalDetails.appendChild(coverDiv);
    modalDetails.appendChild(infoDiv);
    
    // Clear and append to modal body
    modalBody.innerHTML = '';
    modalBody.appendChild(modalDetails);
    modal.style.display = 'block';
    
    // Show referral disclaimer if there are purchase links
    if (hasLinks) {
        showReferralDisclaimer();
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show referral disclaimer
function showReferralDisclaimer() {
    const disclaimer = document.getElementById('referral-disclaimer');
    if (disclaimer && !sessionStorage.getItem('disclaimerShown')) {
        disclaimer.style.display = 'block';
        sessionStorage.setItem('disclaimerShown', 'true');
    }
}

// Close referral disclaimer
function closeReferralDisclaimer() {
    const disclaimer = document.getElementById('referral-disclaimer');
    if (disclaimer) {
        disclaimer.style.display = 'none';
    }
}

// Initialize the page
async function initializePage() {
    try {
        // Load albi from JSON
        tuttiGliAlbi = await loadDataFromJSON();
        
        // Display albi with initial random sort
        const sorted = sortAlbi(tuttiGliAlbi, currentSort);
        displayAlbi(sorted);
        
        console.log(`✅ Pagina inizializzata con ${tuttiGliAlbi.length} albi`);
    } catch (error) {
        console.error('❌ Errore inizializzazione pagina:', error);
        displayAlbi([]);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page
    initializePage();
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Modal close button
    const closeButton = document.querySelector('.modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    // Referral disclaimer close
    const disclaimerClose = document.querySelector('.disclaimer-close');
    const disclaimerButton = document.querySelector('.disclaimer-button');
    
    if (disclaimerClose) {
        disclaimerClose.addEventListener('click', closeReferralDisclaimer);
    }
    
    if (disclaimerButton) {
        disclaimerButton.addEventListener('click', closeReferralDisclaimer);
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
            closeReferralDisclaimer();
        }
    });
    
    // Listen for localStorage changes (from admin panel)
    window.addEventListener('storage', (event) => {
        if (event.key === 'albi') {
            console.log('🔄 Albi aggiornati, ricarico...');
            initializePage();
        }
    });
});
