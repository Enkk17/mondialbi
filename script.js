// Dati degli albi illustrati
const albums = [
    {
        id: 1,
        title: "Il Piccolo Principe",
        author: "Antoine de Saint-Exupéry",
        publisher: "Bompiani",
        tags: ["classico", "filosofia", "avventura", "amicizia"],
        description: "Un racconto poetico e filosofico che narra le avventure di un piccolo principe proveniente da un asteroide.",
        fullDescription: "Il Piccolo Principe è un'opera che ha incantato lettori di tutte le età. Attraverso gli occhi innocenti del protagonista, esploriamo temi profondi come l'amore, l'amicizia, la solitudine e il significato della vita. Le illustrazioni originali dell'autore accompagnano magistralmente questo viaggio attraverso pianeti e incontri indimenticabili.",
        icon: "👑"
    },
    {
        id: 2,
        title: "Nel Paese dei Mostri Selvaggi",
        author: "Maurice Sendak",
        publisher: "Babalibri",
        tags: ["immaginazione", "mostri", "emozioni", "famiglia"],
        description: "La storia di Max e il suo viaggio immaginario nel regno dei mostri selvaggi.",
        fullDescription: "Quando Max viene mandato a letto senza cena, la sua camera si trasforma in una foresta e poi in un oceano che lo porta nel Paese dei Mostri Selvaggi. Lì diventa il loro re, ma presto sente la nostalgia di casa. Un classico che esplora le emozioni infantili, la rabbia, l'immaginazione e il ritorno alla sicurezza dell'amore familiare.",
        icon: "🐺"
    },
    {
        id: 3,
        title: "Il Piccolo Bruco Maisazio",
        author: "Eric Carle",
        publisher: "Mondadori",
        tags: ["natura", "educativo", "colori", "crescita"],
        description: "Un bruco molto affamato mangia tutto ciò che trova prima di trasformarsi in una bellissima farfalla.",
        fullDescription: "Questo albo illustrato iconico segue il viaggio di un piccolo bruco che nasce affamato e mangia attraverso una varietà di cibi durante la settimana. Le illustrazioni vivaci e colorate di Eric Carle, create con la sua tecnica del collage, rendono questo libro un capolavoro visivo che insegna ai bambini i giorni della settimana, i numeri e il ciclo di vita delle farfalle.",
        icon: "🐛"
    },
    {
        id: 4,
        title: "Gatto con gli Stivali",
        author: "Charles Perrault",
        publisher: "EL",
        tags: ["fiaba", "classico", "astuzia", "magia"],
        description: "Le avventure di un gatto astuto che aiuta il suo padrone a diventare ricco e potente.",
        fullDescription: "Un povero mugnaio lascia in eredità ai suoi tre figli un mulino, un asino e un gatto. Il figlio più giovane, che riceve solo il gatto, pensa di essere sfortunato, ma il gatto si rivela essere straordinariamente intelligente. Con l'astuzia e un paio di stivali, il gatto trasforma il suo padrone in un ricco marchese e conquista il cuore della principessa.",
        icon: "🐱"
    },
    {
        id: 5,
        title: "Alice nel Paese delle Meraviglie",
        author: "Lewis Carroll",
        publisher: "Rizzoli",
        tags: ["fantasia", "avventura", "nonsense", "classico"],
        description: "Le straordinarie avventure di Alice in un mondo fantastico pieno di creature bizzarre.",
        fullDescription: "Seguendo un coniglio bianco sempre di fretta, Alice cade in una tana che la porta in un mondo magico e surreale. Incontra personaggi indimenticabili come il Cappellaio Matto, lo Stregatto, la Regina di Cuori e molti altri. Un viaggio attraverso logica e nonsense che ha affascinato generazioni di lettori con le sue illustrazioni fantasiose e la sua narrativa unica.",
        icon: "🎩"
    },
    {
        id: 6,
        title: "Il Gruffalo",
        author: "Julia Donaldson",
        publisher: "Emme Edizioni",
        tags: ["avventura", "coraggio", "animali", "umorismo"],
        description: "Un topo coraggioso inventa un mostro terrificante per spaventare i suoi predatori.",
        fullDescription: "Un piccolo topo furbo cammina nella foresta oscura, dove vari predatori vorrebbero mangiarlo. Per salvarsi, inventa la storia del Gruffalo, un mostro terribile che lo protegge. Ma cosa succede quando il Gruffalo si rivela essere reale? Un racconto brillante su intelligenza, coraggio e astuzia, accompagnato da illustrazioni vivaci e coinvolgenti.",
        icon: "🐭"
    }
];

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
            <div class="album-cover">${album.icon}</div>
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

// Funzione per cercare gli albi
function searchAlbums(query) {
    if (!query.trim()) {
        // Se la query è vuota, mostra tutti gli albi in ordine casuale
        const randomized = shuffleArray(albums);
        createAlbumCards(randomized);
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

// Funzione per aprire il modal con i dettagli dell'albo
function openModal(album) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-album-cover">${album.icon}</div>
        <h2 id="modal-title">${album.title}</h2>
        <p class="author">di ${album.author}</p>
        <p id="modal-description">${album.fullDescription}</p>
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carica gli albi in ordine casuale
    const randomizedAlbums = shuffleArray(albums);
    createAlbumCards(randomizedAlbums);
    
    // Gestione della barra di ricerca
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
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
    
    // Gestione chiusura modal
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = closeModal;
    
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
