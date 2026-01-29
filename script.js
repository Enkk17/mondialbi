// Dati degli albi illustrati di default
const defaultAlbums = [
    {
        id: 1,
        title: "Il Piccolo Principe",
        author: "Antoine de Saint-Exupéry",
        translator: "Nini Bompiani Bregoli",
        illustrator: "Antoine de Saint-Exupéry",
        publisher: "Bompiani",
        year: 1943,
        rating: 4.8,
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        tags: ["classico", "filosofia", "avventura", "amicizia"],
        description: "Un racconto poetico e filosofico che narra le avventure di un piccolo principe proveniente da un asteroide.",
        fullDescription: "Il Piccolo Principe è un'opera che ha incantato lettori di tutte le età. Attraverso gli occhi innocenti del protagonista, esploriamo temi profondi come l'amore, l'amicizia, la solitudine e il significato della vita. Le illustrazioni originali dell'autore accompagnano magistralmente questo viaggio attraverso pianeti e incontri indimenticabili.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    },
    {
        id: 2,
        title: "Nel Paese dei Mostri Selvaggi",
        author: "Maurice Sendak",
        translator: "Antonio Porta",
        illustrator: "Maurice Sendak",
        publisher: "Babalibri",
        year: 1963,
        rating: 4.7,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        tags: ["immaginazione", "mostri", "emozioni", "famiglia"],
        description: "La storia di Max e il suo viaggio immaginario nel regno dei mostri selvaggi.",
        fullDescription: "Quando Max viene mandato a letto senza cena, la sua camera si trasforma in una foresta e poi in un oceano che lo porta nel Paese dei Mostri Selvaggi. Lì diventa il loro re, ma presto sente la nostalgia di casa. Un classico che esplora le emozioni infantili, la rabbia, l'immaginazione e il ritorno alla sicurezza dell'amore familiare.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    },
    {
        id: 3,
        title: "Il Piccolo Bruco Maisazio",
        author: "Eric Carle",
        translator: "Laura Bongiovanni",
        illustrator: "Eric Carle",
        publisher: "Mondadori",
        year: 1969,
        rating: 4.9,
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
        tags: ["natura", "educativo", "colori", "crescita"],
        description: "Un bruco molto affamato mangia tutto ciò che trova prima di trasformarsi in una bellissima farfalla.",
        fullDescription: "Questo albo illustrato iconico segue il viaggio di un piccolo bruco che nasce affamato e mangia attraverso una varietà di cibi durante la settimana. Le illustrazioni vivaci e colorate di Eric Carle, create con la sua tecnica del collage, rendono questo libro un capolavoro visivo che insegna ai bambini i giorni della settimana, i numeri e il ciclo di vita delle farfalle.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    },
    {
        id: 4,
        title: "Gatto con gli Stivali",
        author: "Charles Perrault",
        translator: "",
        illustrator: "",
        publisher: "EL",
        year: 1697,
        rating: 4.5,
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        tags: ["fiaba", "classico", "astuzia", "magia"],
        description: "Le avventure di un gatto astuto che aiuta il suo padrone a diventare ricco e potente.",
        fullDescription: "Un povero mugnaio lascia in eredità ai suoi tre figli un mulino, un asino e un gatto. Il figlio più giovane, che riceve solo il gatto, pensa di essere sfortunato, ma il gatto si rivela essere straordinariamente intelligente. Con l'astuzia e un paio di stivali, il gatto trasforma il suo padrone in un ricco marchese e conquista il cuore della principessa.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    },
    {
        id: 5,
        title: "Alice nel Paese delle Meraviglie",
        author: "Lewis Carroll",
        translator: "Masolino D'Amico",
        illustrator: "John Tenniel",
        publisher: "Rizzoli",
        year: 1865,
        rating: 4.6,
        coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
        tags: ["fantasia", "avventura", "nonsense", "classico"],
        description: "Le straordinarie avventure di Alice in un mondo fantastico pieno di creature bizzarre.",
        fullDescription: "Seguendo un coniglio bianco sempre di fretta, Alice cade in una tana che la porta in un mondo magico e surreale. Incontra personaggi indimenticabili come il Cappellaio Matto, lo Stregatto, la Regina di Cuori e molti altri. Un viaggio attraverso logica e nonsense che ha affascinato generazioni di lettori con le sue illustrazioni fantasiose e la sua narrativa unica.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    },
    {
        id: 6,
        title: "Il Gruffalo",
        author: "Julia Donaldson",
        translator: "Delia Bencini",
        illustrator: "Axel Scheffler",
        publisher: "Emme Edizioni",
        year: 1999,
        rating: 4.8,
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
        tags: ["avventura", "coraggio", "animali", "umorismo"],
        description: "Un topo coraggioso inventa un mostro terrificante per spaventare i suoi predatori.",
        fullDescription: "Un piccolo topo furbo cammina nella foresta oscura, dove vari predatori vorrebbero mangiarlo. Per salvarsi, inventa la storia del Gruffalo, un mostro terribile che lo protegge. Ma cosa succede quando il Gruffalo si rivela essere reale? Un racconto brillante su intelligenza, coraggio e astuzia, accompagnato da illustrazioni vivaci e coinvolgenti.",
        purchaseLinks: {
            amazon: "",
            feltrinelli: "",
            mondadori: ""
        }
    }
];

// Funzione per ottenere gli albi da localStorage o usare quelli di default
function getAlbums() {
    const stored = localStorage.getItem('albums');
    if (stored) {
        return JSON.parse(stored);
    }
    // Se non ci sono dati salvati, usa gli albi di default
    localStorage.setItem('albums', JSON.stringify(defaultAlbums));
    return defaultAlbums;
}

// Funzione per trasformare i dati Airtable nel formato utilizzato dall'app
function transformAirtableData(records) {
    return records.map(record => {
        const fields = record.fields;
        return {
            id: record.id,
            title: fields.Title || fields.Titolo || '',
            author: fields.Author || fields.Autore || '',
            translator: fields.Translator || fields.Traduttore || '',
            illustrator: fields.Illustrator || fields.Illustratore || '',
            publisher: fields.Publisher || fields.Editore || fields['Casa Editrice'] || '',
            year: fields.Year || fields.Anno || 0,
            rating: fields.Rating || fields.Valutazione || 0,
            coverImage: fields.CoverImage || fields['Cover Image'] || fields.Copertina || '',
            tags: fields.Tags || fields.Tag || [],
            description: fields.Description || fields.Descrizione || '',
            fullDescription: fields['Full Description'] || fields['Descrizione Completa'] || fields.Description || fields.Descrizione || '',
            purchaseLinks: {
                amazon: fields.AmazonLink || fields['Amazon Link'] || fields['Link Amazon'] || '',
                feltrinelli: fields.FeltrinelliLink || fields['Feltrinelli Link'] || fields['Link Feltrinelli'] || '',
                mondadori: fields.MondadoriLink || fields['Mondadori Link'] || fields['Link Mondadori'] || ''
            }
        };
    });
}

// Funzione asincrona per caricare i dati dal file data.json
async function loadDataFromJSON() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Trasforma i dati Airtable nel formato dell'app
        const transformedAlbums = transformAirtableData(data);
        
        // Salva i dati in localStorage per uso offline
        localStorage.setItem('albums', JSON.stringify(transformedAlbums));
        
        return transformedAlbums;
    } catch (error) {
        console.log('Could not load data.json, using default/cached data:', error.message);
        // Se non riesce a caricare data.json, usa i dati in localStorage o default
        return getAlbums();
    }
}

// Variabile globale per gli albi correnti
let albums = [];

// Funzione per mescolare (randomizzare) un array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Funzione per creare le card degli albi
function createAlbumCards(albumsToDisplay = albums) {
    const container = document.getElementById('albums-container');
    if (!container) return; // Se non siamo sulla pagina principale, esci
    
    container.innerHTML = ''; // Pulisci il contenitore
    
    if (albumsToDisplay.length === 0) {
        container.innerHTML = '<p class="no-results">Nessun albo trovato. Prova con un\'altra ricerca.</p>';
        return;
    }
    
    albumsToDisplay.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Visualizza dettagli di ${album.title}`);
        card.onclick = () => openModal(album);
        card.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(album);
            }
        };
        
        card.innerHTML = `
            <div class="album-cover">
                <img src="${album.coverImage}" alt="Copertina di ${album.title}" onerror="this.parentElement.innerHTML='<div class=\\'cover-placeholder\\'><p>${album.title}</p></div>'">
            </div>
            <div class="album-info">
                <h3>${album.title}</h3>
                <p class="author">di ${album.author}</p>
                <p class="publisher">${album.publisher}</p>
                <p class="description">${album.description}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Funzione per ordinare gli albi
function sortAlbums(sortBy) {
    let sorted = [...albums];
    
    switch(sortBy) {
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'it'));
            break;
        case 'author':
            sorted.sort((a, b) => a.author.localeCompare(b.author, 'it'));
            break;
        case 'year':
            sorted.sort((a, b) => b.year - a.year); // Più recenti prima
            break;
        case 'random':
        default:
            sorted = shuffleArray(sorted);
            break;
    }
    
    createAlbumCards(sorted);
}

// Funzione per cercare gli albi
function searchAlbums(query) {
    if (!query.trim()) {
        // Se la query è vuota, applica l'ordinamento corrente
        const sortSelect = document.getElementById('sort-select');
        const sortBy = sortSelect ? sortSelect.value : 'random';
        sortAlbums(sortBy);
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    const filtered = albums.filter(album => {
        // Cerca nel titolo
        if (album.title && album.title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Cerca nell'autore
        if (album.author && album.author.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Cerca nella casa editrice
        if (album.publisher && album.publisher.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Cerca nei tag
        if (album.tags && Array.isArray(album.tags) && album.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
            return true;
        }
        
        return false;
    });
    
    createAlbumCards(filtered);
}

// Funzione per generare le stelle per il rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '⭐';
    }
    if (hasHalfStar) {
        starsHTML += '½';
    }
    
    return starsHTML;
}

// Funzione per aprire il modal con i dettagli dell'albo
function openModal(album) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const purchaseLinksHTML = `
        <div class="purchase-links">
            <h3>Acquista questo libro</h3>
            <div class="buy-buttons">
                ${album.purchaseLinks.amazon ? `<a href="${album.purchaseLinks.amazon}" target="_blank" rel="noopener noreferrer" class="buy-button amazon">Amazon</a>` : '<a href="#" class="buy-button amazon disabled" onclick="return false;">Amazon</a>'}
                ${album.purchaseLinks.feltrinelli ? `<a href="${album.purchaseLinks.feltrinelli}" target="_blank" rel="noopener noreferrer" class="buy-button feltrinelli">Feltrinelli</a>` : '<a href="#" class="buy-button feltrinelli disabled" onclick="return false;">Feltrinelli</a>'}
                ${album.purchaseLinks.mondadori ? `<a href="${album.purchaseLinks.mondadori}" target="_blank" rel="noopener noreferrer" class="buy-button mondadori">Mondadori</a>` : '<a href="#" class="buy-button mondadori disabled" onclick="return false;">Mondadori</a>'}
            </div>
            <p class="affiliate-notice">I link potrebbero contenere codici affiliati</p>
        </div>
    `;
    
    modalBody.innerHTML = `
        <div class="modal-album-cover">
            <img src="${album.coverImage}" alt="Copertina di ${album.title}" onerror="this.parentElement.innerHTML='<div class=\\'cover-placeholder\\'><p>${album.title}</p></div>'">
        </div>
        <h2 id="modal-title">${album.title}</h2>
        <p class="author">di ${album.author}</p>
        <div class="album-meta">
            ${album.translator ? `<p><strong>Traduttore:</strong> ${album.translator}</p>` : ''}
            ${album.illustrator ? `<p><strong>Illustratore:</strong> ${album.illustrator}</p>` : ''}
            <p><strong>Casa Editrice:</strong> ${album.publisher}</p>
            <p><strong>Anno di Pubblicazione:</strong> ${album.year}</p>
            <div class="rating">
                <strong>Valutazione:</strong> ${generateStars(album.rating)} <span class="rating-number">${album.rating}/5</span>
            </div>
        </div>
        <p id="modal-description">${album.fullDescription}</p>
        ${purchaseLinksHTML}
    `;
    
    modal.style.display = 'block';
    
    // Focus on close button for accessibility
    setTimeout(() => {
        document.querySelector('.close').focus();
    }, 100);
}

// Funzione per chiudere il modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Funzione per mostrare il disclaimer sui referral link
function showReferralDisclaimer() {
    try {
        const disclaimerShown = localStorage.getItem('referralDisclaimerShown');
        
        if (!disclaimerShown) {
            const disclaimer = document.getElementById('referral-disclaimer');
            if (disclaimer) {
                setTimeout(() => {
                    disclaimer.style.display = 'block';
                    try {
                        localStorage.setItem('referralDisclaimerShown', 'true');
                    } catch (e) {
                        // Silently fail if localStorage is not available
                        console.log('localStorage not available');
                    }
                }, 2000); // Mostra dopo 2 secondi
            }
        }
    } catch (e) {
        // If localStorage is not available, just show the disclaimer
        const disclaimer = document.getElementById('referral-disclaimer');
        if (disclaimer) {
            setTimeout(() => {
                disclaimer.style.display = 'block';
            }, 2000);
        }
    }
}

// Funzione per chiudere il disclaimer
function closeDisclaimer() {
    const disclaimer = document.getElementById('referral-disclaimer');
    if (disclaimer) {
        disclaimer.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Mostra il disclaimer sui referral link
    showReferralDisclaimer();
    
    // Carica gli albi dal file data.json (o da localStorage/default se non disponibile)
    albums = await loadDataFromJSON();
    const randomizedAlbums = shuffleArray(albums);
    createAlbumCards(randomizedAlbums);
    
    // Listen for localStorage changes from other tabs/windows (e.g., admin panel)
    window.addEventListener('storage', (e) => {
        if (e.key === 'albums') {
            albums = getAlbums();
            const sortSelect = document.getElementById('sort-select');
            const sortBy = sortSelect ? sortSelect.value : 'random';
            sortAlbums(sortBy);
        }
    });
    
    // Gestione ordinamento
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortAlbums(e.target.value);
        });
    }
    
    // Gestione della barra di ricerca
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        // Ricerca quando si clicca il bottone
        searchButton.addEventListener('click', () => {
            searchAlbums(searchInput.value);
        });
        
        // Ricerca quando si preme Invio
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchAlbums(searchInput.value);
            }
        });
        
        // Ricerca in tempo reale mentre si digita (con debounce)
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchAlbums(searchInput.value);
            }, 300);
        });
    }
    
    // Gestione chiusura modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
    
    // Gestione chiusura disclaimer
    const disclaimerClose = document.querySelector('.disclaimer-close');
    const disclaimerButton = document.querySelector('.disclaimer-button');
    if (disclaimerClose) {
        disclaimerClose.onclick = closeDisclaimer;
    }
    if (disclaimerButton) {
        disclaimerButton.onclick = closeDisclaimer;
    }
    
    // Chiudi modal cliccando fuori dal contenuto
    window.onclick = (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Chiudi modal con il tasto ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});
