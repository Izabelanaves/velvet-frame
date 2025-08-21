document.getElementById('formCadastroFilme').addEventListener('submit', async function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const diretor = document.getElementById('diretor').value;
    const elenco = document.getElementById('elenco').value.split(',').map(item => item.trim());
    const ano = parseInt(document.getElementById('ano').value);
    const genero = document.getElementById('genero').value;
    const duracao = document.getElementById('duracao').value;
    const classificacao = document.getElementById('classificacao').value;
    const sinopse = document.getElementById('sinopse').value;
    const imagemPrincipal = document.getElementById('imagemPrincipal').value;

    const novoFilme = {
        titulo,
        diretor,
        elenco,
        ano,
        genero,
        duracao,
        classificacao,
        sinopse,
        destaque: false, // Novo filme não é destaque por padrão
        avaliacao: 0, // Avaliação inicial
        premios: [],
        imagem_principal: imagemPrincipal,
        imagens_complementares: []
    };

    try {
        const response = await fetch('http://localhost:3000/filmes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoFilme)
        });

        if (response.ok) {
            alert('Filme adicionado com sucesso!');
            window.location.href = 'index.html'; // Redirecionar para a página principal
        } else {
            alert('Erro ao adicionar filme.');
        }
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
    }
});
