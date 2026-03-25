# Despliegue y mantenimiento

Este proyecto usa **versiones fijas** en `package.json` y un **`package-lock.json`** en el repositorio para que `npm ci` instale siempre el mismo árbol de dependencias.

---

## Modelo de almacenamiento (no hay base de datos SQL)

El CMS **no usa** PostgreSQL, MySQL ni SQLite como motor de aplicación. El contenido vive en **archivos en disco**:

| Ubicación | Contenido |
|-----------|-----------|
| `data/runtime/store.json` | Todo el “store”: labs, skills, certificaciones, roadmap, catálogos, textos globales (home, about, etc.) |
| `data/runtime/media/` | Ficheros subidos desde el admin |

La lógica está en `src/lib/server/content-store.ts`. Ese directorio `data/runtime` está en **`.gitignore`**: no se versiona el contenido real del sitio, solo el código y el seed inicial.

**Implicación:** en cualquier entorno donde el disco **persista** entre reinicios (tu PC, un VPS con volumen), este modelo es coherente. En **entornos serverless con filesystem efímero** (p. ej. Vercel por defecto) **no** es fiable guardar ahí el contenido sin adaptar la arquitectura.

---

## Requisitos

- **Node.js** `>= 20.9.0` (Next.js 16). El archivo `.nvmrc` fija la línea **22** para desarrollo local con [nvm](https://github.com/nvm-sh/nvm) (`nvm use`).
- Variables de entorno: copia `.env.example` a `.env` y rellena los valores necesarios.

---

## Instalación reproducible

```bash
npm ci
```

Usa `npm ci` en CI y producción cuando el lockfile esté versionado; es más estricto que `npm install`.

---

## Producción (build + start)

```bash
npm run build
npm run start
```

Por defecto Next escucha en el puerto **3000**. Para fijar host/puerto (p. ej. acceso desde la red local):

```bash
PORT=3000 HOSTNAME=0.0.0.0 npm run start
```

- `0.0.0.0`: escucha en todas las interfaces (útil si quieres entrar desde otro dispositivo en la misma red; abre el puerto en el firewall si aplica).
- `127.0.0.1`: solo en la misma máquina.

**Persistencia:** respalda y protege el directorio `data/runtime` si es la fuente de verdad del contenido.

---

## Desplegar en tu propio ordenador (Linux) y arranque automático

Puedes mantener **el sistema de almacenamiento actual** sin problema: el servicio solo debe ejecutarse con el **mismo usuario y `WorkingDirectory`** que apunten al proyecto, para que `data/runtime` sea siempre el mismo.

### Servicio systemd (usuario)

1. Crear un unit en `~/.config/systemd/user/tu-servicio.service` con:
   - `WorkingDirectory=/ruta/absoluta/al/proyecto`
   - `ExecStart` con la ruta absoluta a `node` o a `npm` (si usas nvm, el PATH del servicio no carga nvm: mejor binario fijo o `fnm`/`n` con ruta explícita).
   - `Restart=always`
2. Activar:

```bash
systemctl --user daemon-reload
systemctl --user enable --now tu-servicio.service
```

3. Para que el servicio de usuario siga vivo sin sesión gráfica (según distro):

```bash
loginctl enable-linger $USER
```

### Alternativa: PM2

`pm2 start npm --name portfolio -- start` y `pm2 startup` + `pm2 save` genera integración con el arranque del sistema (suele delegar en systemd).

Tras cada cambio de código: `npm ci`, `npm run build` y **reiniciar** el servicio.

---

## Cómo poner el sitio en internet

Resumen de caminos habituales:

| Enfoque | Almacenamiento JSON actual | Notas |
|---------|----------------------------|--------|
| **Tu PC o VPS con disco persistente** | Sí, válido | Mismo modelo que en local; backups de `data/runtime`. |
| **Hosting tipo Vercel / similar (serverless)** | No fiable tal cual | El FS del runtime no es un almacén persistente; haría falta BD (Postgres, etc.) o Blob + refactor. |
| **VPS (nginx/Caddy + Node)** | Sí | Dominio con DNS (A/AAAA), HTTPS con Let’s Encrypt. |
| **PC en casa** | Sí en disco local | IP dinámica, posible CGNAT, puertos bloqueados; **Cloudflare Tunnel** suele ser más simple que abrir puertos en el router. |

### Plataformas gestionadas (Vercel, Netlify, Railway, etc.)

- Conectan el repo, hacen build y HTTPS.
- **No asignan “una base de datos” automática** para este proyecto: el código actual **no** usa Vercel Postgres por sí solo.
- Para este repositorio, sin cambios, el almacenamiento en `data/runtime/` **no es adecuado** para producción en serverless.

### Servidor propio (recomendado si quieres mantener JSON + admin sin reescribir)

- Un **VPS** o **tu máquina siempre encendida** con Node, `npm run build`, `npm run start` detrás de un proxy (Caddy/nginx) en 443.

### Desde casa sin tocar el router (túnel)

- **Cloudflare Tunnel** (`cloudflared`): conexión saliente hacia Cloudflare; hostname y HTTPS sin abrir puertos entrantes; el stack de ficheros sigue siendo tu PC.

---

## Seguridad

- Ejecuta `npm audit` de forma periódica; no sustituye revisión manual del admin y credenciales.
- Si expones el sitio a internet: **HTTPS**, firewall, contraseña fuerte del admin, backups de `data/runtime`.
- Minimiza la superficie de ataque en tu router si abres puertos (preferir túnel o VPS).

---

## Actualizar dependencias (cada 6–12 meses, o cuando el hosting lo exija)

1. Revisar [Node.js release schedule](https://nodejs.org/en/about/releases/) y subir `.nvmrc` / `engines` si hace falta.
2. Ejecutar `npm outdated` y actualizar paquetes de forma controlada (preferible una familia a la vez: Next primero, luego el resto).
3. `npm run build`, `npm run lint` y `npm run typecheck`.
4. Regenerar `package-lock.json` con `npm install` tras cambiar versiones en `package.json` y commitear el lockfile.

---

## Referencia rápida

- **¿Base de datos?** No; **JSON + carpetas** bajo `data/runtime/`.
- **¿Vercel sin cambios?** Contenido admin **no** persistente de forma fiable.
- **¿Mi PC o VPS?** Sí, encaja con el diseño actual.
- **¿Arranque al encender el PC?** systemd (usuario o sistema) o PM2.
