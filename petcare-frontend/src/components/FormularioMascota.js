// ============================================================
// 🐾 src/components/FormularioMascota.js
// Componente para REGISTRAR o EDITAR una mascota
// ============================================================

import React, { useEffect, useState } from "react";

/*
 Props que recibe el componente:

 - onPetCreated       → función para recargar mascotas después de CREAR
 - usuarios           → lista de usuarios (dueños)
 - mascotaEnEdicion   → objeto mascota (o null) cuando estamos editando
 - onEditFinished     → se llama cuando se termina de EDITAR correctamente
 - onCancelEdit       → cancelar edición para volver al modo "crear"
*/
function FormularioMascota({
  onPetCreated,
  usuarios,
  mascotaEnEdicion,
  onEditFinished,
  onCancelEdit,
}) {
  // ==========================================================
  // 1️⃣ ESTADO LOCAL DEL FORMULARIO
  // ==========================================================

  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
    condicion: "",
    id_usuario: "",
  });

  // Si existe mascotaEnEdicion → estamos en modo EDITAR
  const modoEdicion = !!mascotaEnEdicion;

  // ==========================================================
  // 2️⃣ EFECTO: CUANDO CAMBIA mascotaEnEdicion
  // ==========================================================
  useEffect(() => {
    if (mascotaEnEdicion) {
      // Llenar el formulario con los datos existentes
      setFormData({
        nombre: mascotaEnEdicion.nombre || "",
        especie: mascotaEnEdicion.especie || "",
        raza: mascotaEnEdicion.raza || "",
        edad:
          mascotaEnEdicion.edad !== null &&
          mascotaEnEdicion.edad !== undefined
            ? String(mascotaEnEdicion.edad)
            : "",
        peso:
          mascotaEnEdicion.peso !== null &&
          mascotaEnEdicion.peso !== undefined
            ? String(mascotaEnEdicion.peso)
            : "",
        condicion: mascotaEnEdicion.condicion || "",
        id_usuario: mascotaEnEdicion.id_usuario
          ? String(mascotaEnEdicion.id_usuario)
          : "",
      });
    } else {
      // Si no se está editando → formulario vacío
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
        condicion: "",
        id_usuario: "",
      });
    }
  }, [mascotaEnEdicion]);

  // ==========================================================
  // 3️⃣ MANEJO DE CAMBIOS EN LOS INPUTS
  // ==========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // 4️⃣ ENVIAR FORMULARIO: CREAR o EDITAR MASCOTA
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.especie) {
      alert("Nombre y especie son obligatorios");
      return;
    }
    if (!formData.id_usuario) {
      alert("Debes seleccionar un usuario (dueño)");
      return;
    }

    // Preparamos los datos que se enviarán al backend
    const payload = {
      nombre: formData.nombre,
      especie: formData.especie,
      raza: formData.raza || null,
      edad: formData.edad ? Number(formData.edad) : null,
      peso: formData.peso ? Number(formData.peso) : null,
      condicion: formData.condicion || null,
      id_usuario: Number(formData.id_usuario),
    };

    try {
      let url = "http://localhost:4000/mascotas";
      let method = "POST";

      // Si estamos editando → usar PUT
      if (modoEdicion && mascotaEnEdicion?.id_mascota) {
        url = `http://localhost:4000/mascotas/${mascotaEnEdicion.id_mascota}`;
        method = "PUT";
      }

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const msg = await resp.text();
        alert("Error al guardar la mascota:\n" + msg);
        return;
      }

      // Si llegamos aquí → todo salió bien
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
        condicion: "",
        id_usuario: "",
      });

      if (modoEdicion) {
        if (onEditFinished) onEditFinished();
        alert("🐾 Mascota actualizada correctamente");
      } else {
        if (onPetCreated) onPetCreated();
        alert("🐾 Mascota registrada correctamente");
      }
    } catch (error) {
      console.error("Error al guardar mascota:", error);
      alert("Error de conexión con el servidor");
    }
  };

  // ==========================================================
  // 5️⃣ RENDER DEL FORMULARIO (estructura semántica)
  // ==========================================================
  return (
    <section className="card">
      {/* Encabezado */}
      <header>
        <h2>{modoEdicion ? "Editar Mascota" : "Registrar Mascota"}</h2>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-row">
          <label htmlFor="nom">Nombre de la mascota</label>
          <input
            id="nom"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Especie */}
        <div className="form-row">
          <label htmlFor="esp">Especie</label>
          <input
            id="esp"
            name="especie"
            type="text"
            placeholder="Perro, gato..."
            value={formData.especie}
            onChange={handleChange}
            required
          />
        </div>

        {/* Raza */}
        <div className="form-row">
          <label htmlFor="raza">Raza</label>
          <input
            id="raza"
            name="raza"
            type="text"
            value={formData.raza}
            onChange={handleChange}
          />
        </div>

        {/* Edad */}
        <div className="form-row">
          <label htmlFor="edad">Edad</label>
          <input
            id="edad"
            name="edad"
            type="number"
            min="0"
            value={formData.edad}
            onChange={handleChange}
          />
        </div>

        {/* Peso */}
        <div className="form-row">
          <label htmlFor="peso">Peso (kg)</label>
          <input
            id="peso"
            name="peso"
            type="number"
            step="0.1"
            value={formData.peso}
            onChange={handleChange}
          />
        </div>

        {/* Condición */}
        <div className="form-row">
          <label htmlFor="cond">Condición de salud</label>
          <input
            id="cond"
            name="condicion"
            type="text"
            placeholder="Sano, alérgico..."
            value={formData.condicion}
            onChange={handleChange}
          />
        </div>

        {/* Dueño */}
        <div className="form-row">
          <label htmlFor="dueno">Usuario (dueño)</label>
          <select
            id="dueno"
            name="id_usuario"
            value={formData.id_usuario}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un usuario...</option>

            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.id_usuario} – {u.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="form-row" style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" type="submit">
            {modoEdicion ? "Actualizar Mascota" : "Guardar Mascota"}
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

export default FormularioMascota;