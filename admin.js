// Admin password (in a real application, this would be handled server-side)
const ADMIN_PASSWORD = 'admin123';

// Check if user is already logged in
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminSection();
    }
}

// Show login section
function showLoginSection() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('admin-section').style.display = 'none';
    sessionStorage.removeItem('adminLoggedIn');
}

// Show admin section
function showAdminSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    sessionStorage.setItem('adminLoggedIn', 'true');
    loadAdminAlbums();
}

// Handle login
function handleLogin() {
    const passwordInput = document.getElementById('admin-password');
    const errorElement = document.getElementById('login-error');
    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {
        showAdminSection();
    } else {
        errorElement.textContent = '❌ Password errata. Riprova.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Handle logout
function handleLogout() {
    showLoginSection();
}

// Load albums in admin panel
function loadAdminAlbums() {
    const currentAlbums = getAlbums();
    const container = document.getElementById('admin-albums-list');
    container.innerHTML = '';

    if (currentAlbums.length === 0) {
        container.innerHTML = '<p class="no-results">Nessun albo presente. Aggiungi il primo albo!</p>';
        return;
    }

    currentAlbums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'admin-album-card';
        
        // Create elements safely to prevent XSS
        const cover = document.createElement('div');
        cover.className = 'admin-album-cover';
        const img = document.createElement('img');
        img.src = album.coverImage;
        img.alt = `Copertina di ${album.title}`;
        img.onerror = () => img.src = 'https://via.placeholder.com/300x400?text=Copertina+Non+Disponibile';
        cover.appendChild(img);
        
        const info = document.createElement('div');
        info.className = 'admin-album-info';
        
        const title = document.createElement('h3');
        title.textContent = album.title;
        
        const author = document.createElement('p');
        author.innerHTML = '<strong>Autore:</strong> ';
        author.appendChild(document.createTextNode(album.author));
        
        const translator = document.createElement('p');
        if (album.translator) {
            translator.innerHTML = '<strong>Traduttore:</strong> ';
            translator.appendChild(document.createTextNode(album.translator));
        }
        
        const illustrator = document.createElement('p');
        if (album.illustrator) {
            illustrator.innerHTML = '<strong>Illustratore:</strong> ';
            illustrator.appendChild(document.createTextNode(album.illustrator));
        }
        
        const publisher = document.createElement('p');
        publisher.innerHTML = '<strong>Editore:</strong> ';
        publisher.appendChild(document.createTextNode(album.publisher));
        
        const year = document.createElement('p');
        year.innerHTML = '<strong>Anno:</strong> ';
        year.appendChild(document.createTextNode(album.year));
        
        const rating = document.createElement('p');
        rating.innerHTML = '<strong>Rating:</strong> ';
        rating.appendChild(document.createTextNode(`${album.rating}/5`));
        
        const actions = document.createElement('div');
        actions.className = 'admin-album-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️ Modifica';
        editBtn.onclick = () => editAlbum(album.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️ Elimina';
        deleteBtn.onclick = () => confirmDeleteAlbum(album.id);
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        info.appendChild(title);
        info.appendChild(author);
        if (album.translator) {
            info.appendChild(translator);
        }
        if (album.illustrator) {
            info.appendChild(illustrator);
        }
        info.appendChild(publisher);
        info.appendChild(year);
        info.appendChild(rating);
        info.appendChild(actions);
        
        card.appendChild(cover);
        card.appendChild(info);
        
        container.appendChild(card);
    });
}

// Get albums from localStorage or default data
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

// Save albums to localStorage
function saveAlbums(albumsData) {
    localStorage.setItem('albums', JSON.stringify(albumsData));
    // Note: storage event will automatically notify other tabs/windows
}

// Open modal to add new album
function openAddAlbumModal() {
    const modal = document.getElementById('album-modal');
    const modalTitle = document.getElementById('album-modal-title');
    const form = document.getElementById('album-form');
    
    modalTitle.textContent = 'Aggiungi Nuovo Albo';
    form.reset();
    document.getElementById('album-id').value = '';
    
    modal.style.display = 'block';
}

// Open modal to edit album
function editAlbum(albumId) {
    const currentAlbums = getAlbums();
    const album = currentAlbums.find(a => a.id === albumId);
    
    if (!album) {
        alert('Albo non trovato!');
        return;
    }
    
    const modal = document.getElementById('album-modal');
    const modalTitle = document.getElementById('album-modal-title');
    
    modalTitle.textContent = 'Modifica Albo';
    
    // Fill form with album data
    document.getElementById('album-id').value = album.id;
    document.getElementById('album-title').value = album.title;
    document.getElementById('album-author').value = album.author;
    document.getElementById('album-translator').value = album.translator || '';
    document.getElementById('album-illustrator').value = album.illustrator || '';
    document.getElementById('album-publisher').value = album.publisher;
    document.getElementById('album-year').value = album.year;
    document.getElementById('album-rating').value = album.rating;
    document.getElementById('album-cover').value = album.coverImage;
    document.getElementById('album-tags').value = album.tags ? album.tags.join(', ') : '';
    document.getElementById('album-description').value = album.description;
    document.getElementById('album-full-description').value = album.fullDescription;
    document.getElementById('album-amazon').value = album.purchaseLinks?.amazon || '';
    document.getElementById('album-feltrinelli').value = album.purchaseLinks?.feltrinelli || '';
    document.getElementById('album-mondadori').value = album.purchaseLinks?.mondadori || '';
    
    modal.style.display = 'block';
}

// Helper function to sanitize text input
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save album (add or update)
function saveAlbum(event) {
    event.preventDefault();
    
    const albumId = document.getElementById('album-id').value;
    const currentAlbums = getAlbums();
    
    const albumData = {
        id: albumId ? parseInt(albumId) : getNextAlbumId(currentAlbums),
        title: sanitizeText(document.getElementById('album-title').value.trim()),
        author: sanitizeText(document.getElementById('album-author').value.trim()),
        translator: sanitizeText(document.getElementById('album-translator').value.trim()),
        illustrator: sanitizeText(document.getElementById('album-illustrator').value.trim()),
        publisher: sanitizeText(document.getElementById('album-publisher').value.trim()),
        year: parseInt(document.getElementById('album-year').value),
        rating: parseFloat(document.getElementById('album-rating').value),
        coverImage: document.getElementById('album-cover').value.trim(),
        tags: document.getElementById('album-tags').value
            .split(',')
            .map(tag => sanitizeText(tag.trim()))
            .filter(tag => tag.length > 0),
        description: sanitizeText(document.getElementById('album-description').value.trim()),
        fullDescription: sanitizeText(document.getElementById('album-full-description').value.trim()),
        purchaseLinks: {
            amazon: document.getElementById('album-amazon').value.trim(),
            feltrinelli: document.getElementById('album-feltrinelli').value.trim(),
            mondadori: document.getElementById('album-mondadori').value.trim()
        }
    };
    
    let updatedAlbums;
    if (albumId) {
        // Update existing album
        updatedAlbums = currentAlbums.map(album => 
            album.id === albumData.id ? albumData : album
        );
    } else {
        // Add new album
        updatedAlbums = [...currentAlbums, albumData];
    }
    
    saveAlbums(updatedAlbums);
    closeAlbumModal();
    loadAdminAlbums();
    
    // Show success message
    alert(albumId ? 'Albo modificato con successo!' : 'Albo aggiunto con successo!');
}

// Get next album ID
function getNextAlbumId(currentAlbums) {
    if (currentAlbums.length === 0) return 1;
    const maxId = Math.max(...currentAlbums.map(a => a.id));
    return maxId + 1;
}

// Confirm delete album
function confirmDeleteAlbum(albumId) {
    const currentAlbums = getAlbums();
    const album = currentAlbums.find(a => a.id === albumId);
    
    if (!album) {
        alert('Albo non trovato!');
        return;
    }
    
    const modal = document.getElementById('confirm-modal');
    const titleElement = document.querySelector('.confirm-album-title');
    
    titleElement.textContent = album.title;
    modal.style.display = 'block';
    
    // Store album ID for deletion
    modal.dataset.albumId = albumId;
}

// Delete album
function deleteAlbum() {
    const modal = document.getElementById('confirm-modal');
    const albumId = parseInt(modal.dataset.albumId);
    
    const currentAlbums = getAlbums();
    const updatedAlbums = currentAlbums.filter(album => album.id !== albumId);
    
    saveAlbums(updatedAlbums);
    closeConfirmModal();
    loadAdminAlbums();
    
    alert('Albo eliminato con successo!');
}

// Close album modal
function closeAlbumModal() {
    const modal = document.getElementById('album-modal');
    modal.style.display = 'none';
}

// Close confirm modal
function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    modal.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize admin functionality if we're on the admin page
    if (document.getElementById('login-section')) {
        checkAdminAuth();
        
        // Login
        const loginButton = document.getElementById('login-button');
        const passwordInput = document.getElementById('admin-password');
        
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
        
        // Logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
        
        // Add album button
        const addAlbumButton = document.getElementById('add-album-button');
        if (addAlbumButton) {
            addAlbumButton.addEventListener('click', openAddAlbumModal);
        }
        
        // Album form
        const albumForm = document.getElementById('album-form');
        if (albumForm) {
            albumForm.addEventListener('submit', saveAlbum);
        }
        
        // Cancel button
        const cancelButton = document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.addEventListener('click', closeAlbumModal);
        }
        
        // Confirm delete
        const confirmDeleteButton = document.getElementById('confirm-delete-button');
        if (confirmDeleteButton) {
            confirmDeleteButton.addEventListener('click', deleteAlbum);
        }
        
        // Cancel delete
        const cancelDeleteButton = document.getElementById('cancel-delete-button');
        if (cancelDeleteButton) {
            cancelDeleteButton.addEventListener('click', closeConfirmModal);
        }
        
        // Close modals
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (event) => {
            const albumModal = document.getElementById('album-modal');
            const confirmModal = document.getElementById('confirm-modal');
            
            if (event.target === albumModal) {
                closeAlbumModal();
            }
            if (event.target === confirmModal) {
                closeConfirmModal();
            }
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAlbumModal();
                closeConfirmModal();
            }
        });
    }
});
