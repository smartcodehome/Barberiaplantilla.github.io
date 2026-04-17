// REEMPLAZA CON TU ID DE GOOGLE DEPLOYMENT
const API_URL = "https://script.google.com/macros/s/AKfycbyWFrv_OOIehGT2UCBsCv4_zzxbrby7RppZ1D2-cvKeSlfuLLR8DsGGWQsjBbrHmtRU/exec";

// Cargar reseñas al iniciar
async function loadReviews() {
    const container = document.getElementById('reviews');
    container.innerHTML = '<p>Cargando experiencias...</p>';

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        container.innerHTML = ''; // Limpiar mensaje de carga

        if (data.length === 0) {
            container.innerHTML = '<p>Aún no hay reseñas. ¡Sé el primero!</p>';
            return;
        }

        data.reverse().forEach(r => {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `
                <strong>${r.name}</strong> 
                <span style="color:gold">${'★'.repeat(r.rating)}</span>
                <p>${r.comment}</p>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        container.innerHTML = '<p>No se pudieron cargar las reseñas.</p>';
        console.error('Error:', e);
    }
}

// Publicar nueva reseña
async function addReview() {
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const btn = document.getElementById('submit-btn');
    
    // Obtener valor de la estrella seleccionada
    const ratingElement = document.querySelector('input[name="stars"]:checked');
    const rating = ratingElement ? ratingElement.value : null;

    if (!name || !comment || !rating) {
        alert('Por favor, completa todos los campos y selecciona una puntuación.');
        return;
    }

    // Bloquear botón para evitar doble envío
    btn.disabled = true;
    btn.innerText = "Publicando...";

    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // Importante para Google Apps Script
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, comment, rating: parseInt(rating) })
        });

        // Limpiar formulario
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';
        if (ratingElement) ratingElement.checked = false;

        alert('¡Gracias por tu reseña!');
        setTimeout(loadReviews, 1000); // Recargar tras un segundo

    } catch (e) {
        alert('Hubo un error al enviar. Inténtalo de nuevo.');
    } finally {
        btn.disabled = false;
        btn.innerText = "Publicar Reseña";
    }
}

// Animación al hacer Scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => observer.observe(el));

// Inicialización
loadReviews();
