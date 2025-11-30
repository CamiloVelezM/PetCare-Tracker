// ============================================================
// 👤 src/components/ListaUsuarios.js
// Lista de usuarios (dueños) con acciones Editar / Eliminar
// ============================================================

import React from "react";

/*
  Props que recibe este componente:

  - usuarios     → lista de usuarios que viene del backend
  - onEditar     → función para pasar un usuario a modo edición
  - onEliminar   → función para eliminar un usuario
  - onEdit       → alias opcional (por compatibilidad con el código previo)

  Nota: aceptamos tanto onEditar como onEdit para evitar errores
  si el componente padre usa un nombre distinto.
*/

function ListaUsuarios({ usuarios, onEditar, onEdit, onEliminar }) {
  // Si llega onEditar lo usamos, si no existe usamos onEdit
  const handleEditar = onEditar || onEdit;

  return (
    // 📦 Sección envolvente
    <section className="card seccion-usuarios">
      {/* 📝 Cabecera descriptiva de la sección */}
      <header>
        <h2 className="bloque-titulo">Usuarios registrados</h2>
        <p className="bloque-descripcion">
          Estos son los dueños de las mascotas registrados en el sistema.
        </p>
      </header>

      {/* Mensaje si no hay usuarios */}
      {usuarios.length === 0 && <p>No hay usuarios registrados aún.</p>}

      {/* Tabla de usuarios */}
      {usuarios.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                {/* Datos del usuario */}
                <td>{u.id_usuario}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.telefono}</td>

                {/* Botones de acción */}
                <td>
                  <button
                    className="btn-secondary"
                    style={{ marginRight: "6px" }}
                    onClick={() => handleEditar && handleEditar(u)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => onEliminar && onEliminar(u.id_usuario)}
                  >
                    Eliminar
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

export default ListaUsuarios;