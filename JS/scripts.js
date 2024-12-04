document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado e analisado"); // Log para depuração
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const loginButtons = document.querySelectorAll('.login-button');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const avisosField = document.getElementById('avisos-text');

    // Verifica se o administrador está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        setLoggedInState();
    }

    // Recupera o texto salvo no localStorage e exibe no campo "Avisos"
    const savedAvisos = localStorage.getItem('avisos-text');
    if (avisosField && savedAvisos) {
        console.log("Texto salvo encontrado no localStorage:", savedAvisos); // Log para depuração
        avisosField.textContent = savedAvisos;
    }

    // Adiciona o efeito de desfoque ao fundo e exibe o modal ao clicar no botão de login
    loginButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Botão de login clicado"); // Log para depuração
            mainContent.classList.add('blur-background');
            loginModal.show();
        });

        document.getElementById('loginModal').addEventListener('hidden.bs.modal', () => {
            console.log("Modal de login fechado"); // Log para depuração
            mainContent.classList.remove('blur-background');
        });
    });

    // Lógica de login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o envio do formulário

        const login = document.getElementById('username').value.trim();
        const senha = document.getElementById('password').value.trim();

        console.log("Login:", login); // Log para depuração
        console.log("Senha:", senha); // Log para depuração

        if (!login || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            console.log("Enviando requisição de login"); // Log para depuração

            // Envia requisição POST ao backend
            const response = await axios.post('http://localhost:3000/login', {
                login: login,
                senha: senha
            });

            console.log("Resposta recebida:", response); // Log para depuração

            if (response.status === 200) {
                alert("Login realizado com sucesso!");

                // Fecha o modal de login
                loginModal.hide();
                mainContent.classList.remove('blur-background');

                // Define o estado de login no localStorage
                localStorage.setItem('isLoggedIn', 'true');
                setLoggedInState();
            } else {
                alert(response.data.mensagem || "Credenciais inválidas. Tente novamente.");
            }
        } catch (error) {
            if (error.response) {
                console.error("Erro no backend:", error.response.data);
                alert(error.response.data.mensagem || "Erro no servidor.");
            } else {
                console.error("Erro na requisição:", error);
                alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
            }
        }
    });

    // Função para definir o estado de login
    function setLoggedInState() {
        // Substitui os botões de login por novos botões de logout
        loginButtons.forEach(button => {
            const logoutButton = document.createElement('a');
            logoutButton.href = '#';
            logoutButton.textContent = 'Logout';
            logoutButton.classList.add('btn', 'btn-danger', 'd-flex', 'justify-content-center', 'align-items-center');
            logoutButton.style.transition = 'all 0.3s ease';
            logoutButton.style.width = button.offsetWidth + 'px'; // Define a largura do botão de logout igual ao de login
            logoutButton.style.height = button.offsetHeight + 'px'; // Define a altura do botão de logout igual ao de login
            logoutButton.addEventListener('click', (event) => {
                event.preventDefault();
                const confirmLogout = confirm("Você realmente deseja sair?");
                if (confirmLogout) {
                    localStorage.setItem('isLoggedIn', 'false');
                    location.reload(); // Recarrega a página ao clicar em logout
                }
            });
            button.replaceWith(logoutButton);
        });

        // Habilita edição do campo "Avisos"
        if (avisosField) {
            console.log("Habilitando edição do campo 'Avisos'"); // Log para depuração
            avisosField.setAttribute('contenteditable', 'true');
            avisosField.style.border = '1px dashed black';
            avisosField.style.padding = '5px';
            avisosField.style.cursor = 'text';

            // Adiciona botão "Salvar" acima do card de avisos
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Salvar';
            saveButton.classList.add('btn', 'btn-sm');
            saveButton.style.backgroundColor = '#0056b3';
            saveButton.style.color = '#fff';
            saveButton.style.marginBottom = '5px';

            const cardAvisos = avisosField.closest('.card');
            if (cardAvisos) {
                console.log("Adicionando botão 'Salvar'"); // Log para depuração
                cardAvisos.parentNode.insertBefore(saveButton, cardAvisos);

                // Evento para salvar alterações no campo "Avisos"
                saveButton.addEventListener('click', () => {
                    const updatedText = avisosField.textContent;
                    localStorage.setItem('avisos-text', updatedText);
                    alert("Alterações salvas com sucesso!");
                });
            } else {
                console.error("O elemento 'cardAvisos' não foi encontrado.");
            }
        } else {
            console.error("O elemento 'avisos-text' não foi encontrado.");
        }
    }

    // Função do mapa da API do Google
    const updateMap = (originId, mapFrameId, destination) => {
        const origin = document.getElementById(originId).value.trim();
        const mapFrame = document.getElementById(mapFrameId);
        if (origin) {
            console.log("Atualizando mapa com origem:", origin); // Log para depuração
            mapFrame.src = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD2kpEDNxO-QFQvF3rPD0BXX5Vxki7xe6E&origin=${encodeURIComponent(origin)}&destination=${destination}&mode=transit`;
        } else {
            alert('Por favor, insira sua localização.');
        }
    };

    // Exemplo de uso da função do mapa
    const destination = "São Paulo, Brasil"; // Substitua pelo destino correto
    document.getElementById('searchButton').addEventListener('click', () => {
        console.log("Botão de busca clicado"); // Log para depuração
        updateMap('originInput', 'mapFrame', destination);
    });
});
