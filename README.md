# BIP – Frontend

Frontend do teste prático de entregas (tipo "marketplace de corridas"), implementado em Angular, com autenticação via Keycloak, consumo da API do backend e atualizações em tempo real para entregadores via WebSocket (STOMP/SockJS).

---

## 1. Visão geral

Este frontend fornece as interfaces para os três perfis do sistema:

- Admin:
  - aprovar/rejeitar usuários;
  - consultar usuários (clientes e entregadores);
  - consultar entregas;
  - consultar visão financeira (relatório).
- Cliente:
  - adicionar saldo na carteira;
  - solicitar entrega;
  - listar e cancelar entregas.
- Entregador:
  - visualizar vitrine de entregas disponíveis;
  - aceitar entrega;
  - acompanhar entregas em rota e concluir;
  - receber notificações em tempo real via WebSocket.

O acesso é protegido por Keycloak. Ao abrir o frontend, o usuário é redirecionado para login e, após autenticar, é encaminhado para a área correspondente ao seu papel.

---

## 2. Como executar

### 2.1. Pré-requisitos

- Docker Desktop instalado e em execução.
- Git instalado.

Para executar localmente sem Docker:

- Node.js (recomendado 20+).
- Angular CLI (instalado via dependências do projeto).

### 2.2. Clonar repositórios

Frontend:

```bash
git clone https://github.com/saulocapistrano/bip-frontend.git bip-frontend
cd bip-frontend
```

Backend:

```bash
git clone https://github.com/saulocapistrano/bip.git bip-backend
cd bip-backend
```

### 2.3. Subir o backend (obrigatório)

O frontend depende do backend e do Keycloak.

Na raiz do backend:

```bash
docker compose up
```

Isso sobe os serviços, incluindo:

- API: `bip-api` (porta `8087`)
- Keycloak: `bip-keycloak` (porta `8080`)

Além disso, o backend cria/usa a rede Docker `bip-network`.

### 2.4. Subir o frontend com Docker (recomendado)

Na raiz do frontend:

```bash
docker compose up
```

Por padrão, o frontend ficará disponível em:

- `http://localhost:4200`


### 2.5. Executar o frontend localmente (alternativa)

Se preferir rodar fora do Docker:

```bash
npm install
npm start
```

O `ng serve` sobe em `http://localhost:4200`.

Neste modo, o projeto possui `proxy.conf.json` e o `angular.json` aponta `proxyConfig` para facilitar chamadas a `/api` durante o desenvolvimento.

---

## 3. URLs úteis

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8087/api`
- Keycloak: `http://localhost:8080`

---

## 4. Arquitetura 

### 4.1. Organização do código

Estrutura em módulos e responsabilidades bem separadas:

- `src/app/core`
  - autenticação/identidade (Keycloak + contexto do usuário);
  - interceptors HTTP (token e erro);
  - serviços de infraestrutura compartilhados (ex.: realtime).
- `src/app/features`
  - módulos e páginas por área funcional:
    - `admin`
    - `client`
    - `driver`
- `src/app/shared`
  - componentes reutilizáveis (layout, dashboard, etc.);
  - models e mappers;
  - clients de API.

### 4.2. Autenticação e redirecionamento por papel

O app inicializa o Keycloak no bootstrap e utiliza um guard de redirecionamento para encaminhar o usuário autenticado conforme suas roles:

- `bip-admin` → `/admin`
- `bip-entregador` → `/driver`
- fallback → `/client`

### 4.3. Integração com backend e WebSocket

- Base da API via `/api`.
- WebSocket do backend via `/api/ws`.
- Em ambiente Docker, o Nginx do frontend faz proxy para `bip-api:8087`.

---

## 5. Stack técnica

- Angular (CLI)
- TypeScript
- Bootstrap
- Autenticação:
  - `keycloak-angular`
  - `keycloak-js`
- Realtime:
  - STOMP (`@stomp/stompjs`)
  - SockJS (`sockjs-client`) para fallback em ambiente de desenvolvimento
- Testes:
  - Jasmine/Karma
- Containerização:
  - Docker (multi-stage build)
  - Nginx para servir SPA e fazer proxy para o backend

---

## 6. Testes automatizados

### 6.1. Testes de interface (Jasmine/Karma)

Para executar a suíte:

```bash
npm test
```

Modo headless:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

---

## 7. Observações de execução

### 7.1. Rede Docker

O `docker-compose.yml` do frontend utiliza a rede externa `bip-network`. Se a rede não existir (por exemplo, se o backend ainda não foi executado), suba o backend primeiro.

### 7.2. Login via Keycloak

O frontend está configurado para iniciar com `onLoad: 'login-required'`. Portanto, ao acessar `http://localhost:4200`, você será redirecionado para login no Keycloak.
