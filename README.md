
# Kanban APP

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/wellingtonngallo/kanban-app
```

Entre no diretório do projeto

```bash
  cd kanban-app
```

Instale as dependências

```bash
  yarn install
```

Inicie o servidor

```bash
  yarn dev
```


## Documentação

#### Configuração do projeto
- Para configuração do projeto, foi utilizado vite e toda sua configuração para rodar o projeto com react e typescript (https://vitejs.dev/)

- Após a configuração com vite, foi iniciado a instalação de algumas dependencias tais como firebase, para que fosse realizado a autenticação via Google e a criação de um banco de dados com firebase store (https://firebase.google.com/?hl=pt)


### Features
- Autenticacão via Google utilizando o firebase auth
- Consumo de apis utilizando o firebase store
- DragAndDrop com react-dnd (https://react-dnd.github.io/react-dnd/about)
- Guia de estilo utilizando ChakraUI (https://chakra-ui.com/docs/)
- Biblioteca de icones utilizando react-icons (https://react-icons.github.io/react-icons/)
- Controle de dados e formularios com react-hook-form (https://www.react-hook-form.com/)
- Validação de formularios utilizando o yup (https://github.com/jquense/yup)
- Github Actions e deploy automatico utilizando as configurações do firebase