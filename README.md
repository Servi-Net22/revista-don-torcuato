# Revista Don Torcuato

Revista digital de Don Torcuato (Tigre, Buenos Aires). Se publica en cualquier hosting y se reparte por WhatsApp, email y redes.

## Qué incluye

- Portada y edición completa (se puede imprimir o guardar como PDF)
- Secciones: Actualidad, Barrio, Comercios, Profesionales, Clasificados, Agenda
- Guía de comercios con filtro y WhatsApp
- Buscador de profesionales
- Paquetes para anunciantes
- Formulario de contacto (abre WhatsApp o el mail)
- Registro para recibir ediciones por email y/o WhatsApp (`recibir.html`)
- Lista interna de suscriptores en `redaccion.html` (clave en `_private/config.php`)
- Página **Difundir** con textos listos para reenviar
- Plantilla HTML de email en `email/edicion.html`

Los textos de ejemplo son de muestra. Reemplazalos por comercios, profesionales y notas reales.

## Antes de publicar

1. Abrí `js/config.js` y cambiá:
   - `url` → `https://tudominio.com.ar` (sin barra final)
   - `email`, `whatsapp`, `telefono`, `instagram`
2. Editá contenidos en `js/data.js`:
   - `edicion`, `articulos`, `comercios`, `profesionales`, `clasificados`, `eventos`, `paquetes`
3. En `email/edicion.html` reemplazá `TU-DOMINIO.com.ar`.

El WhatsApp se escribe con código de país, sin `+` ni espacios: `54911XXXXXXXX`.

## Subir al hosting

La revista es HTML, CSS y JavaScript. No necesita base de datos ni Node.

1. Entrá a cPanel → Administrador de archivos, o usá FileZilla / FTP.
2. Subí **todo el contenido de esta carpeta** a `public_html` (o a una subcarpeta, por ejemplo `public_html/revista`).
3. La home es `index.html`.
4. Probá:
   - `https://tudominio.com.ar/`
   - `https://tudominio.com.ar/edicion.html`
   - `https://tudominio.com.ar/profesionales.html`

Si la subís a una subcarpeta, poné esa URL completa en `js/config.js`.

## Cómo se distribuye

1. Publicás la edición en el hosting.
2. Entrá a **Difundir** y mandá el texto por WhatsApp a grupos del barrio.
3. Usá el mismo enlace en el mail (Gmail, Outlook o un envío masivo).
4. En **Edición** → *Imprimir / guardar PDF* para el mostrador o un adjunto.
5. Compartí notas sueltas desde el botón de cada artículo.

## Cómo cargar un comercio o un profesional

En `js/data.js`, copiá un objeto de `comercios` o `profesionales` y cambiá nombre, rubro, dirección y WhatsApp. Recargá el sitio.

Para destacar a alguien en la home, dejá `"dest": true`.

## Cómo armar la próxima edición

1. Subí el número y el mes en `edicion`.
2. Reemplazá o agregá objetos en `articulos`.
3. El `id` de cada nota es la URL: `articulo.html?id=ese-id`.
4. Volvé a subir `js/data.js` (y las páginas si las tocaste).

## Probar en la computadora

Desde esta carpeta:

```bash
python3 -m http.server 8080
```

Abrí `http://127.0.0.1:8080`.
