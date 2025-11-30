// ============================================================
// 🐾 src/components/ListaMascotas.js
// Lista de mascotas con iconos y chips de estado de salud
// ============================================================

import React from "react";

/*
  Props que recibe el componente:

  - mascotas        → array de mascotas que viene del backend
  - onEditar        → función para iniciar edición de una mascota
  - onEliminar      → función para eliminar una mascota
  - onVerDetalles   → función para abrir el detalle (vacunas/cuidados)
*/

// ------------------------------------------------------------
// 🔹 Función auxiliar: icono según la especie
// ------------------------------------------------------------
function getIconoEspecie(especie) {
  if (!especie) return "🐾";

  const e = especie.toLowerCase();

  if (e.includes("perro")) return "🐶";
  if (e.includes("gato")) return "🐱";
  if (e.includes("ave")) return "🕊️";
  if (e.includes("conejo")) return "🐰";

  return "🐾";
}

// ------------------------------------------------------------
// 🔹 Función auxiliar: clase CSS según condición de salud
// ------------------------------------------------------------
function getClaseCondicion(condicion) {
  if (!condicion) return "chip chip-salud-neutra";

  const c = condicion.toLowerCase();

  if (c.includes("sano") || c.includes("sana")) return "chip chip-salud-buena";
  if (c.includes("alerg")) return "chip chip-salud-media";
  if (c.includes("diab")) return "chip chip-salud-mala";

  return "chip chip-salud-neutra";
}

// ------------------------------------------------------------
// ⭐ Componente principal: ListaMascotas
// ------------------------------------------------------------
function ListaMascotas({ mascotas, onEditar, onEliminar, onVerDetalles }) {
  return (
    <section className="card">
      {/* Cabecera de la sección */}
      <header>
        <h2 className="bloque-titulo">Mascotas registradas</h2>
        <p className="bloque-descripcion">
          Aquí puedes ver todas las mascotas, editarlas, eliminarlas o revisar
          su historial de vacunas y cuidados.
        </p>
      </header>

      {/* Si no hay mascotas, mostramos un mensaje simple */}
      {mascotas.length === 0 && <p>No hay mascotas registradas aún.</p>}

      {/* Si hay mascotas, mostramos la tabla */}
      {mascotas.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Peso</th>
              <th>Condición</th>
              <th>ID Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mascotas.map((m) => (
              <tr key={m.id_mascota}>
                <td>{m.id_mascota}</td>
                <td>{m.nombre}</td>

                {/* Especie con icono y chip de color */}
                <td>
                  <span
                    className={
                      m.especie &&
                      m.especie.toLowerCase().includes("perro")
                        ? "chip chip-especie-perro"
                        : m.especie &&
                          m.especie.toLowerCase().includes("gato")
                        ? "chip chip-especie-gato"
                        : "chip chip-especie-otro"
                    }
                  >
                    <span>{getIconoEspecie(m.especie)}</span>
                    <span>{m.especie || "Sin especificar"}</span>
                  </span>
                </td>

                <td>{m.raza}</td>
                <td>{m.edad}</td>
                <td>{m.peso}</td>

                {/* Condición de salud con chip de color */}
                <td>
                  <span className={getClaseCondicion(m.condicion)}>
                    {m.condicion || "Sin registro"}
                  </span>
                </td>

                <td>{m.id_usuario}</td>

                {/* Botones de acción para cada mascota */}
                <td>
                  <button
                    className="btn-secondary"
                    style={{ marginRight: "6px" }}
                    onClick={() => onEditar && onEditar(m)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    style={{ marginRight: "6px" }}
                    onClick={() => onEliminar && onEliminar(m.id_mascota)}
                  >
                    Eliminar
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => onVerDetalles && onVerDetalles(m)}
                  >
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ListaMascotas;