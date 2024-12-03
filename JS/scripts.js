// mongodb+srv://projetointegradorfrontend:senha123@projetointegrador.n3yko.mongodb.net/?retryWrites=true&w=majority&appName=ProjetoIntegrador

//Tempo do carrossel
document.addEventListener('DOMContentLoaded', () => {
    var carouselElement = document.querySelector('#carouselId');
    var carousel = new bootstrap.Carousel(carouselElement, {
        interval: 3000,
        wrap: true
    });

    // Recupera o texto salvo no localStorage e exibe no campo "Avisos"
    const avisosField = document.getElementById('avisos-text');
    const savedAvisos = localStorage.getItem('avisos-text');
    if (avisosField && savedAvisos) {
        avisosField.textContent = savedAvisos;
    }
});

// Constantes
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const loginButtons = document.querySelectorAll('.login-button');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');

// Adiciona o efeito de desfoque ao fundo e exibe o modal ao clicar no botão de login
loginButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        mainContent.classList.add('blur-background');
        loginModal.show();
    });
});

// Lógica de login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica as credenciais
    if (username === "adm" && password === "senha123") {
        alert("Login realizado com sucesso!");

        // Fecha o modal de login e manda para a página Home
        loginModal.hide();
        mainContent.classList.remove('blur-background');

        // Habilita a edição do campo "Avisos" e adiciona o botão "Salvar"
        const avisosField = document.getElementById('avisos-text');
        if (avisosField) {
            avisosField.setAttribute('contenteditable', 'true');
            avisosField.style.border = '1px dashed black';
            avisosField.style.padding = '5px';
            avisosField.style.cursor = 'text';

            // Adiciona o botão "Salvar" acima do card de avisos
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Salvar';
            saveButton.classList.add('btn', 'btn-sm'); // Pequeno botão
            saveButton.style.backgroundColor = '#0056b3'; // Cor da navbar
            saveButton.style.color = '#fff'; // Cor do texto branco
            saveButton.style.marginBottom = '5px'; // Pequeno espaçamento inferior

            // Adiciona o botão "Salvar" ao DOM
            const cardAvisos = avisosField.closest('.card'); // Encontra o card pai
            if (cardAvisos) {
                cardAvisos.parentNode.insertBefore(saveButton, cardAvisos);

                // Adiciona o evento de clique ao botão "Salvar"
                saveButton.addEventListener('click', () => {
                    const updatedText = avisosField.textContent;
                    localStorage.setItem('avisos-text', updatedText); // Salva o texto no localStorage
                    alert("Alterações salvas com sucesso!");
                });
            }
        } else {
            console.error("O elemento 'avisos-text' não foi encontrado.");
        }
    } else {
        alert("Credenciais inválidas. Tente novamente.");
    }
});

//Função do mapa da api do google
function updateMap(originId, mapFrameId, destination) {
    const origin = document.getElementById(originId).value;
    const mapFrame = document.getElementById(mapFrameId);
    if (origin) {
        mapFrame.src = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD2kpEDNxO-QFQvF3rPD0BXX5Vxki7xe6E&origin=${encodeURIComponent(origin)}&destination=${destination}&mode=transit`;
    } else {
        alert('Por favor, insira sua localização.');
    }
}
