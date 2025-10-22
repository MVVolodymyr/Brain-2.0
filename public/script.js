// script.js
const modal = document.getElementById("createEventModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementsByClassName("close-btn")[0];
const createEventForm = document.getElementById("createEventForm");
const eventNameInput = document.getElementById("eventName");

// *** ВАЖЛИВО: Замініть це на URL-адресу вашого API Gateway ***
const API_ENDPOINT = 'https://6v0qdpjqq3.execute-api.us-east-1.amazonaws.com/Staging'; 

openModalBtn.onclick = () => { modal.style.display = "block"; eventNameInput.value = ''; };
closeBtn.onclick = () => { modal.style.display = "none"; };
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

createEventForm.onsubmit = function(event) {
    event.preventDefault(); 
    const eventName = eventNameInput.value.trim();
    if (eventName === "") return alert("Будь ласка, введіть назву події.");
    
    // 1. Надсилання POST-запиту до AWS
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName })
    })
    .then(response => {
        if (!response.ok) throw new Error('Помилка сервера: ' + response.status);
        return response.json();
    })
    .then(data => {
        alert(`Подія "${eventName}" (ID: ${data.id}) успішно створена. Сторінка буде перезавантажена.`);
        // 2. Перезавантаження сторінки, як ви просили
        window.location.reload(); 
    })
    .catch(error => {
        console.error('Помилка створення івенту:', error);
        alert('Помилка при створенні події. Перевірте консоль.');
    });
    
    modal.style.display = "none";
}