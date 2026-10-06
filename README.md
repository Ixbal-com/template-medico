# Plantilla Ixbal · Médico

Plantilla para médicos generales, familiares y consultorios. Estilo **clínico accesible**: verde azulado profundo y ámbar sobre blanco cálido, con letra grande y alto contraste pensados para pacientes mayores (títulos en Lexend, texto en Atkinson Hyperlegible).

**Incluye:** franja de emergencias, hero con estado "Consultorio abierto", servicios con precio, **cita en tres pasos (para quién y motivo → día y hora → datos) con días y horas que salen solos de la tabla de horario, incluida la hora de comida**, qué llevar a la consulta, credenciales del doctor, visitas a domicilio con zonas, seguros y formas de pago, consultorio, opiniones, preguntas frecuentes y contacto con mapa.

Ejemplo: **Dr. Andrés Salinas**, medicina familiar en Querétaro.

## Uso

```bash
npm run dev     # servidor local en http://localhost:4321
npm run check   # valida el sitio (sin dependencias)
```

Ábrela con un servidor, no con doble clic: los navegadores no ejecutan módulos de JavaScript desde `file://`.

## Personalizar

1. **Identidad:** colores y tipografía en `assets/css/tokens.css`.
2. **Contenido:** servicios, motivos de consulta, credenciales y horario en `index.html`, organizado por secciones.
3. **Imágenes:** 6 espacios de imagen listados en `imageSlots` de `template.json`, con fotos de ejemplo en `images/` generadas con IA (`gpt-image-2.5-sunburst`). Reemplázalas por fotos reales; ver [AGENTS.md](AGENTS.md#espacios-de-imagen).

Las reglas de arquitectura, la lista de datos que se repiten y cómo funciona la cita están en [AGENTS.md](AGENTS.md).

## Módulos compartidos

Los archivos de `scripts/check.mjs` y de `assets/js/modules/` (y los CSS iniciales de los módulos) vienen de la biblioteca de plantillas Ixbal (`biblioteca/`). Esta plantilla usa `wizard`, `slot-picker` y `whatsapp-form` (ver `"modules"` en `template.json`). Para cambiarlos en todas las plantillas, edítalos en la biblioteca y corre `npm run sync` ahí.

## Publicar

Es un sitio estático: sirve la raíz del repositorio en GitHub Pages, Netlify, Vercel o AWS Amplify.

> Antes de publicar, convierte `assets/img/og-image.svg` a PNG de 1200 × 630 y usa una URL absoluta en `og:image`: WhatsApp y Facebook no muestran vistas previas en SVG.
