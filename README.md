# Teckavan Books

Sistema de gerenciamento de biblioteca com cadastro, edição, exclusão e listagem de livros.

## Como executar a aplicação no GitHub Codespaces

1. **Abra o projeto no seu Codespaces:**
   - Clique em **"Code" > "Codespaces" > Clique no sinal de + com a legenda "Create a codespace on main"** no repositório deste projeto do GitHub.

2. **Aguarde o ambiente iniciar.**  
   O Codespaces já instala as dependências automaticamente (via `postCreateCommand`).
   Se atente ao Google Translate, ele pode prejudicar o funcionamento do Codespaces então desligue se ele ativar automaticamente ao acessar a página.

3. **Configure o ambiente (se necessário):**
   - O arquivo `.env` já está pronto para uso com SQLite e a URL do Codespaces.
   - Se precisar, gere a chave do Laravel (verifique se o arquivo `.env` já contém a chave):
     ```bash
     php artisan key:generate
     ```

4. **Execute as migrações do banco de dados (se necessário):**
   ```bash
   php artisan migrate
   ```

5. **Inicie o servidor Laravel:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
   > O Codespaces irá expor a porta e mostrar um link para acessar a aplicação.

6. **Acesse a aplicação:**
   - Clique no link gerado pelo Codespaces (geralmente algo como `https://<seu-usuario>-8000.<hash>.github.dev`).

---

## Linguagem e Banco de Dados

- **Linguagem:** PHP (Laravel)
- **Frontend:** HTML, CSS, JavaScript puro
- **Banco de Dados:** SQLite (já configurado para uso no Codespaces)

---

## Bibliotecas e Frameworks Utilizados

- [Laravel](https://laravel.com/) (backend/API)
- [Font Awesome](https://fontawesome.com/) (ícones)
- JavaScript puro no frontend

---

## Como testar cada funcionalidade do CRUD

1. **Criar Livro**
   - Clique em "Adicionar Livro"
   - Preencha o formulário e clique em "Salvar"
   - O livro aparecerá na lista

2. **Listar Livros**
   - Todos os livros cadastrados aparecem na tela inicial
   - Use a busca ou filtro de gênero para refinar a lista

3. **Editar Livro**
   - Clique no botão "Editar" no cartão do livro desejado
   - Altere as informações e clique em "Salvar"
   - As alterações serão refletidas na lista

4. **Excluir Livro**
   - Clique no botão "Excluir" no cartão do livro desejado
   - O livro será removido da lista

---

## Observações

- O sistema exibe mensagens de sucesso e erro para cada ação.
- O backend deve estar rodando para que o frontend funcione corretamente.
- O banco SQLite já está configurado para facilitar o uso no Codespaces.

---
