## Resumo (backend)

Aplicação back-end foi desenvolvida utilizando o nestjs com o tipescript, foram adotados conceitos de ports e adapters,
onde a camada de domínio é independente da camada de infraestrutura, o que permite que a camada de domínio seja testada
sem a necessidade de uma base de dados, e a camada de infraestrutura possa ser alterada sem afetar a camada de domínio.
Foi utilizado o Postgres como banco de dados, e o TypeORM como ORM, para a comunicação com o banco de dados. Para a
autenticação foi utilizado o JWT, e para a validação dos dados foi utilizado o class-validator. Para a documentação da
API foi utilizado o Swagger. Para a comunicação com a API fetch. Para a comunicação com o docker foi utilizado o docker
compose.

## Iniciando a aplicação

É necessário ter o nodejs e o docker instalado na máquina.

- Para instalar o nodejs acesse o link: https://nodejs.org/en/download/
- Para instalar o docker acesse o link: https://docs.docker.com/engine/install/

Para iniciar a aplicação, execute o comando:

- para instalar os pacotes necessários:

```bash
npm install
```

- Com o docker instalado, execute o comando dentro da pasta docker, para inicializar o banco de dados postgress:

```bash
docker compose up -d
```

Com os pacotes instalados e o banco de dados inicializado, execute o comando para fazer o build da aplicação:

```bash
npm run build
```

Para iniciar a aplicação, execute o comando:

```bash
npm start
```

A porta padrão da aplicação é a 3000, para acessar a documentação da API, acesse o link: http://localhost:3000/auth

O endereço pardão do swagger é: http://localhost:3000/doc

Para efeturar o login, utilize o usuário e a senha no swagger ou na aplicação frontend:

```json
{
    "login": "admin",
    "password": "12345678"
}
```