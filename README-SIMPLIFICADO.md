# ProjecteDigitalizacio — estructura simplificada

## Dónde tocar cada cosa

- `src/app/app.component.ts`: comportamiento de la cabecera y sesión.
- `src/app/app.component.html`: HTML de la cabecera y el contenedor de páginas.
- `src/app/pages/`: pantallas de la aplicación.
  - `inicio/`: pantalla principal y registro de salidas.
  - `login/`: inicio de sesión de demostración.
  - `ficha/`: ficha de alumno o profesor.
  - `admin/`: formulario de gestión.
  - `estadisticas/`: estadísticas.
- `src/app/core/`: lógica compartida entre pantallas.
  - `auth.service.ts`: usuario que ha iniciado sesión.
  - `data.service.ts`: datos de demostración usados actualmente.
  - `guards.ts`: control de acceso a las rutas.
  - `models.ts`: tipos de datos y funciones sencillas de nombres/fechas.
- `src/app/app.routes.ts`: rutas y pantalla que se abre en cada URL.
- `src/styles.css`: estilos visuales globales.
- `src/Backend/`: backend original. No se ha modificado.

## Cómo está organizada una pantalla

Cada pantalla usa ahora archivos separados:
- `.component.ts`: datos, funciones y comportamiento.
- `.component.html`: estructura HTML que se muestra.

Los estilos se mantienen en `src/styles.css` para conservar el diseño existente. No se han añadido capas o patrones nuevos.

## Qué se ha limpiado

Se han sacado las plantillas HTML que estaban escritas dentro de los `.ts` a sus propios archivos `.html`. También se han eliminado componentes y servicios de una estructura anterior que no aparecen en las rutas activas y que duplicaban la implementación actual.

## Ejecutar

Desde esta carpeta:

```bash
npm install
npm start
```

El backend se ha dejado tal como estaba en el ZIP original. Esta limpieza no implica que las funciones de demostración estén conectadas a la API real.
