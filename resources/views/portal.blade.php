<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teckavan - Biblioteca</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>

    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <i class="fas fa-book"></i>
                    <div>
                        <h1>Biblioteca Teckavan</h1>
                        <p>Gerencie seu estoque de livros</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="abrirFormularioLivro()">
                    <i class="fas fa-plus"></i>
                    Adicionar Livro
                </button>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">

            <div id="errorMessage" class="error-message hidden">
                <i class="fas fa-exclamation-circle"></i>
                <span id="errorText"></span>
                <button onclick="esconderErro()" class="error-close">&times;</button>
            </div>

            <div id="successMessage" class="success-message hidden">
                <i class="fas fa-check-circle"></i>
                <span id="successText"></span>
                <button onclick="esconderSucesso()" class="success-close">&times;</button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-content">
                        <div>
                            <p class="stat-label">Total de Livros</p>
                            <p class="stat-value" id="totalBooks">0</p>
                        </div>
                        <i class="fas fa-book stat-icon"></i>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div>
                            <p class="stat-label">Total em Estoque</p>
                            <p class="stat-value" id="totalStock">0</p>
                        </div>
                        <i class="fas fa-boxes stat-icon stat-icon-green"></i>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-content">
                        <div>
                            <p class="stat-label">Estoque Baixo</p>
                            <p class="stat-value" id="lowStock">0</p>
                        </div>
                        <i class="fas fa-exclamation-triangle stat-icon stat-icon-yellow"></i>
                    </div>
                </div>
            </div>

            <div class="search-filter">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Buscar por título ou autor..." onkeyup="filtrarLivros()">
                </div>
                <div class="filter-box">
                    <i class="fas fa-filter"></i>
                    <select id="genreFilter" onchange="filtrarLivros()">
                        <option value="">Todos os gêneros</option>
                        <option value="Romance">Romance</option>
                        <option value="Ficção">Ficção</option>
                        <option value="Não-ficção">Não-ficção</option>
                        <option value="Mistério">Mistério</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Ficção Científica">Ficção Científica</option>
                        <option value="Biografia">Biografia</option>
                        <option value="História">História</option>
                        <option value="Autoajuda">Autoajuda</option>
                    </select>
                </div>
            </div>

            <div id="loadingSpinner" class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando biblioteca...</p>
            </div>

            <div id="emptyState" class="empty-state hidden">
                <i class="fas fa-book"></i>
                <h3 id="emptyTitle">Nenhum livro cadastrado</h3>
                <p id="emptyMessage">Comece adicionando seu primeiro livro à biblioteca.</p>
                <button class="btn btn-primary" onclick="abrirFormularioLivro()">
                    <i class="fas-sm fa-plus"></i> Adicionar Primeiro Livro
                </button>
            </div>

            <div id="booksGrid" class="books-grid hidden"></div>
        </div>
    </main>

    <div id="bookModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-book"></i>
                    <h2 id="modalTitle">Adicionar Novo Livro</h2>
                </div>
                <button class="modal-close" onclick="fecharFormularioLivro()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <form id="bookForm" class="book-form">
                <div class="form-group">
                    <label for="titulo">Título *</label>
                    <input type="text" id="titulo" name="titulo" required>
                    <span class="error-text" id="tituloError"></span>
                </div>

                <div class="form-group">
                    <label for="autor">Autor *</label>
                    <input type="text" id="autor" name="autor" required>
                    <span class="error-text" id="autorError"></span>
                </div>

                <div class="form-group">
                    <label for="ano_publi">Ano de Publicação *</label>
                    <input type="number" id="ano_publi" name="ano_publi" min="1000" max="2025" required>
                    <span class="error-text" id="ano_publiError"></span>
                </div>

                <div class="form-group">
                    <label for="genero">Gênero *</label>
                    <select id="genero" name="genero" required>
                        <option value="">Selecione um gênero</option>
                        <option value="Romance">Romance</option>
                        <option value="Ficção">Ficção</option>
                        <option value="Não-ficção">Não-ficção</option>
                        <option value="Mistério">Mistério</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Ficção Científica">Ficção Científica</option>
                        <option value="Biografia">Biografia</option>
                        <option value="História">História</option>
                        <option value="Autoajuda">Autoajuda</option>
                        <option value="Outro">Outro</option>
                    </select>
                    <span class="error-text" id="generoError"></span>
                </div>

                <div class="form-group">
                    <label for="qt_estoque">Quantidade em Estoque *</label>
                    <input type="number" id="qt_estoque" name="qt_estoque" min="0" required>
                    <span class="error-text" id="qt_estoqueError"></span>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="fecharFormularioLivro()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary" id="submitBtn">
                        <i class="fas fa-save"></i>
                        <span id="submitText">Salvar</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div id="confirmModal" class="modal hidden">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-exclamation-triangle text-red"></i>
                    <h2>Confirmar Exclusão</h2>
                </div>
                <button class="modal-close" onclick="fecharModalConfirmacao()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <p id="confirmMessage">Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.</p>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="fecharModalConfirmacao()">
                    Cancelar
                </button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn" onclick="confirmarExclusao()">
                    <i class="fas fa-trash"></i>
                    <span id="deleteText">Excluir</span>
                </button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
