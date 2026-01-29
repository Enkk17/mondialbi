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
        
        card.innerHTML = `
            <div class="admin-album-cover">
                <img src="${album.coverImage}" alt="Copertina di ${album.title}" onerror="this.src='https://via.placeholder.com/300x400?text=Copertina+Non+Disponibile'">
            </div>
            <div class="admin-album-info">
                <h3>${album.title}</h3>
                <p><strong>Autore:</strong> ${album.author}</p>
                <p><strong>Editore:</strong> ${album.publisher}</p>
                <p><strong>Anno:</strong> ${album.year}</p>
                <p><strong>Rating:</strong> ${album.rating}/5</p>
                <div class="admin-album-actions">
                    <button class="btn-edit" onclick="editAlbum(${album.id})">✏️ Modifica</button>
                    <button class="btn-delete" onclick="confirmDeleteAlbum(${album.id})">🗑️ Elimina</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Get albums from localStorage or default data
function getAlbums() {
    const stored = localStorage.getItem('albums');
    if (stored) {
        return JSON.parse(stored);
    }
    // If no stored data, use the default albums from script.js
    if (typeof albums !== 'undefined') {
        localStorage.setItem('albums', JSON.stringify(albums));
        return albums;
    }
    return [];
}

// Save albums to localStorage
function saveAlbums(albumsData) {
    localStorage.setItem('albums', JSON.stringify(albumsData));
    // Trigger a custom event to notify the main page
    window.dispatchEvent(new Event('albumsUpdated'));
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

// Save album (add or update)
function saveAlbum(event) {
    event.preventDefault();
    
    const albumId = document.getElementById('album-id').value;
    const currentAlbums = getAlbums();
    
    const albumData = {
        id: albumId ? parseInt(albumId) : getNextAlbumId(currentAlbums),
        title: document.getElementById('album-title').value.trim(),
        author: document.getElementById('album-author').value.trim(),
        publisher: document.getElementById('album-publisher').value.trim(),
        year: parseInt(document.getElementById('album-year').value),
        rating: parseFloat(document.getElementById('album-rating').value),
        coverImage: document.getElementById('album-cover').value.trim(),
        tags: document.getElementById('album-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
        description: document.getElementById('album-description').value.trim(),
        fullDescription: document.getElementById('album-full-description').value.trim(),
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
