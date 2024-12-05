document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado e analisado"); // Log para depuração
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const loginButtons = document.querySelectorAll('.login-button');
    const mainContent = document.getElementById('mainContent');
    const loginForm = document.getElementById('loginForm');
    const avisosField = document.querySelectorAll('#avisos-text');
    const limitePagina = document.getElementById('limitePagina');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Verifica se o administrador está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        setLoggedInState();
    }

    // Recupera o texto salvo no MongoDB e exibe no campo "Avisos"
    const fetchAvisos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/avisos');
            if (response.status === 200 && avisosField) {
                console.log("Texto salvo encontrado no MongoDB:", response.data.texto); // Log para depuração
                avisosField.forEach(field => field.textContent = response.data.texto);
            }
        } catch (error) {
            console.error("Erro ao buscar avisos:", error);
        }
    };
    fetchAvisos();

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
            if (!button.classList.contains('logout-button')) {
                const logoutButton = document.createElement('a');
                logoutButton.href = '#';
                logoutButton.textContent = 'Logout';
                logoutButton.classList.add('btn', 'btn-danger', 'd-flex', 'justify-content-center', 'align-items-center', 'logout-button');
                logoutButton.style.transition = 'all 0.3s ease';
                logoutButton.style.width ='86px'; // Define a largura do botão de logout igual ao de login                
                logoutButton.style.height ='43px'; // Define a altura do botão de logout igual ao de login
                logoutButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    const confirmLogout = confirm("Você realmente deseja sair?");
                    if (confirmLogout) {
                        localStorage.setItem('isLoggedIn', 'false');
                        location.reload(); // Recarrega a página ao clicar em logout
                    }
                });
                button.replaceWith(logoutButton);
            }
        });

        // Habilita edição dos itens da lista "Avisos"
        const dataItems = document.querySelectorAll('#data-text');
        const avisoItems = document.querySelectorAll('#aviso-text');
        
        dataItems.forEach(item => {
            item.setAttribute('contenteditable', 'true');
            item.style.border = '1px dashed black';
            item.style.padding = '5px';
            item.style.cursor = 'text';
        });

        avisoItems.forEach(item => {
            item.setAttribute('contenteditable', 'true');
            item.style.border = '1px dashed black';
            item.style.padding = '5px';
            item.style.cursor = 'text';
        });

        // Adiciona bot��o "Salvar" abaixo do card de avisos
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar';
        saveButton.classList.add('btn', 'btn-sm');
        saveButton.style.backgroundColor = '#0056b3';
        saveButton.style.color = '#fff';
        saveButton.style.marginTop = '5px';

        const cardAvisos = document.querySelector('.cardAvisos');
        if (cardAvisos) {
            console.log("Adicionando botão 'Salvar'"); // Log para depuração
            cardAvisos.parentNode.appendChild(saveButton);

            // Evento para salvar alterações nos itens da lista "Avisos"
            saveButton.addEventListener('click', async () => {
                const updatedText = Array.from(dataItems).map(item => item.textContent).join('\n') + '\n' +
                                    Array.from(avisoItems).map(item => item.textContent).join('\n');
                try {
                    await axios.post('http://localhost:3000/avisos', { texto: updatedText });
                    alert("Alterações salvas com sucesso!");
                } catch (error) {
                    console.error("Erro ao salvar avisos:", error);
                    alert("Erro ao salvar alterações.");
                }
            });
        } else {
            console.error("O elemento 'cardAvisos' não foi encontrado.");
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

    // Initialize EmailJS
    emailjs.init('C8gZZ0UYPwp3qXzTq');

    // Função para enviar email ao preencher os campos do formulário
    const form = document.querySelector('#containerForm form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o envio do formulário padrão

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const question = document.getElementById('question').value.trim();

        if (!name || !email || !question) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            console.log("Enviando email..."); // Log para depuração
            const response = await emailjs.send('service_aoffo3j', 'template_fkgug8y', {
                from_name: name,
                from_email: email,
                message: question,
                to_name: 'Matematica no Metro',
                to_email: 'projetointegradorfrontend@gmail.com',
            }, 'C8gZZ0UYPwp3qXzTq');

            console.log("Resposta do servidor:", response); // Log para depuração

            if (response.status === 200) {
                alert("Email enviado com sucesso!");
                form.reset(); // Limpa o formulário após o envio
            } else {
                alert("Erro ao enviar email. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            alert("Erro ao enviar email. Tente novamente.");
        }
    });
});
