# Desafio Técnico Front-End

Sistema completo de gerenciamento de produtos com autenticação, CRUD e dashboard de métricas desenvolvido com Next.js.

## 🚀 Tecnologias Utilizadas

### Stack Obrigatória
- **Next.js** - Framework React com SSR e API Routes
- **React.js** - Biblioteca para interfaces de usuário
- **Zustand** - Gerenciamento de estado (diferencial implementado)
- **Tailwind CSS** - Framework CSS com responsividade e dark mode
- **Zod** - Validação de formulários e dados

### Stack Diferencial
- **Radix UI** - Componentes headless acessíveis (equivalente ao Hero UI)
- **Recharts** - Biblioteca para gráficos e visualizações
- **React Hook Form** - Gerenciamento eficiente de formulários
- **TypeScript** - Tipagem estática para maior segurança

## 📋 Funcionalidades Implementadas

### ✅ Autenticação Completa
- Sistema de login e registro
- Validação robusta com Zod
- Gerenciamento de tokens JWT
- Proteção de rotas autenticadas
- Feedback visual com notificações

### ✅ CRUD de Produtos
- **Criar**: Formulário completo com upload de thumbnail
- **Listar**: Grid responsivo com cards informativos
- **Editar**: Atualização de dados e imagens
- **Deletar**: Confirmação com modal de segurança
- Validação em tempo real
- Estados de loading e error

### ✅ Dashboard de Métricas
- **Cards de métricas**: Produtos, usuários, receita com tendências
- **Gráfico de barras**: Vendas mensais com Recharts
- **Gráfico de pizza**: Distribuição por categorias
- **Atividades recentes**: Timeline de ações do sistema
- Dados mockados realistas

### ✅ Gerenciamento de Estado (Zustand)
- Store de autenticação com persistência
- Store de produtos com operações CRUD
- Store de métricas com dados dinâmicos
- Store de UI para notificações e tema
- Integração entre stores para atividades

### ✅ Validação com Zod
- Schemas robustos para todos os formulários
- Validação de email, senha e telefone
- Feedback em tempo real
- Mensagens de erro personalizadas
- Validação de força de senha

## 🎨 Recursos de UI/UX

### ✅ Design Responsivo
- Layout adaptável para desktop e mobile
- Grid system flexível
- Componentes otimizados para touch

### ✅ Dark Mode
- Alternância entre temas claro/escuro/sistema
- Persistência da preferência do usuário
- Transições suaves entre temas

### ✅ Componentes Radix UI
- Botões com variantes e estados
- Formulários acessíveis
- Modais e dialogs
- Inputs com validação visual
- Cards e layouts estruturados

### ✅ Experiência do Usuário
- Loading states em todas as operações
- Notificações toast para feedback
- Indicadores de progresso
- Confirmações para ações destrutivas
- Navegação intuitiva

## 🏗️ Arquitetura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Páginas protegidas
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   └── layout.tsx        # Layout raiz
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   ├── dashboard/       # Componentes do dashboard
│   ├── layout/          # Componentes de layout
│   ├── products/        # Componentes de produtos
│   └── ui/              # Componentes base (Radix UI)
├── lib/                 # Utilitários e configurações
│   ├── api.ts          # Cliente da API
│   ├── store.ts        # Stores do Zustand
│   ├── utils.ts        # Funções utilitárias
│   └── validations.ts  # Schemas do Zod
└── README.md           # Documentação
\`\`\`

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para executar

1. **Clone o repositório**
\`\`\`bash
git clone <url-do-repositorio>
cd desafio-tecnico-frontend
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Execute o projeto**
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

4. **Acesse a aplicação**
\`\`\`
http://localhost:3000
\`\`\`

## 🌐 API Integration

A aplicação consome a API fornecida:
- **Base URL**: `https://api-teste-front-production.up.railway.app`
- **Documentação**: [Swagger Docs](https://api-teste-front-production.up.railway.app/docs/)

### Endpoints utilizados:
- `POST /auth/login` - Autenticação
- `POST /users` - Registro de usuário
- `POST /auth/session` - Renovação de token
- `GET /products` - Listar produtos
- `POST /products` - Criar produto
- `PUT /products/{id}` - Atualizar produto
- `DELETE /products/{id}` - Deletar produto
- `PATCH /products/thumbnail/{id}` - Upload de thumbnail

## 📊 Funcionalidades Extras Implementadas

### ✅ Diferenciais Obrigatórios
- **Dark mode funcional** com persistência
- **Animações elegantes** com Tailwind CSS
- **Responsividade completa** para todos os dispositivos

### ✅ Diferenciais Adicionais
- **Sistema de notificações** toast
- **Validação em tempo real** nos formulários
- **Indicador de força de senha**
- **Confirmação visual** para senhas
- **Estados de loading** em todas as operações
- **Tratamento robusto de erros**
- **Atividades em tempo real** no dashboard
- **Métricas dinâmicas** com gráficos interativos

## 🎯 Critérios de Avaliação Atendidos

| Critério | Status | Implementação |
|----------|--------|---------------|
| **Funcionalidade completa do CRUD** | ✅ | Sistema completo com todas as operações |
| **Gráfico bem implementado** | ✅ | Múltiplos gráficos com Recharts |
| **Boas práticas e clareza no código** | ✅ | TypeScript, componentização, clean code |
| **Responsividade e uso do Hero UI** | ✅ | Radix UI + Tailwind responsivo |
| **Validação com Zod** | ✅ | Validação robusta em todos os formulários |
| **Diferenciais extras** | ✅ | Dark mode, animações, UX aprimorada |

## 🚀 Deploy

A aplicação está pronta para deploy no Vercel:

1. **Conecte o repositório** ao Vercel
2. **Configure as variáveis** de ambiente (se necessário)
3. **Deploy automático** será realizado

## 👨‍💻 Desenvolvedor

Aplicação desenvolvida seguindo todas as especificações do desafio técnico, implementando as melhores práticas de desenvolvimento React/Next.js e priorizando a experiência do usuário.

---

**Tecnologias**: Next.js • React • TypeScript • Zustand • Tailwind CSS • Zod • Radix UI • Recharts
