# Guia de Testes - Kanban Board

## Status da Implementação

### ✅ Funcionalidades Implementadas

#### Phase 1: Setup ✅
- Projeto Next.js 14 configurado
- TypeScript, Tailwind CSS, ESLint configurados
- Todas as dependências instaladas

#### Phase 2: Foundational ✅
- Banco de dados SQLite configurado
- Schema Drizzle ORM criado
- Modelos de domínio (Board, Column, Task, Subtask)
- Utilitários e validações
- API infrastructure

#### Phase 3: User Story 1 - Create and Manage Boards ✅
- Criar boards
- Listar boards na sidebar
- Selecionar board ativo
- Deletar boards (com proteção do último board)
- Toggle de tema (light/dark) na sidebar

#### Phase 4: User Story 2 - Manage Tasks with Subtasks ✅
- Criar tasks com título e descrição
- Adicionar subtasks a tasks
- Marcar subtasks como completas
- Visualizar tasks com subtasks
- Editar tasks

#### Phase 5: User Story 3 - Drag and Drop ✅
- Arrastar tasks entre colunas
- Feedback visual durante drag
- Validação de coluna de destino

#### Phase 6: User Story 4 - Customize Column Colors ✅
- Editar nome e cor das colunas
- Color picker com presets e custom
- Indicador de cor visível

## Como Testar

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### 2. Testar Funcionalidades

#### Teste 1: Criar e Gerenciar Boards
1. Abra `http://localhost:3000`
2. Clique em "+ Create New Board" na sidebar
3. Digite um nome para o board
4. Verifique se o board aparece na sidebar
5. Clique no board para selecioná-lo
6. Tente deletar um board (não deve permitir deletar o último)

#### Teste 2: Criar Tasks e Subtasks
1. Com um board selecionado, clique em "+ New Task" em uma coluna
2. Preencha título e descrição
3. Selecione a coluna/status
4. Crie a task
5. Clique na task para visualizar detalhes
6. Adicione subtasks
7. Marque subtasks como completas usando checkboxes

#### Teste 3: Drag and Drop
1. Crie algumas tasks em diferentes colunas
2. Arraste uma task de uma coluna para outra
3. Verifique se a task aparece na nova coluna
4. Verifique se a posição foi atualizada

#### Teste 4: Customizar Cores das Colunas
1. Passe o mouse sobre o header de uma coluna
2. Clique no ícone de editar que aparece
3. Altere o nome da coluna
4. Selecione uma cor diferente (preset ou custom)
5. Salve e verifique se a cor foi atualizada

#### Teste 5: Toggle de Tema
1. Na parte inferior da sidebar, encontre o toggle de tema
2. Clique para alternar entre light e dark mode
3. Verifique se todas as cores mudam adequadamente

### 3. Executar Testes Automatizados

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E (requer servidor rodando)
npm run test:e2e
```

## Problemas Conhecidos

- Alguns testes E2E ainda precisam ser implementados completamente
- A funcionalidade de deletar task precisa ser finalizada
- Alguns edge cases podem precisar de tratamento adicional

## Próximos Passos

- User Story 5: View Task Cards (já parcialmente implementado)
- User Story 6: Light/Dark Mode (já parcialmente implementado)
- Phase 9: Polish & Cross-Cutting Concerns

## Estrutura do Banco de Dados

O banco de dados SQLite será criado automaticamente em `./data/kanban.db` na primeira execução.

## Notas Importantes

- O banco de dados é criado automaticamente com um board padrão na primeira execução
- As colunas padrão (Todo, Doing, Done) são criadas automaticamente com cada board
- O tema é persistido apenas na sessão atual (não está salvo no banco ainda)
