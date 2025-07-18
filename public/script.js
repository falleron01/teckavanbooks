const API_BASE_URL = 'http://localhost:8000/api';

let livros = [];
let editandoLivroId = null;
let excluindoLivroId = null;
let estaCarregando = false;

const elementos = {
    loadingSpinner: document.getElementById('loadingSpinner'),
    emptyState: document.getElementById('emptyState'),
    booksGrid: document.getElementById('booksGrid'),
    bookModal: document.getElementById('bookModal'),
    confirmModal: document.getElementById('confirmModal'),
    bookForm: document.getElementById('bookForm'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage'),
    searchInput: document.getElementById('searchInput'),
    genreFilter: document.getElementById('genreFilter'),
    totalBooks: document.getElementById('totalBooks'),
    totalStock: document.getElementById('totalStock'),
    lowStock: document.getElementById('lowStock')
};

document.addEventListener('DOMContentLoaded', function() {
    carregarLivros();
    configurarEscutadoresEventos();
});

function configurarEscutadoresEventos() {
    elementos.bookForm.addEventListener('submit', lidarEnvioFormulario);

    elementos.bookModal.addEventListener('click', function(e) {
        if (e.target === elementos.bookModal) {
            fecharFormularioLivro();
        }
    });

    elementos.confirmModal.addEventListener('click', function(e) {
        if (e.target === elementos.confirmModal) {
            fecharModalConfirmacao();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharFormularioLivro();
            fecharModalConfirmacao();
        }
    });
}

async function apiRequest(url, options = {}) {
    try {
        console.log('Making API request to:', url);
        console.log('Request options:', options);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async function carregarLivros() {
    try {
        definirCarregamento(true);
        esconderErro();

        const data = await apiRequest(`${API_BASE_URL}/livros`);
        livros = data;

        atualizarEstatisticas();
        renderizarLivros();

    } catch (error) {
        mostrarErro('Erro ao carregar livros. Verifique se a API está rodando.');
        console.error('Error loading books:', error);
    } finally {
        definirCarregamento(false);
    }
}

async function criarLivro(dadosLivro) {
    try {
        const novoLivro = await apiRequest(`${API_BASE_URL}/livros`, {
            method: 'POST',
            body: JSON.stringify(dadosLivro)
        });

        livros.push(novoLivro);
        atualizarEstatisticas();
        renderizarLivros();
        mostrarSucesso('Livro criado com sucesso!');

        return novoLivro;
    } catch (error) {
        mostrarErro('Erro ao criar livro.');
        throw error;
    }
}

async function atualizarLivro(id, dadosLivro) {
    try {
        const livroAtualizado = await apiRequest(`${API_BASE_URL}/livros/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosLivro)
        });

        const index = livros.findIndex(livro => livro.id === id);
        if (index !== -1) {
            livros[index] = livroAtualizado;
        }

        atualizarEstatisticas();
        renderizarLivros();
        mostrarSucesso('Livro atualizado com sucesso!');

        return livroAtualizado;
    } catch (error) {
        mostrarErro('Erro ao atualizar livro.');
        throw error;
    }
}

async function excluirLivro(id) {
    try {
        await apiRequest(`${API_BASE_URL}/livros/${id}`, {
            method: 'DELETE'
        });

        livros = livros.filter(livro => livro.id !== id);
        atualizarEstatisticas();
        renderizarLivros();
        mostrarSucesso('Livro excluído com sucesso!');

    } catch (error) {
        mostrarErro('Erro ao excluir livro.');
        throw error;
    }
}

function definirCarregamento(carregando) {
    estaCarregando = carregando;

    if (carregando) {
        elementos.loadingSpinner.classList.remove('hidden');
        elementos.booksGrid.classList.add('hidden');
        elementos.emptyState.classList.add('hidden');
    } else {
        elementos.loadingSpinner.classList.add('hidden');
    }
}

function atualizarEstatisticas() {
    const totalLivros = livros.length;
    const estoqueTotal = livros.reduce((soma, livro) => soma + livro.qt_estoque, 0);
    const livrosComEstoqueBaixo = livros.filter(livro => livro.qt_estoque < 5).length;

    elementos.totalBooks.textContent = totalLivros;
    elementos.totalStock.textContent = estoqueTotal;
    elementos.lowStock.textContent = livrosComEstoqueBaixo;
}

function obterStatusEstoque(quantidade) {
    if (quantidade === 0) {
        return { text: 'Esgotado', class: 'stock-out' };
    } else if (quantidade < 5) {
        return { text: 'Estoque Baixo', class: 'stock-low' };
    } else {
        return { text: 'Em Estoque', class: 'stock-available' };
    }
}

function criarCartaoLivro(livro) {
    const statusEstoque = obterStatusEstoque(livro.qt_estoque);

    return `
        <div class="book-card">
            <div class="book-header">
                <h3 class="book-title">${escapeHtml(livro.titulo)}</h3>
                <span class="stock-badge ${statusEstoque.class}">${statusEstoque.text}</span>
            </div>

            <div class="book-details">
                <div class="book-detail">
                    <i class="fas fa-user"></i>
                    <span>${escapeHtml(livro.autor)}</span>
                </div>
                <div class="book-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${livro.ano_publi}</span>
                </div>
                <div class="book-detail">
                    <i class="fas fa-tag"></i>
                    <span>${escapeHtml(livro.genero)}</span>
                </div>
                <div class="book-detail">
                    <i class="fas fa-boxes"></i>
                    <span>${livro.qt_estoque} unidades</span>
                </div>
            </div>

            <div class="book-actions">
                <button class="btn btn-edit" onclick="editarLivro(${livro.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-delete" onclick="mostrarConfirmacaoExclusao(${livro.id}, '${escapeHtml(livro.titulo)}')">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `;
}

function renderizarLivros() {
    const livrosFiltrados = obterLivrosFiltrados();

    if (livrosFiltrados.length === 0) {
        elementos.booksGrid.classList.add('hidden');
        elementos.emptyState.classList.remove('hidden');

        if (livros.length === 0) {
            document.getElementById('emptyTitle').textContent = 'Nenhum livro cadastrado';
            document.getElementById('emptyMessage').textContent = 'Comece adicionando seu primeiro livro à biblioteca.';
        } else {
            document.getElementById('emptyTitle').textContent = 'Nenhum livro encontrado';
            document.getElementById('emptyMessage').textContent = 'Tente ajustar os filtros para encontrar os livros desejados.';
        }
    } else {
        elementos.emptyState.classList.add('hidden');
        elementos.booksGrid.classList.remove('hidden');
        elementos.booksGrid.innerHTML = livrosFiltrados.map(criarCartaoLivro).join('');
    }
}

function obterLivrosFiltrados() {
    const termoBusca = elementos.searchInput.value.toLowerCase();
    const filtroGenero = elementos.genreFilter.value;

    return livros.filter(livro => {
        const correspondeBusca = livro.titulo.toLowerCase().includes(termoBusca) ||
                                 livro.autor.toLowerCase().includes(termoBusca);
        const correspondeGenero = filtroGenero === '' || livro.genero === filtroGenero;
        return correspondeBusca && correspondeGenero;
    });
}

function filtrarLivros() {
    renderizarLivros();
}

function abrirFormularioLivro(livro = null) {
    editandoLivroId = livro ? livro.id : null;

    const tituloModal = document.getElementById('modalTitle');
    const textoBotaoEnviar = document.getElementById('submitText');

    if (livro) {
        tituloModal.textContent = 'Editar Livro';
        textoBotaoEnviar.textContent = 'Atualizar';
        preencherFormulario(livro);
    } else {
        tituloModal.textContent = 'Adicionar Novo Livro';
        textoBotaoEnviar.textContent = 'Salvar';
        limparFormulario();
    }

    elementos.bookModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        document.getElementById('titulo').focus();
    }, 100);
}

function fecharFormularioLivro() {
    elementos.bookModal.classList.add('hidden');
    document.body.style.overflow = '';
    limparErrosFormulario();
    editandoLivroId = null;
}

function preencherFormulario(livro) {
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('ano_publi').value = livro.ano_publi;
    document.getElementById('genero').value = livro.genero;
    document.getElementById('qt_estoque').value = livro.qt_estoque;
}

function limparFormulario() {
    elementos.bookForm.reset();
}

function limparErrosFormulario() {
    const elementosErro = document.querySelectorAll('.error-text');
    elementosErro.forEach(elemento => {
        elemento.textContent = '';
    });

    const elementosEntrada = document.querySelectorAll('.form-group input, .form-group select');
    elementosEntrada.forEach(elemento => {
        elemento.classList.remove('error');
    });
}

function validarFormulario() {
    limparErrosFormulario();

    const dadosFormulario = new FormData(elementos.bookForm);
    const erros = {};

    if (!dadosFormulario.get('titulo').trim()) {
        erros.titulo = 'Título é obrigatório';
    }

    if (!dadosFormulario.get('autor').trim()) {
        erros.autor = 'Autor é obrigatório';
    }

    if (!dadosFormulario.get('ano_publi')) {
        erros.ano_publi = 'Ano de publicação é obrigatório';
    } else {
        const ano = parseInt(dadosFormulario.get('ano_publi'));
        if (ano < 1000 || ano > new Date().getFullYear()) {
            erros.ano_publi = 'Ano inválido';
        }
    }

    if (!dadosFormulario.get('genero')) {
        erros.genero = 'Gênero é obrigatório';
    }

    if (!dadosFormulario.get('qt_estoque')) {
        erros.qt_estoque = 'Quantidade em estoque é obrigatória';
    } else {
        const estoque = parseInt(dadosFormulario.get('qt_estoque'));
        if (estoque < 0) {
            erros.qt_estoque = 'Quantidade não pode ser negativa';
        }
    }

    Object.keys(erros).forEach(campo => {
        const elementoErro = document.getElementById(`${campo}Error`);
        const elementoEntrada = document.getElementById(campo);

        if (elementoErro && elementoEntrada) {
            elementoErro.textContent = erros[campo];
            elementoEntrada.classList.add('error');
        }
    });

    return Object.keys(erros).length === 0;
}

async function lidarEnvioFormulario(e) {
    e.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const dadosFormulario = new FormData(elementos.bookForm);
    const dadosLivro = {
        titulo: dadosFormulario.get('titulo').trim(),
        autor: dadosFormulario.get('autor').trim(),
        ano_publi: parseInt(dadosFormulario.get('ano_publi')),
        genero: dadosFormulario.get('genero'),
        qt_estoque: parseInt(dadosFormulario.get('qt_estoque'))
    };

    const botaoEnviar = document.getElementById('submitBtn');
    const textoEnviar = document.getElementById('submitText');
    const textoOriginal = textoEnviar.textContent;

    try {
        botaoEnviar.disabled = true;
        textoEnviar.textContent = editandoLivroId ? 'Atualizando...' : 'Salvando...';

        if (editandoLivroId) {
            await atualizarLivro(editandoLivroId, dadosLivro);
        } else {
            await criarLivro(dadosLivro);
        }

        fecharFormularioLivro();

    } catch (error) {
        console.error('Error submitting form:', error);
    } finally {
        botaoEnviar.disabled = false;
        textoEnviar.textContent = textoOriginal;
    }
}

function editarLivro(id) {
    const livro = livros.find(b => b.id === id);
    if (livro) {
        abrirFormularioLivro(livro);
    }
}

function mostrarConfirmacaoExclusao(id, titulo) {
    excluindoLivroId = id;
    document.getElementById('confirmMessage').textContent =
        `Tem certeza que deseja excluir o livro "${titulo}"? Esta ação não pode ser desfeita.`;
    elementos.confirmModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalConfirmacao() {
    elementos.confirmModal.classList.add('hidden');
    document.body.style.overflow = '';
    excluindoLivroId = null;
}

async function confirmarExclusao() {
    if (!excluindoLivroId) return;

    const botaoConfirmar = document.getElementById('confirmDeleteBtn');
    const textoExcluir = document.getElementById('deleteText');

    try {
        botaoConfirmar.disabled = true;
        textoExcluir.textContent = 'Excluindo...';

        await excluirLivro(excluindoLivroId);
        fecharModalConfirmacao();

    } catch (error) {
        console.error('Error deleting book:', error);
    } finally {
        botaoConfirmar.disabled = false;
        textoExcluir.textContent = 'Excluir';
    }
}

function mostrarErro(mensagem) {
    document.getElementById('errorText').textContent = mensagem;
    elementos.errorMessage.classList.remove('hidden');

    setTimeout(esconderErro, 5000);
}

function esconderErro() {
    elementos.errorMessage.classList.add('hidden');
}

function mostrarSucesso(mensagem) {
    document.getElementById('successText').textContent = mensagem;
    elementos.successMessage.classList.remove('hidden');

    setTimeout(esconderSucesso, 3000);
}

function esconderSucesso() {
    elementos.successMessage.classList.add('hidden');
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

document.addEventListener('keydown', function(e) {

    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        abrirFormularioLivro();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        elementos.searchInput.focus();
    }
});