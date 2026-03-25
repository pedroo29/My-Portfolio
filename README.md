# My Portfolio v3

Portfolio técnico bilingüe (Next.js, contenido administrable y almacenamiento local).

## Desarrollo

Requisitos: Node **20.9+** (recomendado: ver `.nvmrc`).

```bash
npm ci
cp .env.example .env
npm run dev
```

## Scripts

| Comando        | Descripción        |
|----------------|--------------------|
| `npm run dev`  | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor tras `build` |
| `npm run lint` / `npm run typecheck` | Calidad de código |

## Despliegue y versiones fijas

Las dependencias están **pinned** en `package.json`; el lockfile define el árbol exacto. Detalles en [DEPLOY.md](./DEPLOY.md).
