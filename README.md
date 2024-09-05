# GDRMUSIC - Escute músicas com amigos em tempo real + Busca aprimorada por IA

GDRMUSIC é um player de músicas, gerenciador de playlists e utiliza a API da Gemini (Google) para recomendar músicas por IA na [Busca](https://gdrmusic.viniciusgdr.com/search-with-ai)
<img src="/public/gdrmusic.png" alt="Demo" height="80%" />


## Sumário

- [Soluções/Utilidades](#soluçõesutilidades)
- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Demonstração](#demonstração)
- [Configuração](#configuração)
- [Privacidade](#privacidade)

## Soluções/Utilidades

A maioria das pessoas enfrenta desafios ao baixar músicas, ouvi-las junto com amigos ou organizá-las. Com o GDRMusic, você pode criar e gerenciar suas playlists, descobrir novas músicas com a ajuda da nossa IA e escutar músicas simultaneamente com amigos, usando a mesma fila de reprodução graças à nossa tecnologia inovadora.

## Recursos

- ✅ Buscar músicas.
- ✅ Criar/Gerenciar Playlists
- ✅ Escutar músicas ao mesmo tempo com até 100 pessoas conectadas.
- ✅ Compatibilidade Mobile via PWA

## Tecnologias Utilizadas
- Gemini
- Next.js
- Socket.io (Websocket)
- Next-Auth.js

## Instalação

Para instalar o gdrmusic e hospedar o seu próprio site, você precisa ter o Node.js e o Docker instalado em sua máquina. Após isso, basta clonar o repositório e instalar as dependências.

```bash
$ git clone https://github.com/viniciusgdr/gdrmusic-ai
$ cd gdrmusic-ai
$ docker compose up -d --build
```

## Demonstração

<div style="display: flex; flex-direction: column; padding-bottom: 4px">
<img src="/public/gdrmusic-1.png" alt="Demo" height="80%" />
<img src="/public/gdrmusic-2.png" alt="Demo" height="80%" />
</div>


## Configuração

Para configurar o gdrmusic, você precisa criar um arquivo `.env` na raiz do projeto e adicionar as seguintes variáveis de ambiente.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name

REDIS_NAME=
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secret"

GOOGLE_CLIENT_ID=KEY
GOOGLE_SECRET_ID=KEY

WS_URL="wss://seuwebsocket.domain.com"

PATH_MUSICS=/tmp

GEMINI_API_KEY=
```

## Privacidade

O GDRMUSIC respeita a privacidade dos usuários e não armazena nenhuma informação pessoal. Todas as interações são processadas em tempo real e não são armazenadas em nenhum banco de dados. Além disso, o site não compartilha nenhuma informação com terceiros e não exibe anúncios. Todo conteúdo que é efetuado download de terceiros é provido de APIs públicas.
