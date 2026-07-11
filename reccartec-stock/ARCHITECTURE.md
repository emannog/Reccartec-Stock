# Arquitetura do Sistema Reccartec Stock

## Visão Geral

O sistema Reccartec Stock segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades. Esta arquitetura promove manutenibilidade, testabilidade e escalabilidade.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        Camada UI                              │
│  (Next.js Pages + React Components + TailwindCSS)           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────┐
│                    Camada Controller                         │
│              (Next.js API Routes)                           │
│  - Validação de requisições                                  │
│  - Tratamento de erros HTTP                                  │
│  - Respostas JSON                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Camada Service                            │
│         (Business Logic Layer)                               │
│  - Regras de negócio                                         │
│  - Validação de dados                                       │
│  - Coordenação de repositories                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Camada Repository                           │
│           (Data Access Layer)                                │
│  - Abstração do banco de dados                              │
│  - Operações CRUD                                           │
│  - Queries complexas                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Camada Database                            │
│              (Prisma ORM + SQLite)                           │
└─────────────────────────────────────────────────────────────┘
```

## Camadas Detalhadas

### 1. Camada de Apresentação (UI Layer)

**Responsabilidade:** Interface do usuário e interação

**Tecnologias:**
- Next.js 14 App Router
- React 18
- TailwindCSS
- Lucide React (ícones)
- shadcn/ui (componentes)

**Componentes:**
- `src/app/page.tsx` - Página inicial
- `src/app/produtos/page.tsx` - Gestão de produtos
- `src/app/categorias/page.tsx` - Gestão de categorias
- `src/app/movimentacoes/page.tsx` - Histórico de movimentações
- `src/components/ui/` - Componentes reutilizáveis

**Características:**
- Design responsivo (mobile-first)
- Client-side rendering para interatividade
- Server-side rendering para performance
- Navegação SPA com Next.js

### 2. Camada de Controle (Controller Layer)

**Responsabilidade:** Gerenciar requisições HTTP e respostas

**Tecnologias:**
- Next.js API Routes
- TypeScript

**Endpoints:**
```
/api/categorias          - CRUD de categorias
/api/produtos            - CRUD de produtos
/api/produtos/[id]/entrada  - Registrar entrada
/api/produtos/[id]/saida    - Registrar saída
/api/produtos/[id]/ajuste   - Ajustar estoque
/api/produtos/baixo-estoque - Produtos com baixo estoque
/api/movimentacoes       - Listar movimentações
```

**Características:**
- Validação básica de entrada
- Tratamento de erros HTTP
- Respostas JSON padronizadas
- Status codes apropriados

### 3. Camada de Serviço (Service Layer)

**Responsabilidade:** Lógica de negócio e regras de domínio

**Tecnologias:**
- TypeScript
- Padrão Repository

**Serviços:**
- `CategoriaService` - Lógica de categorias
- `ProdutoService` - Lógica de produtos e estoque
- `MovimentacaoService` - Lógica de movimentações

**Regras de Negócio Implementadas:**

**CategoriaService:**
- Validação de nome único
- Verificação de existência antes de atualizar/deletar
- Validação de produtos associados antes de deletar

**ProdutoService:**
- Validação de SKU único
- Validação de preço não negativo
- Validação de quantidade não negativa
- Validação de estoque mínimo não negativo
- Verificação de estoque suficiente para saídas
- Registro automático de movimentações
- Alerta de produtos com baixo estoque

**MovimentacaoService:**
- Validação de tipos válidos (ENTRADA, SAIDA, AJUSTE)
- Validação de quantidade positiva

**Características:**
- Injeção de dependências para testabilidade
- Tratamento de erros de domínio
- Transações implícitas via Prisma
- Separação clara de responsabilidades

### 4. Camada de Acesso a Dados (Repository Layer)

**Responsabilidade:** Abstração do banco de dados

**Tecnologias:**
- Prisma ORM
- TypeScript

**Repositories:**
- `CategoriaRepository` - Acesso a dados de categorias
- `ProdutoRepository` - Acesso a dados de produtos
- `MovimentacaoRepository` - Acesso a dados de movimentações

**Interfaces:**
- `ICategoriaRepository` - Contrato para categoria
- `IProdutoRepository` - Contrato para produto
- `IMovimentacaoRepository` - Contrato para movimentação

**Características:**
- Padrão Repository para abstração
- Type-safe com TypeScript
- Queries otimizadas com Prisma
- Facilidade de mocking para testes

### 5. Camada de Persistência (Database Layer)

**Responsabilidade:** Armazenamento de dados

**Tecnologias:**
- Prisma ORM
- SQLite (desenvolvimento)
- PostgreSQL/MySQL (produção)

**Schema:**
```prisma
model Categoria {
  id        Int       @id @default(autoincrement())
  nome      String    @unique
  descricao String?
  produtos  Produto[]
}

model Produto {
  id          Int            @id @default(autoincrement())
  nome        String
  descricao   String?
  sku         String         @unique
  preco       Float
  quantidade  Int            @default(0)
  minimo      Int            @default(0)
  categoriaId Int
  categoria   Categoria      @relation(fields: [categoriaId], references: [id])
  movimentacoes Movimentacao[]
}

model Movimentacao {
  id        Int      @id @default(autoincrement())
  tipo      String   // ENTRADA, SAIDA, AJUSTE
  quantidade Int
  produtoId Int
  produto   Produto  @relation(fields: [produtoId], references: [id])
  motivo    String?
}
```

**Características:**
- Migrações versionadas
- Type-safe queries
- Relacionamentos definidos
- Índices automáticos em campos unique

## Padrões e Princípios

### Padrões Utilizados

1. **Repository Pattern**
   - Abstração do acesso a dados
   - Facilita testes e mudanças de banco

2. **Dependency Injection**
   - Injeção de dependências via construtor
   - Melhora testabilidade

3. **Service Layer Pattern**
   - Separação de lógica de negócio
   - Reutilização de código

4. **DTO Pattern**
   - Transferência de dados entre camadas
   - Validação de entrada

### Princípios SOLID

1. **Single Responsibility Principle (SRP)**
   - Cada classe tem uma única responsabilidade
   - Repositories apenas acessam dados
   - Services contêm lógica de negócio

2. **Open/Closed Principle (OCP)**
   - Aberto para extensão
   - Fechado para modificação
   - Interfaces definem contratos

3. **Liskov Substitution Principle (LSP)**
   - Implementações podem substituir interfaces
   - Comportamento consistente

4. **Interface Segregation Principle (ISP)**
   - Interfaces específicas e focadas
   - Não forçam métodos não utilizados

5. **Dependency Inversion Principle (DIP)**
   - Dependência de abstrações, não implementações
   - Services dependem de interfaces de Repository

## Fluxo de Dados

### Exemplo: Criar Produto

```
1. Usuário preenche formulário (UI)
   ↓
2. POST /api/produtos (Controller)
   ↓
3. ProdutoService.create(data) (Service)
   - Valida SKU único
   - Valida preço não negativo
   - Valida quantidade não negativa
   ↓
4. ProdutoRepository.create(data) (Repository)
   - Executa query no banco
   ↓
5. Prisma ORM (Database)
   - Insere registro
   ↓
6. Retorna produto criado
   ↓
7. Controller retorna JSON
   ↓
8. UI atualiza lista
```

### Exemplo: Registrar Entrada

```
1. Usuário clica em "Entrada" (UI)
   ↓
2. POST /api/produtos/[id]/entrada (Controller)
   ↓
3. ProdutoService.registrarEntrada(id, quantidade) (Service)
   - Verifica se produto existe
   - Valida quantidade positiva
   ↓
4. MovimentacaoRepository.create(tipo, quantidade, produtoId) (Repository)
   - Cria registro de movimentação
   ↓
5. ProdutoRepository.updateQuantidade(id, novaQuantidade) (Repository)
   - Atualiza quantidade do produto
   ↓
6. Prisma ORM (Database)
   - Executa transação
   ↓
7. Retorna produto atualizado
   ↓
8. Controller retorna JSON
   ↓
9. UI atualiza display
```

## Segurança

### Validações Implementadas

1. **Validação de Entrada**
   - Tipos de dados
   - Valores obrigatórios
   - Valores negativos

2. **Validação de Negócio**
   - SKU único
   - Nome de categoria único
   - Estoque suficiente para saídas

3. **Tratamento de Erros**
   - Erros de domínio específicos
   - Mensagens claras para o usuário
   - Logs de erro

### Recomendações Futuras

1. **Autenticação e Autorização**
   - JWT tokens
   - Role-based access control
   - Proteção de rotas

2. **Rate Limiting**
   - Limitar requisições por IP
   - Prevenir abuso

3. **Input Sanitization**
   - Sanitizar inputs do usuário
   - Prevenir XSS

4. **HTTPS**
   - SSL/TLS em produção
   - Certificados válidos

## Performance

### Otimizações Implementadas

1. **Next.js App Router**
   - Server-side rendering
   - Static generation onde possível
   - Code splitting automático

2. **Prisma ORM**
   - Queries otimizadas
   - Eager loading de relacionamentos
   - Connection pooling

3. **TailwindCSS**
   - CSS purgado em produção
   - Classes otimizadas
   - No CSS unused

### Recomendações Futuras

1. **Caching**
   - Redis para cache de queries frequentes
   - Cache de respostas API

2. **Database Indexing**
   - Índices adicionais para queries comuns
   - Índices compostos

3. **Pagination**
   - Paginação em listas grandes
   - Infinite scroll

## Escalabilidade

### Estratégias de Escala

1. **Horizontal Scaling**
   - Múltiplas instâncias do servidor
   - Load balancer
   - Stateless API

2. **Database Scaling**
   - Read replicas
   - Database sharding
   - Connection pooling

3. **CDN**
   - Assets estáticos em CDN
   - Edge caching

## Monitoramento e Logging

### Recomendações Futuras

1. **Application Logging**
   - Winston ou Pino
   - Estruturação de logs
   - Níveis de log

2. **Error Tracking**
   - Sentry ou Bugsnag
   - Alertas em tempo real
   - Stack traces

3. **Performance Monitoring**
   - APM (Application Performance Monitoring)
   - Métricas de resposta
   - Monitoramento de uptime

## Testes

### Estrutura de Testes

1. **Testes Unitários**
   - Testes de Services
   - Testes de Repositories (com mocks)
   - Cobertura de lógica de negócio

2. **Testes de Integração**
   - Testes de API Routes
   - Testes de fluxos completos
   - Testes de database

3. **Testes E2E**
   - Testes de UI com Playwright
   - Testes de fluxos de usuário
   - Testes cross-browser

## Conclusão

Esta arquitetura proporciona uma base sólida e escalável para o sistema de gestão de estoque. A separação clara de responsabilidades facilita manutenção, testes e evolução do sistema. Os padrões utilizados são amplamente reconhecidos na indústria, garantindo qualidade e facilidade de onboarding de novos desenvolvedores.
