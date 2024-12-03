document.addEventListener('DOMContentLoaded', () => {
    // Constantes e elementos DOM
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const loginButtons = document.querySelectorAll('.login-button');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const avisosField = document.getElementById('avisos-text');

    // Recupera o texto salvo no localStorage e exibe no campo "Avisos"
    const savedAvisos = localStorage.getItem('avisos-text');
    if (avisosField && savedAvisos) {
        avisosField.textContent = savedAvisos;
    }

    // Adiciona o efeito de desfoque ao fundo e exibe o modal ao clicar no botão de login
    loginButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            mainContent.classList.add('blur-background');
            loginModal.show();
        });
        document.getElementById('loginModal').addEventListener('hidden.bs.modal', () => {
            mainContent.classList.remove('blur-background');
        });
    });

    // Lógica de login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o envio do formulário

        const login = document.getElementById('username').value;
        const senha = document.getElementById('password').value;

        console.log("Login:", login); // Adicionar log
        console.log("Senha:", senha); // Adicionar log

        if (!login || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            console.log("Enviando requisição de login"); // Adicionar log
            // Envia uma requisição POST ao backend para autenticar
            const response = await axios.post('http://localhost:3000/login', {
                login: login,
                senha: senha
            });

            console.log("Resposta recebida:", response); // Adicionar log

            if (response.status === 200) {
                alert("Login realizado com sucesso!");

                // Fecha o modal de login
                loginModal.hide();
                mainContent.classList.remove('blur-background');

                // Habilita a edição do campo "Avisos" e adiciona o botão "Salvar"
                if (avisosField) {
                    avisosField.setAttribute('contenteditable', 'true');
                    avisosField.style.border = '1px dashed black';
                    avisosField.style.padding = '5px';
                    avisosField.style.cursor = 'text';

                    // Adiciona o botão "Salvar" acima do card de avisos
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Salvar';
                    saveButton.classList.add('btn', 'btn-sm');
                    saveButton.style.backgroundColor = '#0056b3';
                    saveButton.style.color = '#fff';
                    saveButton.style.marginBottom = '5px';

                    const cardAvisos = avisosField.closest('.card');
                    if (cardAvisos) {
                        cardAvisos.parentNode.insertBefore(saveButton, cardAvisos);

                        // Evento de clique para salvar o texto dos avisos
                        saveButton.addEventListener('click', () => {
                            const updatedText = avisosField.textContent;
                            localStorage.setItem('avisos-text', updatedText);
                            alert("Alterações salvas com sucesso!");
                        });
                    }
                } else {
                    console.error("O elemento 'avisos-text' não foi encontrado.");
                }
            } else {
                alert(response.data.message || "Credenciais inválidas. Tente novamente.");
            }
        } catch (error) {
            if (error.response) {
                console.error("Erro no backend:", error.response.data);
                alert(error.response.data.message || "Erro no servidor. Tente novamente mais tarde.");
            } else {
                console.error("Erro na requisição:", error);
                alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
            }
        }
    });
});

// Função do mapa da API do Google
function updateMap(originId, mapFrameId, destination) {
    const origin = document.getElementById(originId).value;
    const mapFrame = document.getElementById(mapFrameId);
    if (origin) {
        mapFrame.src = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD2kpEDNxO-QFQvF3rPD0BXX5Vxki7xe6E&origin=${encodeURIComponent(origin)}&destination=${destination}&mode=transit`;
    } else {
        alert('Por favor, insira sua localização.');
    }
}
