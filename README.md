# MondialBi - Albi Illustrati

Un sito web dedicato alla collezione e visualizzazione di albi illustrati per bambini e adulti.

## Descrizione

MondialBi è una galleria online che presenta una collezione curata di albi illustrati classici e moderni. Il sito offre un'esperienza visiva coinvolgente con:

- **Interfaccia responsiva**: ottimizzata per desktop, tablet e dispositivi mobili
- **Design moderno**: con animazioni fluide e layout accattivante
- **Galleria interattiva**: click su ogni albo per visualizzare maggiori dettagli
- **Modal dinamico**: visualizzazione dettagliata di ogni albo illustrato
- **Ricerca avanzata**: cerca per titolo, autore, casa editrice o tag
- **Visualizzazione casuale**: gli albi vengono mostrati in ordine casuale ad ogni caricamento

## Caratteristiche

- 📚 Collezione di albi illustrati famosi
- 🔍 Barra di ricerca con filtri multipli (titolo, autore, casa editrice, tag)
- 🎲 Ordine casuale degli albi per scoprire sempre qualcosa di nuovo
- 🎨 Design colorato e accattivante
- 📱 Completamente responsivo
- ⚡ Interfaccia veloce e leggera
- 🖱️ Interazioni intuitive
- ♿ Accessibile con supporto keyboard e screen reader

## Come Utilizzare

1. Apri il file `index.html` in un browser web moderno
2. Usa la barra di ricerca per trovare albi per:
   - Titolo (es. "Piccolo Principe")
   - Autore (es. "Eric Carle")
   - Casa editrice (es. "Mondadori")
   - Tag (es. "classico", "avventura", "natura")
3. Clicca su qualsiasi albo per leggere la descrizione completa
4. Chiudi il dettaglio cliccando sulla X, fuori dal modal o premendo ESC
5. Cancella il testo di ricerca per vedere tutti gli albi in ordine casuale

## Struttura del Progetto

```
mondialbi/
├── index.html      # Pagina principale HTML
├── styles.css      # Stili CSS
├── script.js       # Logica JavaScript
└── README.md       # Documentazione
```

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

Per aggiungere nuovi albi, modifica l'array `albums` nel file `script.js`:

```javascript
const albums = [
    {
        id: 1,
        title: "Titolo dell'albo",
        author: "Nome Autore",
        publisher: "Casa Editrice",
        tags: ["tag1", "tag2", "tag3"],
        description: "Breve descrizione",
        fullDescription: "Descrizione completa",
        icon: "🎨" // Emoji rappresentativa
    },
    // ... altri albi
];
```

### Tag Disponibili

I tag aiutano a categorizzare gli albi. Esempi di tag utilizzati:
- Genere: `classico`, `fiaba`, `fantasia`
- Temi: `avventura`, `amicizia`, `famiglia`, `crescita`
- Caratteristiche: `educativo`, `umorismo`, `emozioni`, `natura`

## Funzionalità di Ricerca

La ricerca è **case-insensitive** e cerca in tempo reale mentre digiti:
- **Titolo**: cerca nel titolo dell'albo
- **Autore**: cerca nel nome dell'autore
- **Casa Editrice**: cerca nel nome della casa editrice
- **Tag**: cerca tra i tag associati all'albo

## Licenza

© 2026 MondialBi - Tutti i diritti riservati