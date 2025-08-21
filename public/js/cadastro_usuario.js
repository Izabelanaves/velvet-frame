document.getElementById('formCadastroUsuario').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const novoUsuario = {
        nome,
        email,
        senha
    };

    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'login.html'; // Redirecionar para a página de login
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
    }
});
