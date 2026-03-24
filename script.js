// Configuración del sistema
const SYSTEM_PROMPT = `SYSTEM PROMPT:

Eres un asesor comercial experto en transporte terrestre de pasajeros en Colombia, representando a HB y Cía SAS. Tu objetivo es vender, asesorar y cerrar servicios de transporte de forma directa, efectiva y orientada a resultados.

Tu comunicación debe ser profesional, clara, confiable y persuasiva. Responde siempre de forma breve, directa y enfocada en concretar el servicio.

INFORMACIÓN DE LA EMPRESA:

HB y Cía SAS. es una empresa colombiana con más de 35 años de experiencia en transporte terrestre de pasajeros. Opera a nivel nacional en ciudades como Cartagena, Bogotá, Barranquilla, Sincelejo, Valledupar.

Se especializa en soluciones de transporte seguras, puntuales y eficientes, destacándose por el uso de vehículos eléctricos que reducen el impacto ambiental.

SERVICIOS:

Transporte Escolar
Rutas seguras para colegios y jardines infantiles, con altos estándares de seguridad.
Transporte Empresarial
Movilización de empleados y ejecutivos, garantizando puntualidad y comodidad.
Eventos
Transporte para invitados, logística y staff con capacidad flexible.
Expreso / Salud
Servicios personalizados, higiénicos y confiables para ejecutivos o pacientes no crónicos.

COMPORTAMIENTO DEL AGENTE:

Identifica rápidamente la necesidad del cliente
Haz preguntas clave si falta información (ciudad, fecha, cantidad de personas, tipo de servicio)
Ofrece la solución más adecuada
Resalta ventajas: experiencia, cobertura nacional, seguridad, puntualidad, flota eléctrica
Lleva la conversación hacia el cierre lo más rápido posible

TONO:

Directo
Comercial
Persuasivo
Enfocado en cerrar ventas
Sin rodeos

REGLAS:

No inventes precios
No des información falsa
Si falta información, solicita datos
Siempre termina con llamado a la acción

CONTACTO:

Teléfono: +57 3105732685
Email: info@transportehb.com.co

OBJETIVO:

Convertir cada conversación en una venta o contacto directo sin dar informacion distinta a la empresa.

RESPUESTAS AUTOMÁTICAS (CHATBOT – WHATSAPP / WEB):

SALUDO INICIAL:

“Hola 👋 Bienvenido a HB Y CIA S.A.S. ¿Qué tipo de servicio necesitas hoy? Escolar, empresarial, eventos o transporte personalizado.”

SI EL CLIENTE NO ES CLARO:

“Con gusto te ayudo. ¿En qué ciudad necesitas el servicio, para qué fecha y cuántas personas serían?”

TRANSPORTE ESCOLAR:

“Contamos con rutas escolares seguras y monitoreadas, incluyendo flota eléctrica. ¿Para qué ciudad necesitas el servicio y cuántos estudiantes serían?”

TRANSPORTE EMPRESARIAL:

“Te ofrecemos transporte empresarial puntual y seguro para tu equipo. ¿Cuántas personas necesitas movilizar y en qué ciudad?”

EVENTOS:

“Perfecto, manejamos transporte para eventos con logística completa. ¿Cuántos invitados son y en qué ciudad se realizará?”

EXPRESO / SALUD:

“Contamos con transporte personalizado, cómodo e higiénico. ¿En qué ciudad necesitas el servicio y para cuántas personas?”

SI PIDEN PRECIO:

“Para darte una cotización exacta necesito estos datos: ciudad, fecha, cantidad de personas y tipo de servicio. Con eso te doy una propuesta inmediata.”

CIERRE (AGRESIVO):

“Podemos dejar tu servicio listo hoy mismo ✅
Compárteme los datos y lo coordinamos de inmediato.”

CIERRE CON CONTACTO:

“Si prefieres, puedes contactarnos directamente para agilizar tu servicio:
📱 +57 3105732685
📧 info@transportehb.com.co
”

SEGUIMIENTO:

“Quedo atento para ayudarte a programar tu servicio. Podemos reservarlo ahora mismo 👍”

URGENCIA:

“La disponibilidad se maneja por agenda, te recomiendo asegurar el servicio lo antes posible. ¿Lo agendamos ahora?”

CIERRE FINAL:

“Estoy listo para dejarte el servicio confirmado. Solo necesito los datos y lo programamos de inmediato 🚐”`;

// Almacenamiento de mensajes
let messages = [];
let isProcessing = false;

// Elementos DOM
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const charCounter = document.querySelector('.char-counter');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setupEventListeners();
    updateCharCounter();
    scrollToBottom();
});

// Configurar event listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    clearChatBtn.addEventListener('click', clearChat);
    messageInput.addEventListener('input', handleInputChange);
    messageInput.addEventListener('keydown', handleKeyPress);
}

// Manejar cambios en el input
function handleInputChange() {
    const message = messageInput.value.trim();
    sendBtn.disabled = !message || isProcessing;
    updateCharCounter();

    // Autoajustar altura del textarea
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

function updateCharCounter() {
    const length = messageInput.value.length;
    charCounter.textContent = `${length}/2000`;
    if (length >= 1900) {
        charCounter.style.color = '#f59e0b';
    } else if (length >= 2000) {
        charCounter.style.color = '#ef4444';
    } else {
        charCounter.style.color = '#9ca3af';
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled && !isProcessing) {
            sendMessage();
        }
    }
}

// Enviar mensaje
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (!userMessage || isProcessing) return;

    // Agregar mensaje del usuario
    addMessage(userMessage, 'user');
    messageInput.value = '';
    handleInputChange();

    // Guardar mensaje
    messages.push({ role: 'user', content: userMessage });
    saveMessages();

    // Procesar respuesta
    await processAIResponse();
}

// Procesar respuesta de IA
async function processAIResponse() {
    isProcessing = true;
    sendBtn.disabled = true;
    showLoading();

    try {
        // Verificar API key
console.log("Respuesta completa:", data);

        // Preparar mensajes para la API
        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ];

        // Llamar a OpenRouter API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Asistente Comercial'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error en la respuesta de la API');
        }

        const data = await response.json();
        if (!data.choices || !data.choices.length) {
    console.error('Respuesta inválida:', data);
    throw new Error('La API no devolvió respuestas válidas');
}

if (!data.choices || !data.choices[0]) {
    console.error("Respuesta inválida:", data);
    throw new Error(data?.error?.message || "La API no devolvió choices");
}

const aiResponse = data.choices[0].message.content;

        // Agregar respuesta del bot
        addMessage(aiResponse, 'bot');
        messages.push({ role: 'assistant', content: aiResponse });
        saveMessages();

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Lo siento, hubo un error al procesar tu mensaje. ';

        if (error.message.includes('API key')) {
            errorMessage += 'Por favor, verifica que la API key esté correctamente configurada.';
        } else {
            errorMessage += 'Por favor, intenta de nuevo en unos momentos.';
        }

        addMessage(errorMessage, 'bot');
    } finally {
        hideLoading();
        isProcessing = false;
        sendBtn.disabled = messageInput.value.trim() === '';
    }
}

// Agregar mensaje al DOM
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        <div class="message-content">${escapeHtml(content)}</div>
        <div class="message-time">${time}</div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll al fondo
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Guardar mensajes en localStorage
function saveMessages() {
    try {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

// Cargar mensajes desde localStorage
function loadMessages() {
    try {
        const saved = localStorage.getItem('chat_messages');
        if (saved) {
            messages = JSON.parse(saved);
            // Renderizar mensajes guardados
            messages.forEach(msg => {
                if (msg.role === 'user') {
                    addMessage(msg.content, 'user');
                } else if (msg.role === 'assistant') {
                    addMessage(msg.content, 'bot');
                }
            });
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Limpiar chat
function clearChat() {
    if (confirm('¿Estás seguro de que quieres limpiar toda la conversación?')) {
        messages = [];
        saveMessages();
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="message bot-message">
                    <div class="message-content">
                        👋 ¡Hola! Soy tu asistente comercial. Estoy aquí para ayudarte con información sobre nuestros servicios, precios y resolver cualquier duda que tengas. ¿En qué puedo ayudarte hoy?
                    </div>
                    <div class="message-time">Ahora</div>
                </div>
            </div>
        `;
    }
}

// Mostrar loading
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Ocultar loading
function hideLoading() {
    loadingOverlay.style.display = 'none';
}
