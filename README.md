# Automatic Deploy

Projeto consiste na automação de deploys dos bots através de um arquivo .json ou .jsonc.

## 🚀 Começando

Para iniciar basta instalar as dependências do Node.js dando o comando:

```
npm install
```

Após a instalação é necessário fazer algumas **configurações.**

## ⚙ Configurações

-   Arquivo src/index.js:

| Variável | Função                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------- |
| filename | Informar o nome do arquivo que será processado (caminho completo ou caminho atual da pasta src) |

-   Arquivo src/config.jsonc:

| Chave            | Função                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| debug            | Informa se o modo debug está ativo ou não (responsável por disparar os consoles) |
| sourceIndex      | Nome do índice que será procurado a chave do bot que irá fornecer conteúdo       |
| destinationIndex | Nome do índice que será procurado a chave do bot que irá receber conteúdo        |
| documentsKey     | Array que recebe a chave dos documentos suportados pelo blip                     |

Após a realização dessas configurações, basta executar o programa dentro da pasta **src**, dando o comando:

```
npm index
```
