# Despliegue y mantenimiento

Este proyecto usa **versiones fijas** en `package.json` y un **`package-lock.json`** en el repositorio para que `npm ci` instale siempre el mismo árbol de dependencias.

## Requisitos

- **Node.js** `>= 20.9.0` (Next.js 16). El archivo `.nvmrc` fija la línea **22** para desarrollo local con [nvm](https://github.com/nvm-sh/nvm) (`nvm use`).
- Variables de entorno: copia `.env.example` a `.env` y rellena los valores necesarios.

## Instalación reproducible

```bash
npm ci
```

Usa `npm ci` en CI y producción cuando el lockfile esté versionado; es más estricto que `npm install`.

## Producción

```bash
npm run build
npm run start
```

Persiste el directorio `data/runtime` (y el contenido que generes ahí) si el sitio escribe en disco; por defecto está en `.gitignore`.

## Actualizar dependencias (cada 6–12 meses, o cuando el hosting lo exija)

1. Revisar [Node.js release schedule](https://nodejs.org/en/about/releases/) y subir `.nvmrc` / `engines` si hace falta.
2. Ejecutar `npm outdated` y actualizar paquetes de forma controlada (preferible una familia a la vez: Next primero, luego el resto).
3. `npm run build`, `npm run lint` y `npm run typecheck`.
4. Regenerar `package-lock.json` con `npm install` tras cambiar versiones en `package.json` y commitear el lockfile.

## Seguridad

- Ejecuta `npm audit` de forma periódica; no sustituye revisión manual del admin y credenciales.
- Mantén HTTPS, dominio y backups del contenido fuera del repo si aplica.
