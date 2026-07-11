# Guia Passo a Passo - Reccartec Stock

Este guia fornece instruções detalhadas para instalar, configurar e utilizar o sistema de gestão de estoque Reccartec.

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Execução](#execução)
5. [Uso do Sistema](#uso-do-sistema)
6. [Testes](#testes)
7. [Deploy](#deploy)
8. [Solução de Problemas](#solução-de-problemas)

## Pré-requisitos

### Software Necessário

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
  - Download: https://nodejs.org/
  - Verifique a versão: `node --version`

- **npm** (geralmente instalado com Node.js)
  - Verifique a versão: `npm --version`

- **Git** (opcional, para clonar o repositório)
  - Download: https://git-scm.com/
  - Verifique a versão: `git --version`

### Verificação de Pré-requisitos

Abra um terminal e execute:

```bash
node --version
npm --version
```

Se as versões forem exibidas, você está pronto para prosseguir.

## Instalação

### Passo 1: Obter o Código

#### Opção A: Clonar do Git (se disponível)

```bash
git clone <repository-url>
cd reccartec-stock
```

#### Opção B: Baixar ZIP

1. Baixe o arquivo ZIP do repositório
2. Extraia para uma pasta
3. Navegue até a pasta: `cd reccartec-stock`

### Passo 2: Instalar Dependências

No diretório do projeto, execute:

```bash
npm install
```

Este comando irá:
- Ler o arquivo `package.json`
- Baixar todas as dependências listadas
- Instalar na pasta `node_modules`

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

**Saída esperada:**
```
added 245 packages in 32s
```

### Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
DATABASE_URL="file:./dev.db"
```

**Nota:** Não commitar o arquivo `.env` (já está no .gitignore)

## Configuração

### Passo 1: Configurar o Banco de Dados

O projeto usa Prisma ORM com SQLite para desenvolvimento.

#### Gerar Cliente Prisma

```bash
npx prisma generate
```

Este comando gera o cliente Prisma TypeScript.

**Saída esperada:**
```
✔ Generated Prisma Client
```

#### Executar Migrações

```bash
npx prisma migrate dev --name init
```

Este comando:
- Cria o banco de dados SQLite
- Executa as migrações
- Cria as tabelas (Categoria, Produto, Movimentacao)

**Saída esperada:**
```
Applying migration `20240101000000_init`

The following migration has been applied:

migrations/
  └─ 20240101000000_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

### Passo 2: (Opcional) Visualizar Banco de Dados

Para visualizar e editar o banco de dados graficamente:

```bash
npx prisma studio
```

Isso abrirá o Prisma Studio em http://localhost:5555

## Execução

### Modo Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

**Saída esperada:**
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000
```

Acesse http://localhost:3000 no navegador.

### Modo Produção

Para build e execução em produção:

```bash
# Build do projeto
npm run build

# Iniciar servidor de produção
npm start
```

## Uso do Sistema

### Primeiro Acesso

Ao acessar http://localhost:3000, você verá a página inicial com três cards de navegação:

1. **Produtos** - Gestão do catálogo de produtos
2. **Categorias** - Organização por categorias
3. **Movimentações** - Histórico de entradas e saídas

### Criar Categorias

1. Clique em "Categorias"
2. Clique em "Nova Categoria"
3. Preencha o formulário:
   - **Nome**: Eletrônicos
   - **Descrição**: Produtos eletrônicos em geral
4. Clique em "Salvar"

**Dica:** Crie categorias antes de adicionar produtos.

### Criar Produtos

1. Clique em "Produtos"
2. Clique em "Novo Produto"
3. Preencha o formulário:
   - **Nome**: Smartphone XYZ
   - **Descrição**: Smartphone de última geração
   - **SKU**: SKU001 (deve ser único)
   - **Preço**: 999.99
   - **Quantidade**: 10
   - **Estoque Mínimo**: 5
   - **Categoria**: Selecione uma categoria criada
4. Clique em "Salvar"

### Registrar Entrada de Estoque

1. Na página de Produtos
2. Encontre o produto desejado
3. Clique no ícone de seta para baixo (verde)
4. Digite a quantidade a adicionar
5. (Opcional) Digite o motivo
6. Confirme

**Resultado:** A quantidade do produto será aumentada e uma movimentação será registrada.

### Registrar Saída de Estoque

1. Na página de Produtos
2. Encontre o produto desejado
3. Clique no ícone de seta para cima (vermelho)
4. Digite a quantidade a remover
5. (Opcional) Digite o motivo
6. Confirme

**Nota:** Não é possível remover mais do que o estoque disponível.

### Ajustar Estoque

1. Na página de Produtos
2. Encontre o produto desejado
3. Clique no ícone de ajuste (azul)
4. Digite a nova quantidade exata
5. (Opcional) Digite o motivo
6. Confirme

**Resultado:** O estoque será definido exatamente para a quantidade informada.

### Visualizar Movimentações

1. Clique em "Movimentações"
2. Você verá todas as entradas, saídas e ajustes
3. Cada movimentação mostra:
   - Tipo (ENTRADA, SAIDA, AJUSTE)
   - Produto relacionado
   - Quantidade
   - Motivo (se informado)
   - Data e hora

### Buscar Produtos

1. Na página de Produtos
2. Use o campo de busca
3. Digite nome ou SKU
4. A lista será filtrada automaticamente

### Produtos com Baixo Estoque

Produtos com quantidade igual ou inferior ao estoque mínimo são destacados em vermelho.

## Testes

### Executar Testes Unitários

```bash
npm test
```

Isso executará todos os testes unitários dos Services.

**Saída esperada:**
```
PASS  src/services/__tests__/CategoriaService.test.ts
PASS  src/services/__tests__/ProdutoService.test.ts

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```

### Executar em Modo Watch

Para desenvolvimento de testes:

```bash
npm run test:watch
```

Os testes serão reexecutados automaticamente quando você salvar mudanças.

### Executar com Coverage

Para ver a cobertura de código:

```bash
npm run test:coverage
```

Isso gerará um relatório em `coverage/`.

### Executar Testes E2E

```bash
npm run test:e2e
```

Isso abrirá um navegador e executará os testes de ponta a ponta.

**Nota:** O servidor de desenvolvimento deve estar rodando.

## Deploy

### Deploy no Vercel (Recomendado)

1. **Criar conta no Vercel**
   - Acesse https://vercel.com
   - Crie uma conta gratuita

2. **Conectar Repositório**
   - Clique em "Add New Project"
   - Importe seu repositório do Git

3. **Configurar Variáveis de Ambiente**
   - Adicione `DATABASE_URL`
   - Para produção, use PostgreSQL:
     ```
     DATABASE_URL="postgresql://user:password@host:port/database"
     ```

4. **Deploy Automático**
   - O Vercel fará deploy automático
   - Você receberá uma URL do seu site

### Deploy em Outras Plataformas

#### Railway

1. Crie uma conta no Railway
2. Crie um novo projeto
3. Conecte seu repositório
4. Configure as variáveis de ambiente
5. Deploy automático

#### Netlify

1. Crie uma conta no Netlify
2. Conecte seu repositório
3. Configure build command: `npm run build`
4. Configure publish directory: `.next`
5. Deploy

#### AWS (EC2)

1. Crie uma instância EC2
2. Instale Node.js
3. Clone o repositório
4. Instale dependências
5. Configure variáveis de ambiente
6. Execute migrações
7. Configure PM2 para gerenciar o processo
8. Configure Nginx como reverse proxy

## Solução de Problemas

### Erro: "Cannot find module"

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
```

### Erro: "Database connection failed"

**Solução:**
1. Verifique se o arquivo `.env` existe
2. Verifique se `DATABASE_URL` está configurado corretamente
3. Execute `npx prisma migrate dev` novamente

### Erro: "Port 3000 already in use"

**Solução:**
```bash
# Encontre o processo usando a porta
npx lsof -i :3000

# Ou use outra porta
PORT=3001 npm run dev
```

### Erro: "TypeScript errors"

**Solução:**
```bash
# Limpe o cache do Next.js
rm -rf .next

# Rebuild
npm run build
```

### Erro: "Migration failed"

**Solução:**
```bash
# Reset do banco (cuidado: apaga todos os dados)
npx prisma migrate reset

# Ou crie uma nova migração
npx prisma migrate dev --name fix
```

### Performance Lenta

**Soluções:**
1. Verifique se há muitos produtos (considere paginação)
2. Use Prisma Studio para verificar índices
3. Considere mudar para PostgreSQL em produção

### Testes Falhando

**Solução:**
```bash
# Limpe cache do Jest
npm test -- --clearCache

# Execute um teste específico
npm test -- CategoriaService.test.ts
```

## Dicas e Melhores Práticas

### Desenvolvimento

1. **Use Git branches** para novas features
2. **Commit frequentemente** com mensagens claras
3. **Execute testes** antes de commitar
4. **Use TypeScript** para evitar erros em tempo de execução

### Produção

1. **Use PostgreSQL** em vez de SQLite
2. **Configure backups** do banco de dados
3. **Monitore logs** regularmente
4. **Use HTTPS** para segurança
5. **Configure rate limiting** para proteger a API

### Manutenção

1. **Atualize dependências** regularmente
2. **Revise logs de erro** periodicamente
3. **Monitore performance** com ferramentas APM
4. **Mantenha documentação** atualizada

## Suporte

Se você encontrar problemas não cobertos neste guia:

1. Verifique o [README.md](README.md) para documentação geral
2. Verifique [ARCHITECTURE.md](ARCHITECTURE.md) para detalhes técnicos
3. Entre em contato com a equipe de desenvolvimento da Reccartec

## Próximos Passos

Após configurar o sistema, considere:

1. **Adicionar autenticação** para proteger o sistema
2. **Configurar backups automáticos** do banco de dados
3. **Implementar notificações** para produtos com baixo estoque
4. **Adicionar relatórios** e dashboards
5. **Integrar com sistemas** de pagamento ou ERP

---

**Parabéns!** Você agora tem o sistema Reccartec Stock instalado e configurado. Comece adicionando suas categorias e produtos para gerenciar seu estoque de forma eficiente.
