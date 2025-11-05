# Calvão de Cria App (Front-end)

Este é o repositório do front-end para o aplicativo de e-commerce "Calvão de Cria". O projeto é construído usando **Ionic** e **React**, com **Vite** como bundler e **TypeScript**.

## Funcionalidades Principais

O aplicativo fornece uma experiência limitada do e-commerce Calvão de Cria, incluindo:

  * **Autenticação de Usuário:**
      * Login com e-mail e senha.
  * **Loja:**
      * Listagem de produtos com busca, paginação infinita e abas para "Produtos" e "Promoções".
      * Filtro de produtos por faixa de preço.
      * Página de detalhes do produto.
  * **Carrinho e Checkout:**
      * Carrinho de compras em um modal/drawer.
      * Gerenciamento de carrinho (adicionar, remover, atualizar quantidade).

  * **Área do Cliente:**
      * Realizar Logout.
 
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

Para compilar e buildar o projeto no Android Studio, é necessario rodar os seguintes scripts

### ``


### ``


### ``


# Massa de Dados

```
User: teste@teste.com  
Password: Senha@123
```

