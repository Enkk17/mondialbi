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
        let author = fields.Autore && fields.Autore.trim() !== '' ? fields.Autore : null;
        if (!author) {
            if (Array.isArray(fields['Author Name']) && fields['Author Name'].length > 0) {
                author = fields['Author Name'][0];
            } else if (fields['Author Name'] && typeof fields['Author Name'] === 'string' && fields['Author Name'].trim() !== '') {
                author = fields['Author Name'];
            } else {
                author = 'Autore Sconosciuto';
            }
        }
        
        // Extract cover image
        // Try different field names: Copertina (attachment), CoverImage (attachment), Image Link (URL)
        let coverImage = PLACEHOLDER_IMAGE;
        
        // Check for attachment arrays first
        if (fields.Copertina && Array.isArray(fields.Copertina) && fields.Copertina.length > 0 && fields.Copertina[0]) {
            coverImage = fields.Copertina[0].url || PLACEHOLDER_IMAGE;
        } else if (fields.CoverImage && Array.isArray(fields.CoverImage) && fields.CoverImage.length > 0 && fields.CoverImage[0]) {
            coverImage = fields.CoverImage[0].url || PLACEHOLDER_IMAGE;
        } else if (fields['Image Link']) {
            // Use direct URL if available
            coverImage = fields['Image Link'];
        }
        
        // Validate image URL
        if (!coverImage || typeof coverImage !== 'string' || coverImage.trim() === '') {
            coverImage = PLACEHOLDER_IMAGE;
        }
        
        // Extract other fields
        const translator = fields.Translator || fields.Traduttore || '';
        
        let illustrator = '';
        if (Array.isArray(fields['Illustrator Name']) && fields['Illustrator Name'].length > 0) {
            illustrator = fields['Illustrator Name'][0];
        } else {
            const illus = fields.Illustrator || fields.Illustratore || '';
            illustrator = illus.trim ? illus.trim() : illus;
        }
        
        let publisher = '';
        if (Array.isArray(fields['Publisher Name']) && fields['Publisher Name'].length > 0) {
            publisher = fields['Publisher Name'][0];
        } else {
            publisher = fields.Publisher || fields.Editore || '';
        }
        publisher = publisher && publisher.trim ? publisher.trim() : publisher;
        if (!publisher) {
            publisher = 'Editore Sconosciuto';
        }
        
        const year = fields['Publication Year'] || fields.Year || fields.Anno || null;
        const rating = fields.Rating || fields.Voto || 0;
        const description = fields.Synopsis || fields.Description || fields.Descrizione || '';
        const fullDescription = fields['Full Description'] || fields.Synopsis || fields.Description || '';
        
        // Extract purchase links
        const purchaseLinks = {
            amazon: fields['Amazon Link'] || fields.AmazonLink || '',
            feltrinelli: fields['Feltrinelli Link'] || fields.FeltrinelliLink || '',
            mondadori: fields['Mondadori Link'] || fields.MondadoriLink || ''
        };
        
        // Extract tags - handle both array and string formats
        const tags = [];
        if (fields.Tags) {
            if (Array.isArray(fields.Tags)) {
                tags.push(...fields.Tags);
            } else if (typeof fields.Tags === 'string') {
                // Handle comma-separated string
                tags.push(...fields.Tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0));
            }
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

// Global state
let allAlbums = [];
let currentSort = 'random';

// Display albums in the grid
function displayAlbums(albums) {
    const container = document.getElementById('albums-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!albums || albums.length === 0) {
        container.innerHTML = '<p class="no-results">Nessun albo trovato. Prova una ricerca diversa.</p>';
        return;
    }
    
    albums.forEach(album => {
        const card = document.createElement('article');
        card.className = 'album-card';
        card.setAttribute('data-album-id', album.id);
        
        // Cover image
        const coverDiv = document.createElement('div');
        coverDiv.className = 'album-cover';
        const img = document.createElement('img');
        img.src = album.coverImage || PLACEHOLDER_IMAGE;
        img.alt = `Copertina di ${album.title}`;
        img.loading = 'lazy';
        img.onerror = () => img.src = PLACEHOLDER_IMAGE;
        coverDiv.appendChild(img);
        
        // Info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'album-info';
        
        const title = document.createElement('h3');
        title.className = 'album-title';
        title.textContent = album.title;
        
        const author = document.createElement('p');
        author.className = 'album-author';
        author.textContent = album.author;
        
        const publisher = document.createElement('p');
        publisher.className = 'album-publisher';
        publisher.textContent = album.publisher;
        
        infoDiv.appendChild(title);
        infoDiv.appendChild(author);
        infoDiv.appendChild(publisher);
        
        if (album.year) {
            const year = document.createElement('p');
            year.className = 'album-year';
            year.textContent = album.year;
            infoDiv.appendChild(year);
        }
        
        // Tags
        if (album.tags && album.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'album-tags';
            album.tags.forEach(tag => {
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
        card.addEventListener('click', () => openModal(album));
        card.style.cursor = 'pointer';
        
        container.appendChild(card);
    });
}

// Filter albums based on search query
function filterAlbums(searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
        return allAlbums;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return allAlbums.filter(album => {
        const titleMatch = album.title.toLowerCase().includes(query);
        const authorMatch = album.author.toLowerCase().includes(query);
        const publisherMatch = album.publisher.toLowerCase().includes(query);
        const tagsMatch = album.tags && album.tags.some(tag => 
            tag.toLowerCase().includes(query)
        );
        const illustratorMatch = album.illustrator && 
            album.illustrator.toLowerCase().includes(query);
        const translatorMatch = album.translator && 
            album.translator.toLowerCase().includes(query);
        
        return titleMatch || authorMatch || publisherMatch || tagsMatch || 
               illustratorMatch || translatorMatch;
    });
}

// Sort albums
function sortAlbums(albums, sortBy) {
    const sorted = [...albums];
    
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
    
    const filtered = filterAlbums(query);
    const sorted = sortAlbums(filtered, currentSort);
    displayAlbums(sorted);
}

// Handle sort change
function handleSortChange(event) {
    currentSort = event.target.value;
    handleSearch(); // Re-apply search with new sort
}

// Open modal with album details
function openModal(album) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Build modal content
    let content = `
        <div class="modal-album-details">
            <div class="modal-album-cover">
                <img src="${album.coverImage || PLACEHOLDER_IMAGE}" 
                     alt="Copertina di ${album.title}"
                     onerror="this.src='${PLACEHOLDER_IMAGE}'">
            </div>
            <div class="modal-album-info">
                <h2>${album.title}</h2>
                <p><strong>Autore:</strong> ${album.author}</p>
    `;
    
    if (album.illustrator) {
        content += `<p><strong>Illustratore:</strong> ${album.illustrator}</p>`;
    }
    
    if (album.translator) {
        content += `<p><strong>Traduttore:</strong> ${album.translator}</p>`;
    }
    
    content += `<p><strong>Editore:</strong> ${album.publisher}</p>`;
    
    if (album.year) {
        content += `<p><strong>Anno:</strong> ${album.year}</p>`;
    }
    
    if (album.rating && album.rating > 0) {
        content += `<p><strong>Valutazione:</strong> ${album.rating}/5</p>`;
    }
    
    if (album.tags && album.tags.length > 0) {
        content += '<div class="modal-tags">';
        album.tags.forEach(tag => {
            content += `<span class="tag">${tag}</span>`;
        });
        content += '</div>';
    }
    
    if (album.fullDescription || album.description) {
        content += `<div class="modal-description">
            <h3>Descrizione</h3>
            <p>${album.fullDescription || album.description}</p>
        </div>`;
    }
    
    // Purchase links
    const hasLinks = album.purchaseLinks && 
        (album.purchaseLinks.amazon || album.purchaseLinks.feltrinelli || album.purchaseLinks.mondadori);
    
    if (hasLinks) {
        content += '<div class="modal-purchase-links"><h3>Dove acquistare</h3><div class="purchase-buttons">';
        
        if (album.purchaseLinks.amazon) {
            content += `<a href="${album.purchaseLinks.amazon}" target="_blank" rel="noopener noreferrer" class="purchase-link amazon">Amazon</a>`;
        }
        if (album.purchaseLinks.feltrinelli) {
            content += `<a href="${album.purchaseLinks.feltrinelli}" target="_blank" rel="noopener noreferrer" class="purchase-link feltrinelli">Feltrinelli</a>`;
        }
        if (album.purchaseLinks.mondadori) {
            content += `<a href="${album.purchaseLinks.mondadori}" target="_blank" rel="noopener noreferrer" class="purchase-link mondadori">Mondadori</a>`;
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
        // Load albums from JSON
        allAlbums = await loadDataFromJSON();
        
        // Display albums with initial random sort
        const sorted = sortAlbums(allAlbums, currentSort);
        displayAlbums(sorted);
        
        console.log(`✅ Pagina inizializzata con ${allAlbums.length} albi`);
    } catch (error) {
        console.error('❌ Errore inizializzazione pagina:', error);
        displayAlbums([]);
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
        if (event.key === 'albums') {
            console.log('🔄 Albums aggiornati, ricarico...');
            initializePage();
        }
    });
});
