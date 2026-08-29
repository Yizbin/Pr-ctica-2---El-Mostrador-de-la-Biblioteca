import { cargarCatalogo } from './catalogo.js';
import { type Mostrador, prestar, disponiblesDe, estadoDe, multaDe } from './dominio/prestamos.js';
import { LibroNoEncontradoError, SinEjemplaresError } from './dominio/tipos.js';
import { pedirOpcion, pedirTexto } from './entrada.js';

async function main() {
  const { libros, descartados } = cargarCatalogo('./datos/catalogo.json');
  console.log(`\nCatálogo procesado: ${libros.length} libros válidos, ${descartados} registros descartados.\n`);

  const mostrador: Mostrador = { libros, prestamos: [] };

  const OPCIONES = [
    { valor: 'catalogo', etiqueta: '1. Ver catálogo y ejemplares disponibles' },
    { valor: 'prestar', etiqueta: '2. Prestar un libro' },
    { valor: 'prestamos', etiqueta: '3. Ver préstamos y multas' },
    { valor: 'salir', etiqueta: '4. Salir' },
  ] as const;

  while (true) {
    const opcion = await pedirOpcion('Mostrador de la Biblioteca - Elija una opción:', OPCIONES);
    if (!opcion || opcion === 'salir') break;

    switch (opcion) {
      case 'catalogo':
        console.table(
          mostrador.libros.map((l) => ({
            ID: l.id,
            Título: l.titulo,
            Autor: l.autor,
            Disponibles: disponiblesDe(mostrador, l),
          }))
        );
        break;

      case 'prestar': {
        const libroId = await pedirTexto('ID del libro:');
        const socio = await pedirTexto('Nombre del socio:');
        if (!libroId || !socio) {
          console.log('Operación cancelada.');
          break;
        }

        try {
          const p = prestar(mostrador, libroId, socio, new Date());
          console.log(`\n✓ Préstamo realizado: Folio ${p.folio}, vence el ${p.venceEn.toLocaleDateString()}\n`);
        } catch (error) {
          if (error instanceof LibroNoEncontradoError || error instanceof SinEjemplaresError) {
            console.error(`\n[Regla no cumplida]: ${error.message}\n`);
          } else {
            console.error('Error inesperado:', error);
          }
        }
        break;
      }

      case 'prestamos': {
        const hoy = new Date();
        console.table(
          mostrador.prestamos.map((p) => {
            const estado = estadoDe(p, hoy);
            return {
              Folio: p.folio,
              LibroID: p.libroId,
              Socio: p.socio,
              Estado: estado,
              Multa: `$${multaDe(p, estado, hoy)}`,
            };
          })
        );
        break;
      }
    }
  }
}

main();