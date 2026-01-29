# MondialBi - Albi Illustrati

Un sito web dedicato alla collezione e visualizzazione di albi illustrati per bambini e adulti.

## Descrizione

MondialBi è una galleria online che presenta una collezione curata di albi illustrati classici e moderni. Il sito offre un'esperienza visiva coinvolgente con:

- **Interfaccia responsiva**: ottimizzata per desktop, tablet e dispositivi mobili
- **Design moderno**: con animazioni fluide e layout accattivante
- **Galleria interattiva**: click su ogni albo per visualizzare maggiori dettagli
- **Modal dinamico**: visualizzazione dettagliata di ogni albo illustrato

## Caratteristiche

- 📚 Collezione di albi illustrati famosi
- 🎨 Design colorato e accattivante
- 📱 Completamente responsivo
- ⚡ Interfaccia veloce e leggera
- 🖱️ Interazioni intuitive

## Come Utilizzare

1. Apri il file `index.html` in un browser web moderno
2. Esplora la galleria degli albi illustrati
3. Clicca su qualsiasi albo per leggere la descrizione completa
4. Chiudi il dettaglio cliccando sulla X, fuori dal modal o premendo ESC

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

1. Il Piccolo Principe
2. Nel Paese dei Mostri Selvaggi
3. La Piccola Brucola Mangiona
4. Gatto con gli Stivali
5. Alice nel Paese delle Meraviglie
6. Il Gruffalo

## Personalizzazione

Per aggiungere nuovi albi, modifica l'array `albums` nel file `script.js`:

```javascript
const albums = [
    {
        id: 1,
        title: "Titolo dell'albo",
        author: "Nome Autore",
        description: "Breve descrizione",
        fullDescription: "Descrizione completa",
        icon: "🎨" // Emoji rappresentativa
    },
    // ... altri albi
];
```

## Licenza

© 2026 MondialBi - Tutti i diritti riservati