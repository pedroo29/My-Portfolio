# Despliegue en VPS (proceso completo)

Guía para poner el portfolio en un **VPS con Linux** (Ubuntu/Debian), accesible por HTTP/HTTPS, **sin servicios de pago extra** (solo el coste del propio VPS). El proyecto usa **Next.js** en modo `npm run start` detrás de **Nginx** como proxy inverso.

---

## Requisitos previos

- **VPS** con IP pública y acceso **SSH** como root o usuario con `sudo`.
- **Dominio** (opcional para el primer paso; puedes usar solo la IP).
- En local: **Node.js ≥ 20.9** alineado con `package.json` / `.nvmrc`.

### Modelo de datos (importante)

No hay base de datos SQL. El contenido vive en disco:

| Ruta | Contenido |
|------|-----------|
| `data/runtime/store.json` | Labs, skills, certificaciones, roadmap, catálogos, textos globales (home, about, contact, etc.) |
| `data/runtime/media/` | Ficheros subidos desde el admin |

`data/runtime/` está en **`.gitignore`**: en el repo no viaja tu contenido real. En el servidor debes **copiar** tu backup o generar un store inicial.

---

## 1. Servidor: sistema y firewall

```bash
sudo apt update && sudo apt upgrade -y
```

Firewall típico con UFW (ajusta si usas otro):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 2. Node.js (nvm recomendado)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Cierra sesión SSH y vuelve a entrar, o:
source ~/.bashrc
nvm install 20
nvm use 20
node -v
```

---

## 3. Código en el VPS

Ejemplo de ruta de despliegue: `/var/www/portfolio`.

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone <url-de-tu-repo> portfolio
cd portfolio
```

Alternativa: subir un zip/rsync desde tu máquina.

### Variables de entorno

```bash
cp .env.example .env
nano .env
```

Rellena lo necesario (p. ej. credenciales del admin). No subas `.env` al repositorio público.

### Instalación y build

```bash
npm ci
npm run build
```

`npm ci` respeta `package-lock.json` y es la opción recomendada en CI/producción.

---

## 4. Arranque con PM2

El proceso debe ejecutarse con **`cwd` (directorio de trabajo) = raíz del proyecto**, para que `data/runtime/store.json` se resuelva como `/var/www/portfolio/data/runtime/store.json`.

```bash
cd /var/www/portfolio
pm2 start npm --name portfolio -- start
pm2 save
pm2 startup
# Ejecuta el comando que te indique `pm2 startup` (sudo) para activar al reiniciar el VPS
```

Comprueba:

```bash
pm2 show portfolio
```

**`exec cwd`** debe ser `/var/www/portfolio` (o la ruta donde clonaste el proyecto).

### Puerto y red

Por defecto Next escucha en el **puerto 3000** en `127.0.0.1`. Para escuchar en todas las interfaces (solo si no usas Nginx delante):

```bash
PORT=3000 HOSTNAME=0.0.0.0 pm2 start npm --name portfolio -- start
```

En el esquema habitual **Nginx en 80/443 → Node en 3000 localhost**, basta con `npm start` por defecto.

---

## 5. Nginx como proxy inverso (puerto 80 → 3000)

Instalación:

```bash
sudo apt install -y nginx
```

Crear un sitio, por ejemplo `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Si solo usas IP: `server_name _;` o la IP pública.

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default   # opcional, si choca
sudo nginx -t
sudo systemctl reload nginx
```

DNS: en tu proveedor de dominio, registros **A** (y **AAAA** si usas IPv6) apuntando a la IP del VPS.

### HTTPS gratuito (Let’s Encrypt)

Cuando el dominio apunte al servidor:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Renovación automática suele quedar en un timer de `certbot`.

---

## 6. Contenido: `store.json` y `media/`

### Copiar tu backup

Desde tu PC (ejemplo con `scp`):

```bash
scp /ruta/local/store.json root@TU_VPS:/var/www/portfolio/data/runtime/store.json
scp -r /ruta/local/media/* root@TU_VPS:/var/www/portfolio/data/runtime/media/
```

### Validar JSON en el servidor

```bash
python3 -m json.tool /var/www/portfolio/data/runtime/store.json > /dev/null && echo "JSON OK"
wc -l /var/www/portfolio/data/runtime/store.json
```

Un `store.json` real con muchos ítems suele tener **miles de líneas**; unas pocas centenas puede indicar store vacío o copia truncada.

### Scripts npm útiles (solo desarrollo / utilidad)

| Comando | Efecto |
|---------|--------|
| `npm run seed:store` | Escribe un **dataset grande de demo** desde `seed-data.ts` en `data/runtime/store.json` (stress-test). |
| `npm run bootstrap:empty-store` | Escribe un **store mínimo** vacío (colecciones en cero). |

**No** confundas tu backup personal con el seed de demo.

### Riesgo: store “reiniciado”

Si `store.json` es **inválido** o no se puede leer, la aplicación puede **regenerar un store inicial** y sobrescribir el archivo. Por eso:

- Tras subir datos, **valida el JSON** antes de asumir que está bien.
- Mantén **copias de seguridad** fuera del VPS (`cp` a `/root/`, otro disco, tu PC).

---

## 7. Build estático y datos (muy importante)

En **desarrollo** (`npm run dev`), las páginas leen `store.json` en cada petición.

En **producción** (`npm run build` + `npm run start`), varias rutas se **prerenderizan** en el build. Si ejecutaste el build **cuando el store estaba vacío** y luego sustituiste `store.json` **sin volver a hacer build**, la **home**, **about**, **contact** y la lista **roadmap** pueden seguir mostrando contenido antiguo o vacío, mientras que rutas **dinámicas** (p. ej. skills con query, certificaciones con `force-dynamic`) sí muestran datos nuevos.

**Qué hacer cuando cambias el contenido en disco:**

```bash
cd /var/www/portfolio
npm run build
pm2 restart portfolio
```

El proyecto puede declarar `export const dynamic = "force-dynamic"` en páginas concretas para evitar depender de este comportamiento; revisa el código actual si tras un deploy sigues viendo HTML desactualizado.

---

## 8. Actualizar el código en el VPS

```bash
cd /var/www/portfolio
git pull
npm ci
npm run build
pm2 restart portfolio
```

Si cambian dependencias o Node, alinea la versión con `engines` / `.nvmrc`.

---

## 9. Referencia rápida de problemas

| Síntoma | Causa probable |
|---------|----------------|
| No puedo hacer login en admin (dev) | Cookie de sesión: el login usa `POST /api/admin/login` y fija la cookie en la respuesta; usa siempre el **mismo host** (`localhost` vs `127.0.0.1` son distintos). Contraseña con `#` o `=` en `.env` debe ir **entre comillas**. |
| Admin muestra números bien pero la home no | Las rutas públicas que leen `store.json` usan **`export const dynamic = "force-dynamic"`** para no servir HTML pregenerado en el build; si aún ves datos viejos, `npm run build` + reinicio tras cambiar código. |
| `store.json` “vacío” de repente | JSON inválido o fallo de lectura → regeneración del store mínimo; **restaurar backup** y validar JSON. |
| Texto en about/contact vacío | Campos vacíos en el JSON **o** HTML cacheado en build; revisar store y **rebuild**. |
| Skills en lista OK, home sin preview | Misma lógica de estática + filtros de la home (labs destacados, roadmap activo, etc.). |

Comprueba siempre:

```bash
pm2 show portfolio    # exec cwd = raíz del proyecto
pm2 logs portfolio
```

---

## 10. Seguridad y backups

- **HTTPS** en producción (Certbot + Nginx).
- **Firewall** (solo SSH + 80/443 abiertos hacia internet).
- Contraseña fuerte del **panel admin** y variables en `.env`.
- **Backups periódicos** de `data/runtime/` (`store.json` + carpeta `media/`).

---

## 11. Instalación reproducible (resumen)

```bash
npm ci
npm run build
npm run start
```

Variables útiles: `PORT`, `HOSTNAME` (ver sección PM2).

---

## 12. Otros entornos

| Entorno | ¿Válido con JSON en `data/runtime/`? |
|---------|--------------------------------------|
| PC o VPS con disco persistente | Sí |
| Vercel / serverless típico | **No** fiable: el filesystem no es almacén persistente; haría falta otra arquitectura |
| PC en casa sin abrir puertos | Opciones como **Cloudflare Tunnel** |

---

*Documentación alineada con el diseño actual del repositorio (Next.js, `content-store`, PM2, Nginx). Ajusta rutas y nombres de dominio a tu caso.*
