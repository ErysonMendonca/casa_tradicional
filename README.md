# Casa Tradicional

Aplicação para restaurante com cardápio digital, reservas e administração.

[![CI](https://github.com/ErysonMendonca/casa_tradicional/actions/workflows/ci.yml/badge.svg)](https://github.com/ErysonMendonca/casa_tradicional/actions/workflows/ci.yml)

**Stack principal:** Next.js 16 · React · TypeScript · Supabase.

## Escolha a versão

| Versão | Local | Uso |
| --- | --- | --- |
| Aplicação principal | `nextapp/` | Cardápio, reservas, administração e integração com banco |
| Protótipo anterior | Raiz, `src/` e arquivos HTML | Referência da interface original com Vite |

Para conhecer o sistema completo, comece em **`nextapp/`**. A versão original foi preservada para consulta; os comandos da raiz executam somente o protótipo Vite.

## Funcionalidades da aplicação principal

- Página institucional e cardápio organizado por categorias.
- Exibição de produtos, preços e informações dos pratos.
- Formulário de reservas e painel administrativo.
- APIs para produtos, categorias, reservas e configurações.
- Integração com Supabase e armazenamento de imagens.

## Executar a aplicação principal

Requisitos: Node.js 24, npm e um projeto Supabase de desenvolvimento.

```bash
git clone https://github.com/ErysonMendonca/casa_tradicional.git
cd casa_tradicional/nextapp
npm ci
cp .env.example .env.local
npm run dev
```

Preencha `.env.local`. A URL e a chave anônima são usadas no cliente; `SUPABASE_SERVICE_ROLE_KEY` é exclusiva do servidor. Prepare o banco com o SQL de `supabase/`, começando por `schema.sql` e conferindo as migrações e funções de autenticação necessárias ao seu ambiente. Os arquivos de seed contêm exemplos e devem ser revisados antes da importação.

Abra http://localhost:3000. Rotas principais: `/`, `/cardapio` e `/admin/login`. Algumas seções possuem dados locais de fallback; operações administrativas e reservas dependem do banco configurado. Não há credenciais públicas de acesso.

```bash
npm run build
npm start
```

## Executar o protótipo anterior

Na raiz do repositório:

```bash
npm ci
npm run dev
```

## Organização e verificação

| Local | Responsabilidade |
| --- | --- |
| `nextapp/app/` | Páginas, endpoints e ações no servidor |
| `nextapp/components/` | Componentes da interface |
| `nextapp/lib/supabase/` | Clientes, tipos e armazenamento |
| `nextapp/supabase/` | Estrutura e evolução do banco |

A CI valida o build das duas versões. O build da aplicação Next.js usa valores fictícios de ambiente e não testa as operações no Supabase. A análise de lint existente ainda tem pendências de tipagem e boas práticas; execute `npm run lint` dentro de `nextapp/` para examiná-las.

## Próximas melhorias

- Cobrir reservas e gestão de produtos com testes integrados.
- Consolidar as instruções de provisionamento do banco e autenticação.
- Restaurar a demonstração pública; a implantação anterior está indisponível.

## Contribuições

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para executar as verificações, reportar problemas e propor alterações. Ao abrir um pull request, descreva o problema, a solução e como validou o comportamento.

## Autor

[Eryson Marcos](https://github.com/ErysonMendonca) · [LinkedIn](https://www.linkedin.com/in/eryson-marcos-b33718210/)
