// Global variables
let currentUser = null;
let currentBusiness = null;

// Modal functionality
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Business card interactions
function showBusinessDetails(businessType) {
    const businessInfo = {
        restaurant: {
            name: "Restaurante El Buen Sabor",
            description: "Comida tradicional ecuatoriana con ambiente familiar",
            services: ["Almuerzo", "Cena", "Delivery", "Eventos"]
        },
        hospital: {
            name: "Hospital San Rafael",
            description: "Servicios médicos de calidad las 24 horas",
            services: ["Consulta General", "Emergencias", "Laboratorio", "Rayos X"]
        },
        veterinary: {
            name: "Veterinaria Mundo Animal",
            description: "Cuidado completo para tu mascota",
            services: ["Consulta", "Vacunación", "Cirugía", "Grooming"]
        },
        salon: {
            name: "Salón de Belleza Elegancia",
            description: "Servicios de belleza y cuidado personal",
            services: ["Corte", "Manicure", "Pedicure", "Tratamientos"]
        },
        bank: {
            name: "Banco Nacional",
            description: "Servicios financieros completos",
            services: ["Atención al cliente", "Préstamos", "Cuentas", "Asesoría"]
        },
        government: {
            name: "Registro Civil",
            description: "Trámites y servicios públicos",
            services: ["Cédulas", "Pasaportes", "Certificados", "Licencias"]
        }
    };

    const info = businessInfo[businessType];
    if (info) {
        alert(`${info.name}\n\n${info.description}\n\nServicios: ${info.services.join(', ')}`);
    }
}

function selectService(serviceType) {
    const services = {
        mesa2: "Mesa para 2 personas",
        mesa4: "Mesa para 4 personas", 
        takeaway: "Pedido para llevar"
    };
    
    alert(`Has seleccionado: ${services[serviceType]}`);
}

function bookService() {
    alert("¡Turno reservado exitosamente! Te enviaremos una notificación cuando sea tu momento.");
    closeModal('queueModal');
}

// Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

function goToAdminGeneral() {
    window.location.href = 'admin-general.html';
}

function goToAdminLocal() {
    window.location.href = 'admin-local.html';
}

function goToClient() {
    window.location.href = 'client.html';
}

// Login simulation
function login(userType) {
    currentUser = {
        id: Date.now(),
        type: userType,
        name: "Usuario Demo"
    };
    
    switch(userType) {
        case 'admin-general':
            navigateTo('admin-general.html');
            break;
        case 'admin-local':
            navigateTo('admin-local.html');
            break;
        case 'client':
            navigateTo('client.html');
            break;
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submissions (demo)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if it's a login form
            const userTypeSelect = this.querySelector('#userType');
            if (userTypeSelect) {
                const userType = userTypeSelect.value;
                login(userType);
                return;
            }
            
            alert('¡Formulario enviado! (Esto es solo una demostración)');
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.card, .stat-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial state for animations
    document.querySelectorAll('.card, .stat-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Update queue demo every 10 seconds
setInterval(() => {
    const waitingTimes = document.querySelectorAll('.status-waiting');
    waitingTimes.forEach(badge => {
        if (badge.textContent && badge.textContent.includes('min')) {
            const currentTime = parseInt(badge.textContent.match(/\d+/)[0]);
            if (currentTime > 0) {
                badge.textContent = badge.textContent.replace(/\d+/, currentTime - 1);
            }
        }
    });
}, 10000);

// Dashboard specific functions
function refreshData() {
    alert('Datos actualizados');
}

function exportReport() {
    alert('Reporte exportado');
}

function viewDetails(id) {
    alert(`Viendo detalles del elemento: ${id}`);
}

function editItem(id) {
    alert(`Editando elemento: ${id}`);
}

function deleteItem(id) {
    if(confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        alert(`Elemento ${id} eliminado`);
    }
}

// Sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Local Storage functions
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Sample data generators
function generateSampleBusinesses() {
    return [
        { id: 1, name: "Restaurante El Buen Sabor", type: "Restaurante", status: "Activo", customers: 45 },
        { id: 2, name: "Hospital San Rafael", type: "Hospital", status: "Activo", customers: 120 },
        { id: 3, name: "Veterinaria Mundo Animal", type: "Veterinaria", status: "Activo", customers: 32 },
        { id: 4, name: "Salón Elegancia", type: "Salón", status: "Inactivo", customers: 18 },
        { id: 5, name: "Banco Nacional", type: "Banco", status: "Activo", customers: 89 }
    ];
}

function generateSampleAppointments() {
    return [
        { id: 1, customer: "María Rodríguez", business: "Restaurante El Buen Sabor", service: "Mesa para 4", time: "19:30", status: "Activo" },
        { id: 2, customer: "Juan García", business: "Hospital San Rafael", service: "Consulta General", time: "14:00", status: "Completado" },
        { id: 3, customer: "Ana Silva", business: "Veterinaria Mundo Animal", service: "Vacunación", time: "16:30", status: "Pendiente" },
        { id: 4, customer: "Carlos López", business: "Salón Elegancia", service: "Corte de cabello", time: "11:00", status: "Cancelado" }
    ];
}

// Chart placeholder functions
function initializeCharts() {
    // Placeholder for chart initialization
    console.log('Charts initialized');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Search functionality
function searchTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (input && table) {
        input.addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
}