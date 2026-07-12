# Reccartec Stock - Sistema de Gestão de Estoque

Sistema web responsivo para gestão de estoque da loja Reccartec, desenvolvido com Next.js, TypeScript, Prisma e TailwindCSS.

## 🚀 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Ícones modernos
- **shadcn/ui** - Componentes UI reutilizáveis

### Backend
- **Next.js API Routes** - API REST integrada
- **Prisma ORM** - ORM type-safe para banco de dados
- **SQLite** - Banco de dados para desenvolvimento (pode ser substituído por PostgreSQL/MySQL em produção)

### Testes
- **Jest** - Testes unitários
- **Playwright** - Testes E2E
- **Testing Library** - Utilitários para testes React

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd reccartec-stock
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
reccartec-stock/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── categorias/    # Endpoints de categorias
│   │   │   ├── produtos/      # Endpoints de produtos
│   │   │   └── movimentacoes/ # Endpoints de movimentações
│   │   ├── categorias/        # Página de categorias
│   │   ├── produtos/          # Página de produtos
│   │   ├── movimentacoes/     # Página de movimentações
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Página inicial
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   └── ui/                # Componentes UI base
│   ├── lib/                   # Utilitários
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── utils.ts           # Funções utilitárias
│   ├── repositories/          # Camada de acesso a dados
│   │   ├── ICategoriaRepository.ts
│   │   ├── IProdutoRepository.ts
│   │   ├── IMovimentacaoRepository.ts
│   │   ├── CategoriaRepository.ts
│   │   ├── ProdutoRepository.ts
│   │   └── MovimentacaoRepository.ts
│   └── services/              # Camada de lógica de negócio
│       ├── ICategoriaService.ts
│       ├── IProdutoService.ts
│       ├── IMovimentacaoService.ts
│       ├── CategoriaService.ts
│       ├── ProdutoService.ts
│       ├── MovimentacaoService.ts
│       └── __tests__/         # Testes unitários
├── e2e/                       # Testes E2E
│   └── home.spec.ts
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── public/                    # Arquivos estáticos
├── .env.example               # Exemplo de variáveis de ambiente
├── jest.config.js             # Configuração do Jest
├── playwright.config.ts       # Configuração do Playwright
├── tailwind.config.ts         # Configuração do TailwindCSS
├── tsconfig.json              # Configuração do TypeScript
└── package.json               # Dependências do projeto
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

### 1. Camada de Apresentação (UI)
- Páginas Next.js (App Router)
- Componentes React reutilizáveis
- Design responsivo com TailwindCSS

### 2. Camada de Controle (API Routes)
- Endpoints RESTful
- Validação de requisições
- Tratamento de erros

### 3. Camada de Serviço (Business Logic)
- Regras de negócio
- Validação de dados
- Coordenação entre repositories

### 4. Camada de Acesso a Dados (Repository)
- Abstração do banco de dados
- Operações CRUD
- Queries complexas

### 5. Camada de Persistência (Database)
- Prisma ORM
- SQLite (desenvolvimento)
- PostgreSQL/MySQL (produção)

## 📊 Modelo de Dados

### Categoria
- `id`: Identificador único
- `nome`: Nome da categoria (único)
- `descricao`: Descrição opcional
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `produtos`: Relacionamento com produtos

### Produto
- `id`: Identificador único
- `nome`: Nome do produto
- `descricao`: Descrição opcional
- `codigo`: Código do produto (único, auto-incremento)
- `preco`: Preço unitário
- `quantidade`: Quantidade em estoque
- `minimo`: Estoque mínimo
- `categoriaId`: ID da categoria
- `categoria`: Relacionamento com categoria
- `desconto`: Desconto do produto (opcional)
- `tipoDesconto`: Tipo de desconto (percentual ou valor)
- `dataFimDesconto`: Data fim do desconto (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `movimentacoes`: Relacionamento com movimentações
- `itensVenda`: Relacionamento com itens de venda

### Venda
- `id`: Identificador único
- `total`: Total da venda (com desconto)
- `totalOriginal`: Total original (sem desconto)
- `descontoTotal`: Valor total do desconto aplicado
- `cliente`: Nome do cliente (opcional)
- `status`: Status da venda (CONCLUIDA, CANCELADA)
- `createdAt`: Data de criação
- `itens`: Relacionamento com itens da venda
- `movimentacoes`: Relacionamento com movimentações

### ItemVenda
- `id`: Identificador único
- `vendaId`: ID da venda
- `produtoId`: ID do produto
- `produto`: Relacionamento com produto
- `quantidade`: Quantidade vendida
- `precoOriginal`: Preço original do produto
- `precoUnitario`: Preço unitário aplicado
- `descontoAplicado`: Desconto aplicado no item
- `subtotal`: Subtotal do item

### Movimentacao
- `id`: Identificador único
- `tipo`: Tipo (ENTRADA, SAIDA, AJUSTE)
- `quantidade`: Quantidade movimentada
- `produtoId`: ID do produto
- `produto`: Relacionamento com produto
- `motivo`: Motivo da movimentação
- `createdAt`: Data de criação

## 🔌 API Endpoints

### Categorias

#### GET /api/categorias
Lista todas as categorias

#### POST /api/categorias
Cria uma nova categoria
```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos"
}
```

#### GET /api/categorias/[id]
Busca uma categoria por ID

#### PUT /api/categorias/[id]
Atualiza uma categoria
```json
{
  "nome": "Eletrônicos Atualizado",
  "descricao": "Nova descrição"
}
```

#### DELETE /api/categorias/[id]
Deleta uma categoria

### Produtos

#### GET /api/produtos
Lista todos os produtos (opcionalmente filtrado por categoria)
```
?categoriaId=1
```

#### POST /api/produtos
Cria um novo produto
```json
{
  "nome": "Smartphone",
  "descricao": "Smartphone XYZ",
  "preco": 999.99,
  "quantidade": 10,
  "minimo": 5,
  "categoriaId": 1,
  "desconto": 20,
  "tipoDesconto": "percentual",
  "dataFimDesconto": "2024-12-31"
}
```

#### GET /api/produtos/[id]
Busca um produto por ID

#### PUT /api/produtos/[id]
Atualiza um produto

#### DELETE /api/produtos/[id]
Deleta um produto

#### POST /api/produtos/[id]/entrada
Registra entrada de estoque
```json
{
  "quantidade": 10,
  "motivo": "Compra de fornecedor"
}
```

#### POST /api/produtos/[id]/saida
Registra saída de estoque
```json
{
  "quantidade": 5,
  "motivo": "Venda ao cliente"
}
```

#### POST /api/produtos/[id]/ajuste
Ajusta o estoque
```json
{
  "quantidade": 15,
  "motivo": "Ajuste de inventário"
}
```

#### GET /api/produtos/baixo-estoque
Lista produtos com estoque abaixo do mínimo

### Movimentações

#### GET /api/movimentacoes
Lista todas as movimentações (opcionalmente filtrado por produto)
```
?produtoId=1
```

## 🧪 Testes

### Testes Unitários
Execute os testes unitários:
```bash
npm test
```

Execute em modo watch:
```bash
npm run test:watch
```

Execute com coverage:
```bash
npm run test:coverage
```

### Testes E2E
Execute os testes E2E:
```bash
npm run test:e2e
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## 📲 Acessando no Celular

### Opção 1: Deploy em Plataforma Cloud (Recomendado)

A melhor forma de acessar a aplicação no celular é fazer deploy em uma plataforma cloud:

#### Vercel (Mais Fácil)
1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub/GitLab/Bitbucket
3. Configure as variáveis de ambiente
4. O deploy é automático após cada push
5. Acesse via URL gerada (ex: `https://reccartec-stock.vercel.app`)

#### Netlify
1. Crie uma conta em [netlify.com](https://netlify.com)
2. Conecte seu repositório
3. Configure o build command: `npm run build`
4. Configure o publish directory: `.next`
5. Acesse via URL gerada

#### Railway
1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um novo projeto
3. Conecte seu repositório
4. Configure as variáveis de ambiente
5. Acesse via URL gerada

### Opção 2: Acesso Local (Apenas para Testes)

Para acessar a aplicação localmente no celular, ambos dispositivos precisam estar na mesma rede Wi-Fi:

1. **Encontre o IP do seu computador:**
   - Windows: Abra o Prompt de Comando e digite `ipconfig`
   - Mac/Linux: Abre o Terminal e digite `ifconfig` ou `ip addr`
   - Procure pelo IPv4 (ex: `192.168.1.100`)

2. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

3. **Acesse no celular:**
   - Abra o navegador no celular
   - Digite: `http://SEU_IP:3000` (ex: `http://192.168.1.100:3000`)

**Limitações do acesso local:**
- Funciona apenas na mesma rede Wi-Fi
- Não funciona fora de casa
- IP pode mudar ao reiniciar o roteador
- Não é seguro para produção

### Opção 3: Tunneling (Para Testes Rápidos)

Use serviços de tunneling para expor seu localhost temporariamente:

#### ngrok
1. Instale o ngrok: [ngrok.com](https://ngrok.com)
2. Execute: `ngrok http 3000`
3. Use a URL gerada (ex: `https://abc123.ngrok.io`)
4. A URL muda a cada execução

#### localtunnel
```bash
npx localtunnel --port 3000
```

**Limitações do tunneling:**
- URL temporária
- Não é seguro para produção
- Pode ter limitações de banda

## 🎨 Design System

O sistema utiliza:
- **Cores**: Paleta azul/índigo com variantes para diferentes estados
- **Tipografia**: Inter (Google Fonts)
- **Espaçamento**: Sistema baseado em rem
- **Componentes**: shadcn/ui com customizações

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm test             # Executa testes unitários
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes com coverage
npm run test:e2e     # Executa testes E2E
npm run prisma:generate # Gera cliente Prisma
npm run prisma:migrate # Executa migrações
npm run prisma:studio  # Abre Prisma Studio
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- AWS (EC2, ECS, Lambda)
- DigitalOcean
- Heroku

## 📝 Variáveis de Ambiente

```env
DATABASE_URL="file:./dev.db"  # Para desenvolvimento
# DATABASE_URL="postgresql://user:password@host:port/database" # Para produção
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e propriedade da Reccartec.

## 👥 Desenvolvido por

Sistema desenvolvido para a loja Reccartec.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento da Reccartec.
