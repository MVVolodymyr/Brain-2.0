// =================================================================
// script.js - ЧИСТА РОБОЧА ВЕРСІЯ (Без модальних вікон)
// =================================================================

// *** КОНФІГУРАЦІЯ ***
const API_ENDPOINT = 'https://6v0qdpjqq3.execute-api.us-east-1.amazonaws.com/Staging/events'; 
// *** ВИПРАВЛЕНО: ВИКОРИСТОВУЄМО НОВІ ID З HTML ***
const EVENT_LIST_CONTAINER = document.getElementById('event-list-container');
const CREATE_EVENT_FORM = document.getElementById('create-event-form');
const EVENT_NAME_INPUT = document.getElementById('event-name-input');


// -----------------------------------------------------------------
// 1. ФУНКЦІЯ: ОТРИМАННЯ ТА ВІДОБРАЖЕННЯ ДАНИХ (GET + СОРТУВАННЯ)
// -----------------------------------------------------------------
async function loadEvents() {
    console.log("Завантаження даних...");
    
    // Перевірка існування контейнера 
    if (!EVENT_LIST_CONTAINER) {
        console.error("Контейнер списку подій не знайдено.");
        return;
    }

    // Встановлюємо індикатор завантаження
    const headerRow = EVENT_LIST_CONTAINER.querySelector('.header-row') ? EVENT_LIST_CONTAINER.querySelector('.header-row').outerHTML : '';
    EVENT_LIST_CONTAINER.innerHTML = headerRow + '<div id="loading-indicator" class="table-row data-row"><div class="cell event-name-col" style="grid-column: 1 / span 4;">Завантаження...</div></div>';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Помилка отримання даних: ${response.status}`);
        }

        let events = await response.json();
        
        // Перевірка та парсинг JSON 
        if (typeof events === 'string') {
            try { events = JSON.parse(events); } catch (e) { events = []; }
        }
        if (!Array.isArray(events)) { events = []; }
        
        // СОРТУВАННЯ: Найновіші перші
        events.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

        // Очищення контейнера
        EVENT_LIST_CONTAINER.innerHTML = headerRow; 

        if (events.length === 0) {
            EVENT_LIST_CONTAINER.innerHTML += '<div class="table-row data-row"><div class="cell event-name-col" style="grid-column: 1 / span 4;">Жодної події не знайдено.</div></div>';
            return;
        }

        events.forEach((event, index) => {
            // Форматування дати
            const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            const createdDate = new Date(event.created_date).toLocaleString('uk-UA', formatOptions);
            const lastUpdate = event.last_update ? new Date(event.last_update).toLocaleString('uk-UA', formatOptions) : 'N/A';
            
            const row = document.createElement('div');
            row.className = 'table-row data-row';

            // Create cells using DOM methods instead of innerHTML to avoid escaping issues
            const nameCell = document.createElement('div');
            nameCell.className = 'cell event-name-col';
            nameCell.textContent = event.name || 'N/A';
            
            const createdCell = document.createElement('div');
            createdCell.className = 'cell created-col';
            createdCell.textContent = createdDate;
            
            const modifiedCell = document.createElement('div');
            modifiedCell.className = 'cell modified-col';
            modifiedCell.textContent = lastUpdate;
            
            const actionsCell = document.createElement('div');
            actionsCell.className = 'cell actions-col delete-action';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.onclick = () => handleDeleteEvent(event.id, event.name);
            
            actionsCell.appendChild(deleteBtn);
            
            row.appendChild(nameCell);
            row.appendChild(createdCell);
            row.appendChild(modifiedCell);
            row.appendChild(actionsCell);
            
            EVENT_LIST_CONTAINER.appendChild(row);
        });

    } catch (error) {
        console.error("Помилка завантаження івентів:", error);
        EVENT_LIST_CONTAINER.innerHTML = headerRow + `<div class="table-row data-row"><div class="cell event-name-col" style="grid-column: 1 / span 4;">Помилка завантаження: ${error.message}</div></div>`;
    }
}


// -----------------------------------------------------------------
// 2. ФУНКЦІЯ: ВИДАЛЕННЯ ЕЛЕМЕНТА (DELETE)
// -----------------------------------------------------------------
window.handleDeleteEvent = async function(id, name) {
    if (!confirm(`Ви впевнені, що хочете видалити подію "${name}" (ID: ${id})?`)) { return; }
    
    try {
        const url = `${API_ENDPOINT}/${id}`;
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) { throw new Error(`Помилка сервера: ${response.status}`); }
        
        alert(`Подію "${name}" успішно видалено.`);
        loadEvents(); 

    } catch (error) {
        console.error("Помилка видалення івенту:", error);
        alert(`Не вдалося видалити подію: ${error.message}`);
    }
}


// -----------------------------------------------------------------
// 3. ФУНКЦІЯ: СТВОРЕННЯ НОВОГО ЕЛЕМЕНТА (POST)
// -----------------------------------------------------------------
if (CREATE_EVENT_FORM) {
    CREATE_EVENT_FORM.onsubmit = async (event) => {
        event.preventDefault();
        
        const eventName = EVENT_NAME_INPUT.value.trim();
        if (!eventName) { alert("Будь ласка, введіть назву події."); return; }

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: eventName }),
            });

            if (!response.ok) { throw new Error(`Помилка сервера: ${response.status}`); }

            alert(`Подія "${eventName}" успішно створена.`);

            EVENT_NAME_INPUT.value = ''; 
            loadEvents(); 

        } catch (error) {
            console.error("Помилка створення івенту:", error);
            alert(`Помилка створення івенту: ${error.message}`);
        }
    };
}


// -----------------------------------------------------------------
// 4. ІНІЦІАЛІЗАЦІЯ
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', loadEvents);