
# Kanban APP

## Demo do projeto

https://kanban-app-5a82a.firebaseapp.com/

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/wellingtonngallo/kanban-app
```

Verifique se o node está instalado, caso ao contrario instale (https://nodejs.org/en)

```bash
  node -v
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


### Features funcionais
- Autenticação: Para autenticação foi utilizado o firebase auth com a opção do Google, além disso foi criado um hook para controle de acesso de usuários, onde a cada usuário autenticado é salvo no banco de dados do firebase 

- Consumo de apis: Configurado no proprio firebase para que fosse possivel salvar, editar, excluir e atualizar um item.
  
- DragAndDrop: Para isso foi criado hooks de controle com as validações sugeridas pela documentação da biblioteca (https://react-dnd.github.io/react-dnd/about)
  
- Componentes e estilos: Para facilitar o uso de um style-guide foi utilizado a biblioteca do ChakraUI (https://chakra-ui.com/docs/), onde ela tras algumas opções de componentes, alem de estilos customizados e temas

- Biblioteca de icones utilizando react-icons (https://react-icons.github.io/react-icons/)

- Controle de dados e formularios com react-hook-form (https://www.react-hook-form.com/)

- Github Actions e deploy automatico utilizando as configurações do firebase

- Criar tarefa - Para criar uma tarefa, é necessario estar autenticado, escolher o quadro em que a tarefa deve ser criada, e passar as informações da tarefa e salvar, a partir disso os dados são salvos no firebase

- Editar tarefa - Para editar uma tarefa, é necessario estar autenticado, escolher a tarefa deve ser editada, e clicar no icone de editar no card de tarefas, ao abrir o modal deve alterar as informações da tarefa e salvar, a partir disso os dados são atualizados no firebase

- Excluir tarefa -  Para excluir uma tarefa, é necessario estar autenticado, escolher o quadro em que a tarefa deve ser excluida, e clicar no botão de exclusão, a partir disso os dados são excluidos no firebase
  
- Buscar tarefa - Ao abrir a tela, é realizada uma chamada pegando os quadros com as tarefas referenciadas em cada quadro, e salvo em um contexto ambos para que seja renderizado em tela

