# MondialBi - Albi Illustrati

Un sito web dedicato alla collezione e visualizzazione di albi illustrati per bambini e adulti.

## Descrizione

MondialBi è una galleria online che presenta una collezione curata di albi illustrati classici e moderni. Il sito offre un'esperienza visiva coinvolgente con:

- **Interfaccia responsiva**: ottimizzata per desktop, tablet e dispositivi mobili
- **Design moderno**: con animazioni fluide e layout accattivante
- **Copertine reali**: immagini delle copertine degli albi
- **Galleria interattiva**: click su ogni albo per visualizzare maggiori dettagli
- **Modal dinamico**: visualizzazione dettagliata con informazioni complete
- **Ricerca avanzata**: cerca per titolo, autore, casa editrice o tag
- **Ordinamento flessibile**: ordina per titolo, autore, anno o casuale
- **Link d'acquisto**: collegamenti diretti ai principali rivenditori online

## Caratteristiche

- 📚 Collezione di albi illustrati famosi con copertine
- 🔍 Barra di ricerca con filtri multipli (titolo, autore, casa editrice, tag)
- 📊 Ordinamento per titolo, autore, anno di pubblicazione o casuale
- ⭐ Sistema di valutazione con stelle basato sulle recensioni
- 🛒 Link d'acquisto per Amazon, Feltrinelli, Mondadori
- 🔗 Supporto link affiliati personalizzabili
- ℹ️ Disclaimer trasparente sui link affiliati
- 🎨 Design colorato e accattivante
- 📱 Completamente responsivo
- ⚡ Interfaccia veloce e leggera
- 🖱️ Interazioni intuitive
- ♿ Accessibile con supporto keyboard e screen reader
- ❓ Sezione FAQ "Il Progetto" con domande e risposte interattive

## Come Utilizzare

1. Apri il file `index.html` in un browser web moderno
2. Esplora la sezione "Il Progetto" per conoscere meglio il sito tramite le FAQ interattive
3. Usa la barra di ricerca per trovare albi per:
   - Titolo (es. "Piccolo Principe")
   - Autore (es. "Eric Carle")
   - Casa editrice (es. "Mondadori")
   - Tag (es. "classico", "avventura", "natura")
4. Usa il menu a tendina "Ordina per" per ordinare gli albi:
   - Casuale (default)
   - Titolo (A-Z)
   - Autore (A-Z)
   - Anno di Pubblicazione
5. Clicca su qualsiasi albo per visualizzare:
   - Copertina a dimensione intera
   - Descrizione completa
   - Informazioni editoriali (casa editrice, anno)
   - Valutazione con stelle
   - Link d'acquisto
6. Chiudi il dettaglio cliccando sulla X, fuori dal modal o premendo ESC

## Informazioni sugli Albi

Ogni albo include:
- **Copertina**: Immagine della copertina del libro
- **Titolo**: Nome dell'albo
- **Autore**: Autore dell'opera
- **Casa Editrice**: Publisher del libro
- **Anno di Pubblicazione**: Anno di prima pubblicazione
- **Valutazione**: Rating da 1 a 5 stelle basato sulle recensioni
- **Tags**: Categorie tematiche
- **Descrizione**: Breve anteprima
- **Descrizione Completa**: Sinossi dettagliata
- **Link d'Acquisto**: Collegamenti ai principali store online

## Struttura del Progetto

```
mondialbi/
├── index.html      # Pagina principale HTML
├── styles.css      # Stili CSS principali
├── script.js       # Logica JavaScript principale
└── README.md       # Documentazione
```

## Il Progetto - FAQ

La sezione "Il Progetto" presenta domande frequenti in stile accordion/FAQ interattivo:
- Clicca su una domanda per visualizzare la risposta
- La risposta si espande con un'animazione fluida
- Solo una risposta può essere aperta alla volta
- Supporto completo per tastiera e screen reader

## Tecnologie Utilizzate

- HTML5
- CSS3 (con Grid e Flexbox)
- JavaScript (Vanilla JS)

## Albi Presenti

1. Il Piccolo Principe - Antoine de Saint-Exupéry (Bompiani)
2. Nel Paese dei Mostri Selvaggi - Maurice Sendak (Babalibri)
3. Il Piccolo Bruco Maisazio - Eric Carle (Mondadori)
4. Gatto con gli Stivali - Charles Perrault (EL)
5. Alice nel Paese delle Meraviglie - Lewis Carroll (Rizzoli)
6. Il Gruffalo - Julia Donaldson (Emme Edizioni)

## Personalizzazione

### Aggiungere Nuovi Albi

Per aggiungere nuovi albi, modifica l'array `albums` nel file `script.js`:

```javascript
const albums = [
    {
        id: 1,
        title: "Titolo dell'albo",
        author: "Nome Autore",
        publisher: "Casa Editrice",
        year: 2023,
        rating: 4.5,
        coverImage: "URL_della_immagine_copertina",
        tags: ["tag1", "tag2", "tag3"],
        description: "Breve descrizione",
        fullDescription: "Descrizione completa",
        purchaseLinks: {
            amazon: "https://amazon.it/...",
            feltrinelli: "https://feltrinelli.it/...",
            mondadori: "https://mondadori.it/..."
        }
    },
    // ... altri albi
];
```

### Configurare Link Affiliati

Per aggiungere i tuoi link affiliati:

1. Apri il file `script.js`
2. Trova l'array `albums`
3. Per ogni albo, modifica l'oggetto `purchaseLinks`:
   - `amazon`: Inserisci il tuo link affiliato Amazon
   - `feltrinelli`: Inserisci il tuo link affiliato Feltrinelli
   - `mondadori`: Inserisci il tuo link affiliato Mondadori
4. Lascia vuoto (`""`) se non hai un link per quel rivenditore

Esempio:
```javascript
purchaseLinks: {
    amazon: "https://amazon.it/dp/XXXXX?tag=tuo-tag-affiliato",
    feltrinelli: "https://feltrinelli.it/prodotto/XXXXX?ref=tuo-ref",
    mondadori: ""  // Nessun link per questo rivenditore
}
```

### Tag Disponibili

I tag aiutano a categorizzare gli albi. Esempi di tag utilizzati:
- Genere: `classico`, `fiaba`, `fantasia`
- Temi: `avventura`, `amicizia`, `famiglia`, `crescita`
- Caratteristiche: `educativo`, `umorismo`, `emozioni`, `natura`

### Valutazioni

Le valutazioni vanno da 0 a 5 e supportano mezzi punti (es. 4.5).
Il sistema mostra automaticamente il numero corretto di stelle.

## Funzionalità di Ricerca

La ricerca è **case-insensitive** e cerca in tempo reale mentre digiti:
- **Titolo**: cerca nel titolo dell'albo
- **Autore**: cerca nel nome dell'autore
- **Casa Editrice**: cerca nel nome della casa editrice
- **Tag**: cerca tra i tag associati all'albo

## Licenza

© 2026 MondialBi - Tutti i diritti riservati