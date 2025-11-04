# Calvão de Cria App (Front-end)

Este é o repositório do front-end para o aplicativo de e-commerce "Calvão de Cria". O projeto é construído usando **Ionic** e **React**, com **Vite** como bundler e **TypeScript**.

## Funcionalidades Principais

O aplicativo fornece uma experiência completa de e-commerce, incluindo:

  * **Autenticação de Usuário:**
      * Cadastro de nova conta.
      * Login com e-mail e senha.
      * Fluxo de "Esqueci minha senha" e "Resetar senha".
  * **Loja:**
      * Listagem de produtos com busca, paginação infinita e abas para "Produtos" e "Promoções".
      * Filtro de produtos por faixa de preço.
      * Página de detalhes do produto.
  * **Carrinho e Checkout:**
      * Carrinho de compras em um modal/drawer.
      * Gerenciamento de carrinho (adicionar, remover, atualizar quantidade).
      * Fluxo de checkout completo:
          * Seleção, cadastro e edição de endereços.
          * Busca de endereço por CEP (via API ViaCEP).
          * Revisão e confirmação do pedido.
          * Página de pagamento via Pix (simulada).
  * **Área do Cliente:**
      * Gerenciamento de dados do perfil (Meus dados).
      * Visualização do histórico de pedidos (Meus pedidos).

## Tecnologias Utilizadas

  * **Framework Principal:** Ionic + React
  * **Linguagem:** TypeScript
  * **Build Tool:** Vite
  * **Estilização:** Tailwind CSS
  * **Gerenciamento de Estado:** React Context API (AuthProvider, CartProvider, CheckoutProvider, ProfileProvider)
  * **Roteamento:** React Router
  * **Formulários:** React Hook Form
  * **Máscaras de Input:** React-IMask (para CPF, CEP, Telefone)
  * **Requisições API:** Axios
  * **Testes:** Vitest (Unitários) e Cypress (End-to-End)
  * **Ícones:** Phosphor Icons e Ionicons

## Estrutura do Projeto

A estrutura de pastas do projeto está organizada da seguinte forma:

```
/src
├── assets/         # Imagens e SVGs (a maioria parece estar vazia nos arquivos fornecidos)
├── components/     # Componentes React reutilizáveis (Button, Input, Layouts, etc.)
│   ├── Checkout/   # Componentes específicos do checkout (Header, Layout, ItemsSummary)
│   └── ...
├── contexts/       # Provedores de Contexto (Auth, Cart, Checkout, Profile)
├── hooks/          # Hooks customizados (ex: useDebounce)
├── pages/          # Componentes de página (rotas)
├── services/       # Lógica de API (authService, cartService, productService, etc.)
├── theme/          # Arquivos de CSS globais e variáveis de tema (custom.css, variables.css)
├── types/          # Definições de tipos TypeScript (index.ts, IResponse.ts)
├── utils/          # Funções utilitárias (api.ts, cookieUtils.ts, maskUtils.ts)
├── App.tsx         # Ponto de entrada principal do React com rotas
├── main.tsx        # Ponto de entrada do Vite (renderiza o App)
└── setupTests.ts   # Configuração para testes unitários (Vitest)
```

## API

O aplicativo se conecta a um backend externo.

  * **URL Base da API:** `https://apicalvaodecria-production.up.railway.app/api/v1`
  * **Autenticação:** A comunicação com a API é feita usando tokens JWT (Access Token e Refresh Token). O cliente Axios (`src/utils/api.ts`) está configurado com interceptors para adicionar automaticamente o token de acesso aos headers e para tentar renovar o token (refresh) automaticamente em caso de expiração (erro 401).

## Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos:

### `npm run dev`

Inicia o aplicativo em modo de desenvolvimento com Vite.
Abra http://localhost:5173 para ver no navegador.

### `npm run build`

Compila e minifica o aplicativo para produção na pasta `dist/`.

### `npm run preview`

Inicia um servidor local para visualizar o build de produção.
