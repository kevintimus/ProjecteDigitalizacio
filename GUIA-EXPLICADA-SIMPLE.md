# Guía sencilla del proyecto

Esta versión prioriza código fácil de leer. El diseño visual se conserva y el backend no se ha modificado.

## La idea general

- Los archivos `.html` describen lo que aparece en pantalla.
- Los archivos `.ts` contienen variables y funciones que responden a las acciones.
- Los archivos `.css` controlan la apariencia.
- `DataService` contiene datos de demostración y funciones para consultarlos o modificarlos.
- `AuthService` recuerda qué profesor ha iniciado sesión.
- `app.routes.ts` relaciona las direcciones web con las pantallas.
- `models.ts` define qué datos tiene un alumno, profesor o registro de salida.
- `guards.ts` impide entrar a páginas privadas sin sesión o sin rol de administrador.

## Qué se ha simplificado

### `signal()`
Antes guardaba valores reactivos usando una función especial de Angular. Ahora son variables normales, por ejemplo `mensajeError = ''` o `alumnoSeleccionado: Alumno | null = null`.

### `computed()`
Antes calculaba automáticamente valores derivados. Ahora se usan propiedades `get`, que son funciones que parecen propiedades. Por ejemplo, `get salidasAbiertas()` filtra los registros sin hora de salida.

### `setInterval()` y `setTimeout()`
Se han eliminado del componente de inicio. Ya no hay un temporizador que actualice el contador cada 20 segundos ni acciones automáticas de enfoque del teclado. El contador se calcula cuando Angular actualiza la pantalla después de una interacción. Esto sacrifica la actualización automática en tiempo real para que el código sea más sencillo.

### `inject()`
Se ha sustituido por inyección mediante el constructor en componentes y servicios. Por ejemplo, `constructor(private datosService: DataService) {}` significa que Angular proporciona el servicio al crear el componente.

### Arrays normales
`DataService` usa arrays normales como `alumnos`, `profesores` y `salidas`. Al añadir, editar o borrar datos, el servicio asigna una nueva lista. Esto es más parecido al TypeScript básico que se suele enseñar en clase.

## Recorrido: registrar una salida

1. El usuario escribe el código en `inicio.component.html`.
2. `[(ngModel)]="codigoAlumno"` guarda lo escrito en la variable `codigoAlumno`.
3. Al enviar el formulario se ejecuta `buscarAlumnoPorCodigo()`.
4. Esa función llama a `datosService.alumnoPorCodigo(codigoIntroducido)`.
5. Si encuentra al alumno, lo guarda en `alumnoSeleccionado`.
6. Al pulsar el botón principal se ejecuta `confirmarAccionAlumno()`.
7. Si el alumno ya tiene una salida abierta, llama a `registrarSalida()`. Si no, llama a `enviarAlBano()`.
8. El servicio modifica el array `salidas` y Angular vuelve a dibujar la pantalla.

## Pantallas

- `pages/login`: elegir un profesor de demostración e iniciar sesión.
- `pages/inicio`: buscar alumnos por código, registrar salidas y consultar quién está fuera.
- `pages/ficha`: mostrar los datos de una persona.
- `pages/admin`: crear, editar o borrar alumnos y profesores.
- `pages/estadisticas`: contar salidas, calcular duración media y ordenar alumnos por número de salidas.

## Servicios

### `DataService`
Guarda datos de prueba en memoria. Sus métodos buscan alumnos y profesores, crean personas, actualizan datos, eliminan personas y registran entradas y salidas. Al recargar la página, los datos vuelven a los valores iniciales porque todavía no se guardan en la base de datos.

### `AuthService`
Gestiona el inicio de sesión de demostración. Guarda el identificador del profesor en `sessionStorage` para que la sesión sobreviva a una recarga de la pestaña.

## Guards

`AuthGuard` comprueba que exista una sesión. `AdminGuard` comprueba que el usuario tenga rol de administrador. Si no cumple la condición, redirige a login o a la página de inicio.

## Cosas que se han dejado simples a propósito

- Se conserva Angular standalone y la sintaxis de plantilla `@if` / `@for` porque el proyecto ya usa Angular 18.
- La ficha lee los parámetros de la URL al crearse. La pantalla de administración también lee sus parámetros iniciales. Si se navega entre dos acciones de administración sin destruir el componente, podría ser necesario actualizar esos parámetros; si ocurre, se puede volver a añadir una suscripción sencilla.
- El archivo CSV solo se selecciona; todavía no se importa su contenido.
- No se ha conectado la interfaz con el backend.

## Probar el proyecto

Desde la carpeta del proyecto:

```bash
npm install
npm run build
npm start
```

Si la compilación muestra un error, corregidlo antes de presentar el proyecto. El backend no se ha modificado.
