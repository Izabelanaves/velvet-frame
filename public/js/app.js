// Função para renderizar filmes em destaque (carrossel)
async function renderDestaques() {
    const destaqueContainer = document.getElementById('filme-destaque');
    if (!destaqueContainer) return;

    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        const filmesDestaque = filmes.filter(filme => filme.destaque);

        const carouselItems = filmesDestaque.map((filme, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''} text-light">
                <div class="row align-items-center">
                    <div class="col-md-5">
                        <img src="${filme.imagem_principal}" class="d-block w-100 rounded" alt="${filme.titulo}">
                    </div>
                    <div class="col-md-7 text-light">
                        <h3 class="text-danger">${filme.titulo}</h3>
                        <p><strong>Diretor:</strong> ${filme.diretor}</p>
                        <p>${filme.sinopse}</p>
                    </div>
                </div>
            </div>
        `).join('');

        const carouselHTML = `
        <div id="carouselDestaques" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselDestaques" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselDestaques" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
        `;

        destaqueContainer.innerHTML = carouselHTML;
    } catch (error) {
        console.error('Erro ao carregar filmes em destaque:', error);
    }
}

// Função para renderizar todos os filmes (cards)
async function renderCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    if (!catalogoContainer) return;

    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();

        const cardsHTML = filmes.map(filme => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 bg-dark text-white">
                    <img src="${filme.imagem_principal}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <p class="card-text"><small class="text-muted">${filme.ano} • ${filme.genero}</small></p>
                        <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                        <a href="detalhes.html?id=${filme.id}" class="btn btn-danger">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `).join('');

        catalogoContainer.innerHTML = cardsHTML;
    } catch (error) {
        console.error('Erro ao carregar catálogo de filmes:', error);
    }
}

// Função para renderizar detalhes do filme
async function renderDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const filmeId = parseInt(urlParams.get('id'));

    try {
        const response = await fetch(`http://localhost:3000/filmes/${filmeId}`);
        const filme = await response.json();

        if (!filme) {
            window.location.href = 'index.html';
            return;
        }

        const detalhesContainer = document.getElementById('detalhes-filme');
        if (!detalhesContainer) return;

        // Seção 1: Informações gerais
        const infoHTML = `
        <div class="row mb-5">
            <div class="col-md-4">
                <img src="${filme.imagem_principal}" class="img-fluid rounded" alt="${filme.titulo}">
            </div>
            <div class="col-md-8">
                <h1 class="mb-3">${filme.titulo}</h1>
                <div class="row mb-3">
                    <div class="col-6">
                        <p><strong>Diretor:</strong> ${filme.diretor}</p>
                        <p><strong>Ano:</strong> ${filme.ano}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Gênero:</strong> ${filme.genero}</p>
                        <p><strong>Duração:</strong> ${filme.duracao}</p>
                    </div>
                </div>
                <p><strong>Sinopse:</strong></p>
                <p>${filme.sinopse}</p>
                <div class="d-flex align-items-center mt-3">
                    <span class="badge bg-danger me-2">Classificação: ${filme.classificacao}</span>
                    <span class="text-warning">${'★'.repeat(Math.floor(filme.avaliacao))}${'☆'.repeat(5 - Math.floor(filme.avaliacao))}</span>
                </div>
            </div>
        </div>
        `;

        // Seção 2: Fotos adicionais
        const fotosHTML = `
        <div class="row">
            <h2 class="mb-4">Fotos</h2>
            ${filme.imagens_complementares.map(foto => `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark text-light border-danger">
                    <img src="${foto.src}" class="card-img-top" alt="${foto.descricao}">
                    <div class="card-body">
                        <p class="card-text text-center">${foto.descricao}</p>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>`;

        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const isFavorito = usuarioLogado && usuarioLogado.favoritos.includes(filme.id);
        const favoritosButtonHTML = usuarioLogado ? `<button class="btn btn-${isFavorito ? 'secondary' : 'success'} mt-3" onclick="toggleFavorito(${filme.id})">${isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</button>` : '';

        detalhesContainer.innerHTML = infoHTML + fotosHTML + favoritosButtonHTML;
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
    }
}

// Função para renderizar informações do autor
async function renderAutor() {
    try {
        const response = await fetch('http://localhost:3000/autor');
        const autor = await response.json();

        const autorContainer = document.getElementById('autor');
        const autorNome = document.getElementById('autor-nome');
        const autorDescricao = document.getElementById('autor-descricao');
        const autorFoto = document.getElementById('autor-foto');

        autorNome.textContent = autor.nome;
        autorDescricao.textContent = autor.descricao;
        autorFoto.src = autor.foto_perfil;
    } catch (error) {
        console.error('Erro ao carregar informações do autor:', error);
    }
}

// Função para verificar se o usuário está logado
function verificarAutenticacao() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const navBar = document.querySelector('.navbar-nav');
    const favoritosSection = document.getElementById('favoritos');

    if (usuarioLogado) {
        // Substituir o link de Login pelo nome do usuário
        const loginItem = navBar.querySelector('a[href="login.html"]');
        if (loginItem) {
            loginItem.textContent = `Olá, ${usuarioLogado.nome}`;
            loginItem.href = "#";
            loginItem.classList.add("nav-link", "text-white");
            loginItem.style.cursor = "default";
        }

        // Adicionar botão de logout
        const logoutItem = document.createElement('li');
        logoutItem.classList.add('nav-item');
        logoutItem.innerHTML = `<a class="nav-link text-white" href="#" id="logout">Sair</a>`;
        navBar.appendChild(logoutItem);

        // Adicionar link para cadastro de filme
        const adicionarFilmeItem = document.createElement('li');
        adicionarFilmeItem.classList.add('nav-item');
        adicionarFilmeItem.innerHTML = `<a class="nav-link text-white" href="cadastro_filme.html">Adicionar Filme</a>`;
        navBar.appendChild(adicionarFilmeItem);

        // Evento de logout
        document.getElementById('logout').addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html'; // Redirecionar para a página principal após logout
        });
    } else {
        // Ocultar a seção de favoritos se não estiver logado
        if (favoritosSection) {
            favoritosSection.style.display = 'none';
        }
    }
}

// Função para buscar filmes
function buscarFilmes(filmes, termo) {
    const termoMinusculo = termo.toLowerCase();
    return filmes.filter(filme => {
        return (
            filme.titulo.toLowerCase().includes(termoMinusculo) ||
            filme.sinopse.toLowerCase().includes(termoMinusculo) ||
            filme.diretor.toLowerCase().includes(termoMinusculo) ||
            filme.elenco.some(ator => ator.toLowerCase().includes(termoMinusculo))
        );
    });
}

// Função para renderizar todos os filmes (cards) com busca
async function renderCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    if (!catalogoContainer) return;

    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();

        function atualizarCatalogo(filmesFiltrados) {
            const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
            const favoritos = usuarioLogado ? usuarioLogado.favoritos : [];

            const cardsHTML = filmesFiltrados.map(filme => {
                const isFavorito = favoritos.includes(filme.id);
                return `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 bg-dark text-white">
                            <img src="${filme.imagem_principal}" class="card-img-top" alt="${filme.titulo}">
                            <div class="card-body">
                                <h5 class="card-title">${filme.titulo}</h5>
                                <p class="card-text"><small class="text-muted">${filme.ano} • ${filme.genero}</small></p>
                                <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                                <a href="detalhes.html?id=${filme.id}" class="btn btn-danger">Ver Detalhes</a>
                                ${usuarioLogado ? `<button class="btn btn-${isFavorito ? 'secondary' : 'success'} mt-2" onclick="toggleFavorito(${filme.id})">${isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            catalogoContainer.innerHTML = cardsHTML;
        }

        // Atualizar catálogo com todos os filmes inicialmente
        atualizarCatalogo(filmes);

        // Adicionar evento de busca
        const barraBusca = document.getElementById('barraBusca');
        barraBusca.addEventListener('input', () => {
            const termo = barraBusca.value;
            const filmesFiltrados = buscarFilmes(filmes, termo);
            atualizarCatalogo(filmesFiltrados);
        });
    } catch (error) {
        console.error('Erro ao carregar catálogo de filmes:', error);
    }
}

async function toggleFavorito(filmeId) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const isFavorito = usuarioLogado.favoritos.includes(filmeId);

    if (isFavorito) {
        usuarioLogado.favoritos = usuarioLogado.favoritos.filter(id => id !== filmeId);
    } else {
        usuarioLogado.favoritos.push(filmeId);
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ favoritos: usuarioLogado.favoritos })
        });

        if (response.ok) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            renderCatalogo();
            renderFavoritos();
        } else {
            alert('Erro ao atualizar favoritos.');
        }
    } catch (error) {
        console.error('Erro ao atualizar favoritos:', error);
    }
}

async function renderFavoritos() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const favoritosContainer = document.getElementById('favoritos-filmes');
    if (!favoritosContainer) return;

    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        const filmesFavoritos = filmes.filter(filme => usuarioLogado.favoritos.includes(filme.id));

        const favoritosHTML = filmesFavoritos.map(filme => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 bg-dark text-white">
                    <img src="${filme.imagem_principal}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <p class="card-text"><small class="text-muted">${filme.ano} • ${filme.genero}</small></p>
                        <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                        <a href="detalhes.html?id=${filme.id}" class="btn btn-danger">Ver Detalhes</a>
                        <button class="btn btn-secondary mt-2" onclick="toggleFavorito(${filme.id})">Remover dos Favoritos</button>
                    </div>
                </div>
            </div>
        `).join('');

        favoritosContainer.innerHTML = favoritosHTML;
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();

    if (document.getElementById('filme-destaque')) {
        renderDestaques();
        renderCatalogo();
        renderFavoritos(); // Renderizar favoritos quando o usuário estiver logado
    } else if (document.getElementById('detalhes-filme')) {
        renderDetalhes();
    }

    if (document.getElementById('autor')) {
        renderAutor();
    }
});
