// Перевірка, на якій ми сторінці, щоб застосувати відповідну логіку

// --- ЛОГІКА АВТОРИЗАЦІЇ (для index.html) ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ВАША ЛОГІКА АВТОРИЗАЦІЇ ТУТ
        // Наприклад, перевірка імені користувача та пароля (дуже спрощено!)
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'user' && password === 'pass') {
            alert('Авторизація успішна!');
            // Перенаправлення на сторінку івентів
            window.location.href = 'events.html'; 
        } else {
            alert('Невірне ім\'я користувача або пароль.');
        }
    });
}

// --- ЛОГІКА КЕРУВАННЯ ІВЕНТАМИ (для events.html) ---
const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');

// Функція для завантаження івентів із локального сховища (якщо вони є)
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    eventsList.innerHTML = ''; // Очищаємо список перед відображенням
    
    events.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event-item');
        
        // Форматуємо дати
        const createdDate = new Date(event.createdAt).toLocaleString();
        const editedDate = event.editedAt ? new Date(event.editedAt).toLocaleString() : 'Не редагувався';

        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Дата створення:</strong> ${createdDate}</p>
            <p><strong>Дата редагування:</strong> <span id="editDate-${index}">${editedDate}</span></p>
            <button onclick="editEventName(${index})">Редагувати Назву</button>
        `;
        eventsList.appendChild(eventDiv);
    });
}

// Функція для створення нового івенту
if (eventForm) {
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventName = document.getElementById('eventName').value;
        if (!eventName.trim()) return;

        const now = new Date().toISOString(); // Дата створення
        
        const newEvent = {
            name: eventName,
            createdAt: now,
            editedAt: null // Початково не редагувався
        };
        
        // Зберігаємо івент
        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        
        document.getElementById('eventName').value = ''; // Очищаємо поле вводу
        loadEvents(); // Перезавантажуємо список
    });
    
    // Завантажуємо івенти при завантаженні сторінки
    loadEvents();
}


// Функція для редагування івенту
function editEventName(index) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    if (index >= 0 && index < events.length) {
        const newName = prompt('Введіть нову назву для івенту:', events[index].name);
        
        if (newName && newName.trim() !== events[index].name) {
            events[index].name = newName.trim();
            events[index].editedAt = new Date().toISOString(); // Оновлюємо дату редагування
            
            localStorage.setItem('events', JSON.stringify(events));
            loadEvents(); // Перезавантажуємо список для відображення змін
        }
    }
}