# Respuestas Teoricas - Practica 2

### 1. ¿Por qué una union de valores y no una enumeración?
Las uniones literales son tipos puros que desaparecen tras la transpilación a JavaScript sin generar código adicional en tiempo de ejecución. Las enumeraciones (`enum`) generan objetos JavaScript adicionales y permiten inconsistencias o asignaciones numéricas inseguras.

### 2. ¿Qué se gana con el tipo `unknown` en lugar del que acepta todo (`any`)?
`any` desactiva por completo el analizador estático de tipos permitiendo errores no detectados. `unknown` obliga al desarrollador a comprobar y estrechar el tipo mediante guardas explícitas antes de utilizar las propiedades de un objeto o dato externo.

### 3. ¿Por que la fecha entra como parámetro?
Hacer que la fecha entre como parámetro vuelve puras y deterministas a las funciones del dominio, permitiendo probar escenarios de préstamos vencidos y cálculo de multas en cualquier momento temporal sin depender del reloj del sistema (`new Date()`).
