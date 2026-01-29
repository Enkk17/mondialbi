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
        
        // Extract cover image - prioritize Cover Image attachment, fallback to Image Link
        let coverImage = PLACEHOLDER_IMAGE;
        if (fields['Cover Image'] && Array.isArray(fields['Cover Image']) && fields['Cover Image'].length > 0 && fields['Cover Image'][0]) {
            coverImage = fields['Cover Image'][0].url || PLACEHOLDER_IMAGE;
        } else if (fields['Image Link']) {
            coverImage = fields['Image Link'];
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
        
        // Extract year - use Publication Year (note: not "Years" as spec says, but actual field is "Year")
        const year = fields['Publication Year'] || fields['Publication Years'] || null;
        
        // Extract ISBN
        const isbn = fields.ISBN || '';
        
        // Extract Book Age
        const bookAge = fields['Book Age (Years)'] || fields['Book Age'] || null;
        
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
            console.error('❌ ERRORE: Il file data.json è vuoto o non contiene record validi.');
            console.error('⚠️ Verifica che il file data.json contenga un array di record da Airtable.');
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
    
    // Build modal content
    let content = `
        <div class="modal-album-details">
            <div class="modal-album-cover">
                <img src="${albo.coverImage || PLACEHOLDER_IMAGE}" 
                     alt="Copertina di ${albo.title}"
                     onerror="this.src='${PLACEHOLDER_IMAGE}'">
            </div>
            <div class="modal-album-info">
                <h2>${albo.title}</h2>
                <p><strong>Autore:</strong> ${albo.author}</p>
    `;
    
    if (albo.illustrator) {
        content += `<p><strong>Illustratore:</strong> ${albo.illustrator}</p>`;
    }
    
    if (albo.translator) {
        content += `<p><strong>Traduttore:</strong> ${albo.translator}</p>`;
    }
    
    content += `<p><strong>Editore:</strong> ${albo.publisher}</p>`;
    
    if (albo.year) {
        content += `<p><strong>Anno:</strong> ${albo.year}</p>`;
    }
    
    if (albo.isbn) {
        content += `<p><strong>ISBN:</strong> ${albo.isbn}</p>`;
    }
    
    if (albo.bookAge) {
        content += `<p><strong>Età libro:</strong> ${albo.bookAge} anni</p>`;
    }
    
    if (albo.rating && albo.rating > 0) {
        content += `<p><strong>Valutazione:</strong> ${albo.rating}/5</p>`;
    }
    
    if (albo.tags && albo.tags.length > 0) {
        content += '<div class="modal-tags">';
        albo.tags.forEach(tag => {
            content += `<span class="tag">${tag}</span>`;
        });
        content += '</div>';
    }
    
    if (albo.fullDescription || albo.description) {
        content += `<div class="modal-description">
            <h3>Descrizione</h3>
            <p>${albo.fullDescription || albo.description}</p>
        </div>`;
    }
    
    // Purchase links
    const hasLinks = albo.purchaseLinks && 
        (albo.purchaseLinks.amazon || albo.purchaseLinks.feltrinelli || albo.purchaseLinks.mondadori);
    
    if (hasLinks) {
        content += '<div class="modal-purchase-links"><h3>Dove acquistare</h3><div class="purchase-buttons">';
        
        if (albo.purchaseLinks.amazon) {
            content += `<a href="${albo.purchaseLinks.amazon}" target="_blank" rel="noopener noreferrer" class="purchase-link amazon">Amazon</a>`;
        }
        if (albo.purchaseLinks.feltrinelli) {
            content += `<a href="${albo.purchaseLinks.feltrinelli}" target="_blank" rel="noopener noreferrer" class="purchase-link feltrinelli">Feltrinelli</a>`;
        }
        if (albo.purchaseLinks.mondadori) {
            content += `<a href="${albo.purchaseLinks.mondadori}" target="_blank" rel="noopener noreferrer" class="purchase-link mondadori">Mondadori</a>`;
        }
        
        content += '</div></div>';
    }
    
    content += '</div></div>';
    
    modalBody.innerHTML = content;
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
