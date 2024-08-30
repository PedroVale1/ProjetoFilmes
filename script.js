const resultado = document.querySelector("#resultado");
const buscaInput = document.querySelector("#busca");
const buscarBtn = document.querySelector("#buscar-btn");
const titulo = document.querySelector(".titulo");
const modal = document.querySelector("#modal");
const closeBtn = document.querySelector(".close-btn");
const modalImg = document.querySelector("#modal-img");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalReleaseDate = document.querySelector("#modal-release-date");

// Função para buscar filmes populares
async function buscarFilmes() {
    try {
        const resposta = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=77c4e2b070a2e1396500d0b42ebf7cec&language=pt-BR");
        const dados = await resposta.json();
        exibirFilmes(dados.results);
        titulo.textContent = "Filmes populares"; // Resetar o título para "Filmes populares"
    } catch (error) {
        console.error("Erro ao buscar filmes populares:", error);
        resultado.textContent = "Erro ao consumir a API, por favor, verifique a URL";
    }
}

// Função para buscar filmes com base na pesquisa
async function buscarFilmesPorPesquisa(query) {
    try {
        const resposta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=77c4e2b070a2e1396500d0b42ebf7cec&language=pt-BR&query=${encodeURIComponent(query)}`);
        const dados = await resposta.json();
        exibirFilmes(dados.results);
        titulo.textContent = "Filmes pesquisados"; // Alterar o título para "Filmes pesquisados"
    } catch (error) {
        console.error("Erro ao buscar filmes por pesquisa:", error);
        resultado.textContent = "Erro ao consumir a API, por favor, verifique a URL";
    }
}

// Função para exibir filmes no DOM
function exibirFilmes(filmes) {
    // Limpar resultados anteriores
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Adicionar novos filmes
    filmes.forEach((element) => {
        const card = document.createElement("div");
        card.className = "card";
        
        const imagem = document.createElement("img");
        imagem.src = `https://image.tmdb.org/t/p/w500${element.poster_path}`;
        imagem.alt = `Poster de ${element.title}`;
        
        const detalhes = document.createElement("div");
        detalhes.className = "details";
        
        const texto = document.createElement("p");
        texto.textContent = element.title;
        texto.className = "texto";

        const btnDetalhes = document.createElement("button");
        btnDetalhes.textContent = "Mais Detalhes";
        btnDetalhes.className = "details-btn";
        btnDetalhes.addEventListener("click", () => exibirDetalhes(element.id));
        
        detalhes.appendChild(texto);
        detalhes.appendChild(btnDetalhes);
        card.appendChild(imagem);
        card.appendChild(detalhes);
        resultado.appendChild(card);
    });
}

// Função para exibir detalhes do filme no modal
async function exibirDetalhes(id) {
    try {
        const resposta = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=77c4e2b070a2e1396500d0b42ebf7cec&language=pt-BR`);
        const dados = await resposta.json();
        modalImg.src = `https://image.tmdb.org/t/p/w500${dados.poster_path}`;
        modalTitle.textContent = dados.title;
        modalDescription.textContent = dados.overview;
        modalReleaseDate.textContent = `Data de lançamento: ${dados.release_date}`;
        modal.style.display = "flex";
    } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
    }
}

// Adicionar eventos para pesquisa dinâmica
buscaInput.addEventListener("input", () => {
    const query = buscaInput.value.trim();
    if (query) {
        buscarFilmesPorPesquisa(query);
    } else {
        buscarFilmes(); // Se a busca estiver vazia, exibir filmes populares
    }
});

// Adicionar evento ao botão de busca
buscarBtn.addEventListener("click", () => {
    const query = buscaInput.value.trim();
    if (query) {
        buscarFilmesPorPesquisa(query);
    } else {
        buscarFilmes(); // Se a busca estiver vazia, exibir filmes populares
    }
});

// Adicionar evento ao botão de fechar do modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Carregar filmes populares ao iniciar
buscarFilmes();
''