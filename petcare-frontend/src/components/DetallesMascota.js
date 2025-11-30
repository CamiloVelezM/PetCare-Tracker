// ============================================================
// 🐾 src/components/DetallesMascota.js
// Componente que muestra los DETALLES de una mascota:
// - Vacunas (CRUD completo)
// - Cuidados (CRUD completo)
// ============================================================

import React, { useState } from "react";

function DetallesMascota({
  mascota,            // Mascota seleccionada (objeto con id, nombre, especie, etc.)
  vacunas,            // Lista de vacunas de esa mascota
  cuidados,           // Lista de cuidados de esa mascota
  onCerrar,           // Función para cerrar este panel de detalles
  onAgregarVacuna,    // Función para crear vacuna (la implementa App.js)
  onAgregarCuidado,   // Función para crear cuidado
  onActualizarVacuna, // Función para actualizar vacuna
  onEliminarVacuna,   // Función para eliminar vacuna
  onActualizarCuidado,// Función para actualizar cuidado
  onEliminarCuidado,  // Función para eliminar cuidado
}) {
  // ==========================================================
  // 1️⃣ ESTADO LOCAL DE LOS FORMULARIOS
  // ==========================================================

  // Formulario de vacuna (nombre + fecha)
  const [vacunaForm, setVacunaForm] = useState({
    nombre: "",
    fecha_aplicacion: "",
  });

  // Formulario de cuidado (tipo + descripcion + fecha)
  const [cuidadoForm, setCuidadoForm] = useState({
    tipo: "",
    descripcion: "",
    fecha: "",
  });

  // IDs que indican si estamos EDITANDO (en vez de crear)
  const [vacunaEditandoId, setVacunaEditandoId] = useState(null);
  const [cuidadoEditandoId, setCuidadoEditandoId] = useState(null);

  // Si por alguna razón no hay mascota seleccionada, no dibujamos nada
  if (!mascota) return null;

  // ==========================================================
  // 2️⃣ MANEJO DE FORMULARIO DE VACUNAS
  // ==========================================================

  // Actualizar los campos del formulario de vacuna
  const handleChangeVacuna = (e) => {
    const { name, value } = e.target;
    setVacunaForm((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario de vacuna (crear o actualizar)
  const handleSubmitVacuna = (e) => {
    e.preventDefault();

    // Validación básica
    if (!vacunaForm.nombre || !vacunaForm.fecha_aplicacion) {
      alert("Nombre y fecha de la vacuna son obligatorios");
      return;
    }

    // Si hay un id en edición → ACTUALIZAMOS
    if (vacunaEditandoId) {
      onActualizarVacuna(
        vacunaEditandoId,          // id_vacuna que estamos editando
        mascota.id_mascota,        // id de la mascota
        vacunaForm,                // datos nuevos
        () => {                    // callback cuando el backend termina bien
          setVacunaEditandoId(null);
          setVacunaForm({ nombre: "", fecha_aplicacion: "" });
        }
      );
    } else {
      // Si NO hay id en edición → CREAMOS una vacuna nueva
      onAgregarVacuna(mascota.id_mascota, vacunaForm, () => {
        setVacunaForm({ nombre: "", fecha_aplicacion: "" });
      });
    }
  };

  // Pasar al modo "editar vacuna" y llenar el formulario con los datos actuales
  const comenzarEditarVacuna = (vacuna) => {
    setVacunaEditandoId(vacuna.id_vacuna);
    setVacunaForm({
      nombre: vacuna.nombre,
      fecha_aplicacion: vacuna.fecha_aplicacion,
    });
  };

  // Cancelar la edición de vacuna (volver a modo creación)
  const cancelarEdicionVacuna = () => {
    setVacunaEditandoId(null);
    setVacunaForm({ nombre: "", fecha_aplicacion: "" });
  };

  // Eliminar una vacuna tras confirmar
  const handleEliminarVacuna = (vacuna) => {
    const confirmar = window.confirm(
      `¿Eliminar la vacuna "${vacuna.nombre}"?`
    );
    if (!confirmar) return;

    onEliminarVacuna(vacuna.id_vacuna, mascota.id_mascota);
  };

  // ==========================================================
  // 3️⃣ MANEJO DE FORMULARIO DE CUIDADOS
  // ==========================================================

  // Actualizar campos del formulario de cuidado
  const handleChangeCuidado = (e) => {
    const { name, value } = e.target;
    setCuidadoForm((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario de cuidado (crear o actualizar)
  const handleSubmitCuidado = (e) => {
    e.preventDefault();

    // Validación básica
    if (!cuidadoForm.tipo || !cuidadoForm.fecha) {
      alert("Tipo y fecha del cuidado son obligatorios");
      return;
    }

    // Si hay cuidadoEditandoId → ACTUALIZAMOS
    if (cuidadoEditandoId) {
      onActualizarCuidado(
        cuidadoEditandoId,        // id_cuidado
        mascota.id_mascota,
        cuidadoForm,
        () => {
          setCuidadoEditandoId(null);
          setCuidadoForm({ tipo: "", descripcion: "", fecha: "" });
        }
      );
    } else {
      // Si no, CREAMOS nuevo cuidado
      onAgregarCuidado(mascota.id_mascota, cuidadoForm, () => {
        setCuidadoForm({ tipo: "", descripcion: "", fecha: "" });
      });
    }
  };

  // Pasar a modo edición de cuidado
  const comenzarEditarCuidado = (cuidado) => {
    setCuidadoEditandoId(cuidado.id_cuidado);
    setCuidadoForm({
      tipo: cuidado.tipo,
      descripcion: cuidado.descripcion || "",
      fecha: cuidado.fecha,
    });
  };

  // Cancelar edición de cuidado
  const cancelarEdicionCuidado = () => {
    setCuidadoEditandoId(null);
    setCuidadoForm({ tipo: "", descripcion: "", fecha: "" });
  };

  // Eliminar cuidado tras confirmación
  const handleEliminarCuidado = (cuidado) => {
    const confirmar = window.confirm(
      `¿Eliminar el cuidado "${cuidado.tipo}"?`
    );
    if (!confirmar) return;

    onEliminarCuidado(cuidado.id_cuidado, mascota.id_mascota);
  };

  // ==========================================================
  // 4️⃣ RENDER DEL COMPONENTE
  // ==========================================================

  return (
    // section: bloque independiente dentro de la página
    <section className="card" style={{ marginTop: "20px" }}>
      {/* Encabezado de la sección de detalles */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <h2>Detalles de {mascota.nombre}</h2>

        <button className="btn-secondary" onClick={onCerrar}>
          Cerrar
        </button>
      </header>

      {/* Resumen básico de la mascota */}
      <p>
        <strong>Especie:</strong> {mascota.especie} ·{" "}
        <strong>Raza:</strong> {mascota.raza} ·{" "}
        <strong>Edad:</strong> {mascota.edad} años
      </p>

      {/* ======================================================
          BLOQUE: VACUNAS
         ====================================================== */}
      <section style={{ marginTop: "16px" }}>
        <h3>Vacunas</h3>

        {/* Mensaje si no hay vacunas */}
        {vacunas.length === 0 && <p>No hay vacunas registradas.</p>}

        {/* Tabla de vacunas cuando existen registros */}
        {vacunas.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de aplicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.map((v) => (
                <tr key={v.id_vacuna}>
                  <td>{v.nombre}</td>
                  <td>{v.fecha_aplicacion}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ marginRight: "6px" }}
                      onClick={() => comenzarEditarVacuna(v)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleEliminarVacuna(v)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulario para crear / editar vacuna */}
        <form className="form" onSubmit={handleSubmitVacuna}>
          <div className="form-row">
            <label>Nombre de la vacuna</label>
            <input
              name="nombre"
              value={vacunaForm.nombre}
              onChange={handleChangeVacuna}
              placeholder="Rabia, Parvovirus..."
            />
          </div>

          <div className="form-row">
            <label>Fecha de aplicación</label>
            <input
              type="date"
              name="fecha_aplicacion"
              value={vacunaForm.fecha_aplicacion}
              onChange={handleChangeVacuna}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button className="btn-primary" type="submit">
              {vacunaEditandoId ? "Actualizar vacuna" : "Registrar vacuna"}
            </button>

            {vacunaEditandoId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelarEdicionVacuna}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ======================================================
          BLOQUE: CUIDADOS
         ====================================================== */}
      <section style={{ marginTop: "24px" }}>
        <h3>Cuidados</h3>

        {/* Mensaje si no hay cuidados */}
        {cuidados.length === 0 && <p>No hay cuidados registrados.</p>}

        {/* Tabla de cuidados */}
        {cuidados.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuidados.map((c) => (
                <tr key={c.id_cuidado}>
                  <td>{c.tipo}</td>
                  <td>{c.descripcion}</td>
                  <td>{c.fecha}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ marginRight: "6px" }}
                      onClick={() => comenzarEditarCuidado(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleEliminarCuidado(c)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulario para crear / editar cuidado */}
        <form className="form" onSubmit={handleSubmitCuidado}>
          <div className="form-row">
            <label>Tipo de cuidado</label>
            <input
              name="tipo"
              value={cuidadoForm.tipo}
              onChange={handleChangeCuidado}
              placeholder="Baño, control, desparasitación..."
            />
          </div>

          <div className="form-row">
            <label>Descripción (opcional)</label>
            <input
              name="descripcion"
              value={cuidadoForm.descripcion}
              onChange={handleChangeCuidado}
              placeholder="Detalles del cuidado"
            />
          </div>

          <div className="form-row">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={cuidadoForm.fecha}
              onChange={handleChangeCuidado}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button className="btn-primary" type="submit">
              {cuidadoEditandoId ? "Actualizar cuidado" : "Registrar cuidado"}
            </button>

            {cuidadoEditandoId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelarEdicionCuidado}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>
    </section>
  );
}

export default DetallesMascota;