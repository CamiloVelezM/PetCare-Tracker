// ============================================================
// 🐾 src/components/FormularioUsuario.js
// Formulario para REGISTRAR o EDITAR un usuario (cliente)
// ============================================================

import React, { useEffect, useState } from "react";

/*
 Props que recibe el componente:

 - onUserSaved      → se llama cuando se crea un usuario nuevo
 - usuarioEnEdicion → objeto usuario cuando estamos editando
 - onEditFinished   → se ejecuta al terminar una edición correcta
 - onCancelEdit     → vuelve al modo "crear" si se cancela la edición
*/
function FormularioUsuario({
  onUserSaved,
  usuarioEnEdicion,
  onEditFinished,
  onCancelEdit,
}) {
  // ==========================================================
  // 1️⃣ Estado local del formulario
  // ==========================================================

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  // Si hay usuarioEnEdicion → estamos editando
  const modoEdicion = !!usuarioEnEdicion;

  // ==========================================================
  // 2️⃣ EFECTO: Cargar datos si estamos editando
  // ==========================================================
  useEffect(() => {
    if (usuarioEnEdicion) {
      // Llenamos los campos con la información existente
      setFormData({
        nombre: usuarioEnEdicion.nombre,
        correo: usuarioEnEdicion.correo,
        telefono: usuarioEnEdicion.telefono || "",
      });
    } else {
      // Si no hay usuario seleccionado → limpiar formulario
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
      });
    }
  }, [usuarioEnEdicion]);

  // ==========================================================
  // 3️⃣ Actualizar estado al escribir en los inputs
  // ==========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // 4️⃣ Enviar formulario → Crear o Editar usuario
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.correo) {
      alert("Nombre y correo son obligatorios");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono || null,
    };

    try {
      let url = "http://localhost:4000/usuarios";
      let method = "POST";

      // Si estamos editando → usar PUT
      if (modoEdicion && usuarioEnEdicion?.id_usuario) {
        url = `http://localhost:4000/usuarios/${usuarioEnEdicion.id_usuario}`;
        method = "PUT";
      }

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const detalle = await resp.text();
        alert("Error al guardar usuario:\n" + detalle);
        return;
      }

      // Si todo salió bien → limpiar formulario
      setFormData({ nombre: "", correo: "", telefono: "" });

      if (modoEdicion) {
        if (onEditFinished) onEditFinished();
        alert("🐾 Usuario actualizado correctamente");
      } else {
        if (onUserSaved) onUserSaved();
        alert("🐾 Usuario registrado correctamente");
      }
    } catch (error) {
      console.error("❌ Error al guardar usuario:", error);
      alert("Ocurrió un error al guardar usuario");
    }
  };

  // ==========================================================
  // 5️⃣ Renderizado del formulario (con semántica HTML5)
  // ==========================================================
  return (
    <section className="card">
      <header>
        <h2>{modoEdicion ? "Editar Usuario" : "Registrar Usuario"}</h2>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-row">
          <label htmlFor="nom">Nombre</label>
          <input
            id="nom"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Correo */}
        <div className="form-row">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teléfono */}
        <div className="form-row">
          <label htmlFor="tel">Teléfono</label>
          <input
            id="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div className="form-row" style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" type="submit">
            {modoEdicion ? "Actualizar Usuario" : "Guardar Usuario"}
          </button>

          {modoEdicion && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default FormularioUsuario;