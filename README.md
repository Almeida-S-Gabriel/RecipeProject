# Projeto Site de Receitas

## Sobre o Código

O projeto é um site de receitas que permite aos usuários explorar, buscar e gerenciar receitas de maneira fácil e intuitiva. Ele foi desenvolvido utilizando o framework Vue.js para o front-end e Strapi como CMS para gerenciar as receitas.

### Funcionalidades

1. **Buscar Receitas**: Os usuários podem buscar receitas organizado por paginas.

2. **Visualização de Receitas**: Cada receita é apresentada em uma página dedicada, onde os usuários podem ver os detalhes, como ingredientes, instruções e tempo de preparo.

3. **Autenticação de Usuários**: O site oferece funcionalidades de login e registro, permitindo que os usuários tenham perfis personalizados.

4. **Administração de Receitas**: Usuários com permissão de administrador podem adicionar, editar ou excluir receitas, facilitando o gerenciamento do conteúdo do site.

5. **Responsividade**: O layout é responsivo e funciona bem em diferentes dispositivos, incluindo smartphones e tablets.


### Tecnologias Utilizadas

- **Vue.js**: Framework JavaScript progressivo para construir interfaces de usuário.
- **Strapi**: CMS headless que facilita a criação e gerenciamento de conteúdo.
- **Bootstrap**: Framework CSS utilizado para estilização e layout responsivo.

## 🌟 Funcionalidades Detalhadas

### 1. CRUD de Receitas

Permite criar, ler, atualizar e deletar receitas. As receitas incluem informações como título, descrição, ingredientes e instruções.

**Exemplo de Endpoints:**

- **Criar Receita:** `POST /api/receitas`
- **Listar Receitas:** `GET /api/receitas`
- **Atualizar Receita:** `PUT /api/receitas/:id`
- **Deletar Receita:** `DELETE /api/receitas/:id`

### 1.2 CRUD de Comentários

Usuários autenticados podem:
- **Criar Seu Próprio Comentário**
- **Editar Seu Próprio Comentário**
- **Excluir Seu Próprio Comentário**

### 1.3 CRUD de Comentários (Admin)

O Admin autenticado pode:
- **Deletar Qualquer Comentário**
- **Editar Qualquer Comentário**
- **Excluir Qualquer Comentário**

### 2. Autenticação de Usuários

Os usuários podem se registrar, fazer login e sair da aplicação. A autenticação é baseada em JWT (JSON Web Token).

### 3. Controle de Acesso

- Apenas usuários autenticados podem acessar certas funcionalidades, como comentar.
- Administradores têm permissões adicionais, como gerenciar todos os usuários e editar receitas.

### 4. Componentes
Exite 4 componentes. Receita,Recipe,Comment e user.
O receita é o card, Recipe os detalhes. Recipe e Receita se relacionam e se complementao. Comment relaciona-se com o Recipe.


### Usuarios e Senhas
Strapi Administrator painel:
   email: userteststrapi@gmail.com
   senha: Senha123#

admin:
   email:teste@gmail.com
   senha:Senha123

Authenticated:
   email:useruser1@gmail.com
   senha:Senha123
