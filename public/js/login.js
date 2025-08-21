// Função para autenticar usuário
async function autenticarUsuario(email, senha) {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        const usuario = usuarios.find(user => user.email === email && user.senha === senha);

        if (usuario) {
            // Armazenar informações do usuário na sessão (simulação)
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            alert('Login bem-sucedido!');
            window.location.href = 'index.html'; // Redirecionar para a página principal após login
        } else {
            alert('Email ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
    }
}

// Evento de submissão do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    autenticarUsuario(email, senha);
});
