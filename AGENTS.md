# Guía para agentes de IA

Este sitio es una plantilla de Ixbal: HTML, CSS y JavaScript sin dependencias ni paso de compilación. Lo que ves en `index.html` es exactamente lo que se publica.

## Reglas

- **No agregues frameworks, bundlers ni dependencias de npm.** El entorno no ejecuta `npm install`.
- **Valida siempre** con `npm run check` después de cada cambio. Debe terminar en `✓`.
- **Colores, tipografía y espacios solo en `assets/css/tokens.css`.** Los títulos usan `--font-display` y el texto `--font-sans`. No escribas colores hexadecimales fuera de ese archivo; usa `var(--color-…)`.
- **Un archivo CSS por componente o sección.** Si creas uno nuevo, impórtalo en `assets/css/main.css` dentro de su capa (`components` o `sections`).
- **Clases con convención BEM:** `bloque__elemento--modificador` (por ejemplo `service-card__title`, `button--primary`).
- **JavaScript en módulos** dentro de `assets/js/modules/`, registrados en `assets/js/main.js`. Los módulos localizan elementos con atributos `data-*` y no fallan si no los encuentran.
- **Íconos** en el sprite `assets/img/icons.svg`; agrega un `<symbol id="…">` y úsalo con `<use href="assets/img/icons.svg#…">`.
- **WhatsApp, teléfono y correo de contacto los administra Ixbal** ("Tu negocio"). No los escribas ni los cambies en el HTML: si la persona pide cambiarlos, usa la herramienta `actualizar_datos_negocio`. Cada liga lleva `data-contact="whatsapp"`, `"phone"` o `"email"`; ponlo también en las ligas nuevas.

## Datos que se repiten

Cuando cambies uno de estos datos, cámbialo en **todos** sus lugares:

| Dato | Dónde aparece |
|---|---|
| Nombre del doctor | `<title>`, `og:title`, `.brand__name`, `aria-label` del logo, JSON-LD, `data-message` del formulario de cita, `#sobre-el-doctor`, pie de página, `alt` de imágenes y `og-image.svg` |
| Cédulas | `.hero__trust`, la lista `.credentials` de `#sobre-el-doctor` y el pie de página |
| WhatsApp | Todos los enlaces con `data-contact="whatsapp"` (formato `https://wa.me/52XXXXXXXXXX`). El formulario de cita toma el número del primero |
| Teléfono | Enlaces con `data-contact="phone"` (formato `tel:+52XXXXXXXXXX`, uno en el hero y otro en `#contacto`) y `telephone` del JSON-LD |
| Dirección | `#contacto`, `.office__features` de `#consultorio`, `src` del mapa y `address` del JSON-LD |
| Horario | Tabla `[data-hours]` en `#contacto` (`data-days`, `data-open`, `data-close` y `data-break` para la hora de comida), la nota del paso 2 de `#agendar` y `openingHoursSpecification` del JSON-LD. Las horas para agendar salen solas de la tabla |
| Precios | Cada `.service__price` de `#servicios`, `.hero__facts` (consulta) y `.home-visits__price` (domicilio) |
| Motivos de consulta | Las `<option>` del campo `motivo` en `#agendar`; conviene que coincidan con los servicios |
| Color principal | `--color-primary` en `tokens.css`, `theme-color`, `logo.svg`, `favicon.svg`, `og-image.svg`, `placeholder.svg` |

`npm run check` detecta WhatsApp o teléfonos distintos entre sí, archivos que no existen, anclas rotas, imágenes sin `alt` y JSON-LD inválido.

## La cita en pasos

`#agendar` es un `<form data-wizard data-whatsapp-form>` con un `<fieldset data-wizard-step>` por paso (ver `assets/js/modules/wizard.js`). El paso 2 contiene `<div data-slot-picker>` (ver `assets/js/modules/slot-picker.js`), que dibuja los próximos días abiertos y sus horas **a partir de la tabla de horario de `#contacto`**: si cambia el horario o la hora de comida, cambia solo la tabla.

- `data-interval` es la duración de cada cita en minutos, `data-days-ahead` cuántos días se ofrecen y `data-lead-minutes` con cuánta anticipación se puede pedir una cita para hoy.
- El mensaje de WhatsApp sale de `data-message`: cada `{campo}` es el `name` de un campo (`paciente`, `motivo`, `dia`, `hora`, `nombre`, `notas`). Si agregas un campo, inclúyelo ahí.
- La franja `.alert-bar` y la nota roja de `#agendar` piden llamar al 911 en emergencias. No las quites: un sitio médico debe decirlo.

## Espacios de imagen

Cada foto del sitio vive en un espacio declarado en `template.json` → `imageSlots`:

```html
<figure class="media media--square" data-slot="galeria-1" data-placeholder data-hint="Foto del local · 1:1">
  <img src="assets/img/placeholder.svg" alt="Descripción de la foto" width="1200" height="1200" loading="lazy">
</figure>
```

Para poner una foto real en un espacio:

1. Cambia el `src` del `<img>` por la ruta de la foto. Las fotos que se suben desde Ixbal llegan a `images/` (por ejemplo `images/fachada.jpg`); usa esa ruta tal cual, sin mover ni renombrar el archivo.
2. Escribe un `alt` que describa la foto real y actualiza `width` y `height` con sus medidas.
3. Borra `data-placeholder` y `data-hint` del `<figure>`. Así desaparece la etiqueta de relleno.
4. No cambies la clase `media--…` ni el `data-slot`: CSS recorta la foto a la proporción del espacio.

Las fotos de `images/` que trae la plantilla son de ejemplo (generadas con IA para el Dr. Andrés Salinas): reemplázalas por las del negocio real siguiendo los mismos pasos, y borra del repositorio las de ejemplo que ya no se usen.

Si la persona sube varias fotos sin decir dónde van, asígnalas según la `label` de cada espacio en `imageSlots`. `npm run check` dice cuántos espacios siguen con imagen de relleno.

## Estructura

```
index.html                 Página única, dividida en secciones con comentarios ============
assets/css/main.css        Orden de capas e imports
assets/css/tokens.css      Identidad visual (edita aquí primero)
assets/css/base.css        Reset y elementos HTML
assets/css/layout.css      Contenedores, secciones, rejillas
assets/css/components/     Piezas reutilizables (botón, tarjeta, encabezado…)
assets/css/sections/       Estilos propios de cada sección de la página
assets/css/utilities.css   Clases de una sola responsabilidad
assets/js/main.js          Registra los módulos
assets/js/modules/         Comportamiento (menú, horario y "Abierto ahora", año, cita en pasos, día y hora de la cita, formulario a WhatsApp)
assets/img/                Logo, íconos e imágenes de relleno
images/                    Fotos que sube la persona desde Ixbal (se crea al subir la primera)
template.json              Metadatos para la galería de plantillas de Ixbal
scripts/check.mjs          Validador sin dependencias
```

## Tareas comunes

- **Otra especialidad:** cambia `.brand__role`, textos, servicios, motivos de consulta y credenciales; en el JSON-LD ajusta `medicalSpecialty` (por ejemplo `Pediatric`, `Gynecologic`, `Cardiovascular`).
- **Sin hora de comida:** borra `data-break` de la fila y deja el texto de la tabla y de la nota del paso 2 con un solo horario.
- **Sin visitas a domicilio:** borra la sección `#domicilio` (y su espacio `domicilio` en `imageSlots`), su enlace en el menú, la tarjeta de servicio, la opción del motivo y el dato de `.hero__facts`.
- **Aseguradoras:** edita la lista `.insurance__list`. Escribe los nombres, no pongas logotipos sin permiso de la marca.
- **Citas de otra duración:** cambia `data-interval` en `[data-slot-picker]` (por ejemplo `20` o `60`).
- **Quitar una sección:** borra el `<section>` completo y su enlace en `.site-nav__list`.
- **Nuevo espacio de imagen:** agrega el `<figure class="media" data-slot="…">` y su entrada en `imageSlots` de `template.json`.
