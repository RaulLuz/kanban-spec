# Exemplo Prático: Usando Specify com Cursor

Este documento mostra um exemplo completo de como usar os comandos do Specify no Cursor.

## Cenário: Criar Feature de Autenticação

### Passo 1: Criar Especificação

No chat do Cursor, digite:

```
/specify Adicionar autenticação de usuários com email e senha. Usuários devem poder se registrar, fazer login e recuperar senha.
```

**O que acontece:**
- A IA lê `.github/agents/speckit.specify.agent.md`
- Executa o script `create-new-feature.ps1`
- Cria branch `001-user-auth` (ou próximo número disponível)
- Gera `specs/001-user-auth/spec.md` com:
  - User stories priorizadas (P1, P2, P3)
  - Functional requirements
  - Success criteria
  - Key entities

### Passo 2: Clarificar (se necessário)

Se a spec tiver áreas vagas, use:

```
/clarify
```

A IA analisa a spec e faz perguntas direcionadas se necessário.

### Passo 3: Criar Plano Técnico

```
/plan Estou construindo com React, TypeScript, Node.js, Express e PostgreSQL
```

**O que acontece:**
- A IA lê `.github/agents/speckit.plan.agent.md`
- Executa `setup-plan.ps1`
- Gera `specs/001-user-auth/plan.md` com:
  - Technical context
  - Constitution check
  - Research decisions
  - Data model
  - API contracts

### Passo 4: Gerar Tasks

```
/tasks
```

**O que acontece:**
- A IA lê `.github/agents/speckit.tasks.agent.md`
- Analisa `spec.md` e `plan.md`
- Gera `specs/001-user-auth/tasks.md` com:
  - Tasks organizadas por user story
  - Dependências entre tasks
  - Tasks paralelizáveis marcadas com [P]
  - Estratégia de implementação MVP

**Exemplo de tasks geradas:**
```markdown
## Phase 1: Setup
- [ ] T001 Criar estrutura do projeto
- [ ] T002 Configurar dependências

## Phase 2: Foundational
- [ ] T003 Configurar banco de dados
- [ ] T004 Criar modelos base

## Phase 3: User Story 1 - Registro (P1)
- [ ] T005 [P] [US1] Criar modelo User em src/models/user.ts
- [ ] T006 [US1] Implementar serviço de registro em src/services/auth.ts
- [ ] T007 [US1] Criar endpoint POST /api/auth/register
```

### Passo 5: Analisar Consistência

```
/analyze
```

**O que acontece:**
- A IA lê `.github/agents/speckit.analyze.agent.md`
- Compara `spec.md`, `plan.md` e `tasks.md`
- Gera relatório de consistência
- Identifica problemas antes da implementação

### Passo 6: Implementar

```
/implement
```

**O que acontece:**
- A IA lê `.github/agents/speckit.implement.agent.md`
- Verifica status dos checklists
- Executa tasks em ordem:
  - Setup primeiro
  - Tasks sequenciais em ordem
  - Tasks paralelas [P] podem ser executadas juntas
- Marca tasks completadas com `[X]` em `tasks.md`
- Segue TDD quando aplicável

## Comandos Adicionais Úteis

### Criar Checklist

```
/checklist UX para autenticação
```

Cria `specs/001-user-auth/checklists/ux.md` com checklist de UX.

### Ver Constitution

```
/constitution mostrar princípios
```

Mostra os princípios do projeto definidos em `.specify/memory/constitution.md`.

## Preenchimento Automático

Quando você está editando `spec.md` manualmente, a IA sugere automaticamente:

- Estrutura baseada no template
- Formato correto para user stories
- Success criteria mensuráveis
- Requirements testáveis

## Dicas Avançadas

### Combinar Comandos

Você pode combinar comandos em uma única mensagem:

```
/specify Adicionar autenticação
/clarify
/plan Estou usando React e Node.js
```

### Contexto Mantido

O Cursor mantém contexto entre comandos, então você pode fazer perguntas:

```
/specify Adicionar autenticação
Por que você priorizou registro antes de login?
```

### Edição Manual + IA

Você pode editar manualmente e pedir ajuda:

```
Editei a spec para adicionar OAuth2. Pode atualizar o plan?
```

A IA lerá sua spec editada e atualizará o plan correspondente.

## Estrutura de Arquivos Gerada

```
kanban/
├── .cursorrules                    # Configuração da integração
├── .specify/
│   ├── memory/
│   │   └── constitution.md         # Princípios do projeto
│   ├── templates/                  # Templates
│   └── CURSOR_INTEGRATION.md       # Este guia
└── specs/
    └── 001-user-auth/
        ├── spec.md                 # Especificação
        ├── plan.md                 # Plano técnico
        ├── tasks.md                # Tasks de implementação
        ├── data-model.md           # Modelo de dados
        ├── research.md             # Decisões técnicas
        ├── contracts/              # Contratos de API
        │   └── auth.yaml
        └── checklists/             # Checklists
            └── requirements.md
```

## Próximos Passos

1. Experimente criar uma feature simples
2. Veja como os comandos funcionam juntos
3. Ajuste a constitution conforme necessário
4. Customize os templates se precisar
