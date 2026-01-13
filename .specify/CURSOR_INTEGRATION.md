# Integração Specify com Cursor

Este guia explica como usar os prompts do Specify (spec-kit) com a IA do Cursor.

## Como Funciona

O arquivo `.cursorrules` na raiz do projeto integra automaticamente os prompts do Specify com a IA do Cursor. Quando você usar qualquer comando do Specify no chat do Cursor, a IA executará o workflow correspondente.

## Comandos Disponíveis

### `/specify` ou `/speckit.specify`
Cria ou atualiza a especificação de uma feature.

**Exemplo:**
```
/specify Adicionar autenticação de usuários com email e senha
```

**O que faz:**
- Cria uma nova branch de feature
- Gera `spec.md` com user stories, requirements e success criteria
- Valida a qualidade da especificação

---

### `/clarify` ou `/speckit.clarify`
Identifica áreas que precisam de esclarecimento na especificação.

**Exemplo:**
```
/clarify
```

**O que faz:**
- Analisa a spec atual
- Identifica até 5 áreas que precisam de clarificação
- Atualiza a spec com as respostas

---

### `/plan` ou `/speckit.plan`
Cria o plano técnico de implementação.

**Exemplo:**
```
/plan Estou construindo com React, TypeScript e Node.js
```

**O que faz:**
- Gera `plan.md` com contexto técnico
- Cria `research.md` para decisões técnicas
- Gera `data-model.md` e contratos de API
- Atualiza o contexto do agente

---

### `/tasks` ou `/speckit.tasks`
Gera lista de tasks ordenadas por dependências.

**Exemplo:**
```
/tasks
```

**O que faz:**
- Lê `spec.md` e `plan.md`
- Gera `tasks.md` com tasks organizadas por user story
- Identifica tasks paralelizáveis
- Cria dependências entre tasks

---

### `/analyze` ou `/speckit.analyze`
Analisa consistência entre spec, plan e tasks.

**Exemplo:**
```
/analyze
```

**O que faz:**
- Verifica consistência entre documentos
- Identifica duplicações e ambiguidades
- Gera relatório de análise (somente leitura)

---

### `/implement` ou `/speckit.implement`
Executa a implementação seguindo as tasks.

**Exemplo:**
```
/implement
```

**O que faz:**
- Verifica status dos checklists
- Lê `tasks.md` e executa tasks em ordem
- Marca tasks completadas
- Segue TDD quando aplicável

---

### `/checklist` ou `/speckit.checklist`
Cria checklist para um domínio específico.

**Exemplo:**
```
/checklist UX para autenticação
```

**O que faz:**
- Gera checklist baseado no template
- Salva em `checklists/[nome].md`

---

### `/constitution` ou `/speckit.constitution`
Gerencia a constitution do projeto.

**Exemplo:**
```
/constitution mostrar princípios
```

## Workflow Recomendado

### 1. Criar Feature
```
/specify Descrição da feature que você quer criar
```

### 2. Clarificar (se necessário)
```
/clarify
```

### 3. Planejar Implementação
```
/plan Estou construindo com [suas tecnologias]
```

### 4. Gerar Tasks
```
/tasks
```

### 5. Analisar Consistência
```
/analyze
```

### 6. Implementar
```
/implement
```

## Preenchimento Automático

A IA do Cursor também ajuda automaticamente quando você está editando:

- **spec.md**: Sugere estrutura baseada no template
- **plan.md**: Sugere seções baseadas no template
- **tasks.md**: Formata tasks corretamente
- **checklists/**: Usa o template de checklist

## Diferenças do GitHub Copilot

No GitHub Copilot, os comandos são executados como agentes separados. No Cursor:

- ✅ Todos os comandos funcionam no mesmo chat
- ✅ Contexto é mantido entre comandos
- ✅ Você pode combinar comandos em uma conversa
- ✅ A IA entende o estado atual do projeto

## Dicas

1. **Sempre comece com `/specify`** para criar uma nova feature
2. **Use `/clarify`** se a spec ficar muito vaga
3. **Execute `/plan`** antes de começar a implementar
4. **Use `/analyze`** para validar antes de implementar
5. **Execute `/implement`** quando estiver pronto para codificar

## Troubleshooting

### Comando não funciona
- Verifique se você está no diretório raiz do projeto
- Certifique-se de que o arquivo `.cursorrules` existe
- Tente usar o nome completo do comando (ex: `/speckit.specify`)

### Scripts PowerShell não executam
- No Windows, use PowerShell ou Git Bash
- Certifique-se de que os scripts têm permissão de execução
- Use caminhos absolutos quando necessário

### Templates não são encontrados
- Verifique se `.specify/templates/` existe
- Certifique-se de que os templates estão presentes
- Verifique os caminhos no `.cursorrules`

## Arquivos Importantes

- `.cursorrules`: Configuração principal da integração
- `.specify/memory/constitution.md`: Princípios do projeto
- `.specify/templates/`: Templates usados pelos comandos
- `.github/agents/`: Definições dos prompts dos agentes
