// src/App.js
// ----------------------------------------------
// App principal de PetCare Tracker
// ----------------------------------------------
// - Muestra una pantalla de bienvenida (HOME)
// - Maneja el registro de usuarios
// - Maneja el registro de mascotas
// - Muestra historiales de usuarios y mascotas
// ----------------------------------------------

import React, { useEffect, useState } from "react";
import "./App.css";

// URL base del backend (Express + MySQL)
const API_URL = "http://localhost:4000";

function App() {
  /* =====================================================
   *  ESTADO GENERAL DE LA APLICACIÓN
   * ===================================================== */

  // vistaActual controla qué "pantalla" se ve en el front
  // Puede ser: "home", "registroUsuario", "registroMascota",
  // "historialUsuarios", "historialMascotas".
  const [vistaActual, setVistaActual] = useState("home");

  // Listas traídas desde el backend
  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  // Formularios controlados
  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  const [formMascota, setFormMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
    condicion: "",
    id_usuario: "",
  });

  // Flag de carga para mostrar "Cargando..." en tablas
  const [cargando, setCargando] = useState(false);

  /* =====================================================
   *  EFECTO INICIAL: CARGAR DATOS AL ENTRAR
   * ===================================================== */

  // useEffect sin dependencias ⇒ se ejecuta una vez al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarMascotas();
  }, []);

  // Traer usuarios desde el backend
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const resp = await fetch(`${API_URL}/usuarios`);
      const data = await resp.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  // Traer mascotas desde el backend
  const cargarMascotas = async () => {
    try {
      setCargando(true);
      const resp = await fetch(`${API_URL}/mascotas`);
      const data = await resp.json();
      setMascotas(data);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
      alert("No se pudieron cargar las mascotas");
    } finally {
      setCargando(false);
    }
  };

  /* =====================================================
   *  MANEJO DE FORMULARIO: USUARIOS
   * ===================================================== */

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    // Actualizamos solo el campo que cambió
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formUsuario.nombre || !formUsuario.correo) {
      alert("Por favor llena al menos nombre y correo del usuario.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUsuario),
      });

      if (!resp.ok) throw new Error("Error en el servidor");

      // Limpiamos el formulario
      setFormUsuario({ nombre: "", correo: "", telefono: "" });

      // Recargamos la lista
      await cargarUsuarios();
      alert("✅ Usuario registrado correctamente");
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Ocurrió un error al registrar el usuario");
    }
  };

  const handleEliminarUsuario = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este usuario?"
    );
    if (!confirmar) return;

    try {
      const resp = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Error al eliminar");

      await cargarUsuarios();
      alert("Usuario eliminado");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Ocurrió un error al eliminar el usuario");
    }
  };

  // Edición rápida de usuario usando window.prompt (simple, estilo estudiante)
  const handleEditarUsuario = async (usuario) => {
    const nuevoNombre = window.prompt("Nombre:", usuario.nombre);
    if (nuevoNombre === null) return; // canceló

    const nuevoCorreo = window.prompt("Correo:", usuario.correo);
    if (nuevoCorreo === null) return;

    const nuevoTelefono = window.prompt("Teléfono:", usuario.telefono || "");
    if (nuevoTelefono === null) return;

    const datosActualizados = {
      nombre: nuevoNombre,
      correo: nuevoCorreo,
      telefono: nuevoTelefono,
    };

    try {
      const resp = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (!resp.ok) throw new Error("Error al actualizar");
      await cargarUsuarios();
      alert("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Ocurrió un error al actualizar el usuario");
    }
  };

  /* =====================================================
   *  MANEJO DE FORMULARIO: MASCOTAS
   * ===================================================== */

  const handleChangeMascota = (e) => {
    const { name, value } = e.target;
    setFormMascota((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMascota = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formMascota.nombre || !formMascota.especie || !formMascota.id_usuario) {
      alert("Por favor llena al menos nombre, especie y dueño de la mascota.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/mascotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formMascota),
      });

      if (!resp.ok) throw new Error("Error en el servidor");

      // Limpiamos el formulario
      setFormMascota({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
        condicion: "",
        id_usuario: "",
      });

      await cargarMascotas();
      alert("✅ Mascota registrada correctamente");
    } catch (error) {
      console.error("Error guardando mascota:", error);
      alert("Ocurrió un error al registrar la mascota");
    }
  };

  const handleEliminarMascota = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta mascota?"
    );
    if (!confirmar) return;

    try {
      const resp = await fetch(`${API_URL}/mascotas/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Error al eliminar");

      await cargarMascotas();
      alert("Mascota eliminada");
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      alert("Ocurrió un error al eliminar la mascota");
    }
  };

  const handleEditarMascota = () => {
    // Se deja la edición avanzada para más adelante
    alert("La edición de la mascota la podemos agregar luego 😊");
  };

  // Muestra un resumen de la mascota en un alert
  const handleDetallesMascota = (mascota) => {
    const dueno = usuarios.find((u) => u.id_usuario === mascota.id_usuario);
    const nombreDueno = dueno ? dueno.nombre : "Sin dueño asignado";

    const msg = `
Mascota: ${mascota.nombre}
Especie: ${mascota.especie}
Raza: ${mascota.raza || "-"}
Edad: ${mascota.edad || "-"}
Peso: ${mascota.peso || "-"} kg
Salud: ${mascota.condicion || "-"}
Dueño: ${nombreDueno}
    `;
    alert(msg);
  };

  /* =====================================================
   *  VISTAS / SECCIONES RENDERIZADAS
   * ===================================================== */

  // ----------- VISTA HOME (pantalla de bienvenida) ----------
  const renderHome = () => (
    // section semántico para agrupar el hero / pantalla principal
    <section
      className="hero-layout"
      aria-labelledby="home-title"
    >
      {/* Columna izquierda: texto de bienvenida + menú principal */}
      <section aria-label="Introducción a PetCare Tracker">
        <h2 id="home-title" className="hero-titulo">
          Bienvenido a PetCare Tracker
        </h2>
        <p className="hero-subtitulo">
          Tu asistente para el bienestar de tu mascota. Registra dueños,
          mascotas y consulta historiales de forma sencilla.
        </p>

        {/* nav semántico: menú de accesos rápidos */}
        <nav className="menu-grid" aria-label="Accesos rápidos">
          <button
            className="menu-card-btn"
            onClick={() => setVistaActual("registroUsuario")}
          >
            <span className="menu-emoji">👤</span>
            <div className="menu-texto">
              <span className="menu-titulo">Registro Cliente</span>
              <span className="menu-desc">
                Crea y administra los dueños de las mascotas.
              </span>
            </div>
          </button>

          <button
            className="menu-card-btn"
            onClick={() => setVistaActual("registroMascota")}
          >
            <span className="menu-emoji">🐾</span>
            <div className="menu-texto">
              <span className="menu-titulo">Registro Mascota</span>
              <span className="menu-desc">
                Registra nuevas mascotas y vincúlalas con sus dueños.
              </span>
            </div>
          </button>

          <button
            className="menu-card-btn"
            onClick={() => setVistaActual("historialUsuarios")}
          >
            <span className="menu-emoji">📂</span>
            <div className="menu-texto">
              <span className="menu-titulo">Historial Clientes</span>
              <span className="menu-desc">
                Consulta los usuarios registrados en el sistema.
              </span>
            </div>
          </button>

          <button
            className="menu-card-btn"
            onClick={() => setVistaActual("historialMascotas")}
          >
            <span className="menu-emoji">📋</span>
            <div className="menu-texto">
              <span className="menu-titulo">Historial Mascotas</span>
              <span className="menu-desc">
                Revisa las mascotas registradas y sus datos.
              </span>
            </div>
          </button>
        </nav>
      </section>

      {/* Columna derecha: figura con imagen y texto */}
      <figure
        className="hero-media-wrapper"
        aria-label="Mascotas felices"
      >
        {/* Imagen tomada desde /public */}
        <img
          src="/animales.jpg"
          alt="Grupo de mascotas felices: perros, gato, conejo y loro"
          className="hero-image"
        />
        <figcaption className="hero-media-overlay">
          <span className="hero-media-icon">🐾</span>
          <p className="hero-media-text">
            Cuidamos la información de tus mejores amigos.
          </p>
        </figcaption>
      </figure>
    </section>
  );

  // ----------- VISTA: REGISTRO DE USUARIOS ----------
  const renderRegistroUsuario = () => (
    // section que agrupa todo lo relacionado al registro de clientes
    <section aria-labelledby="titulo-registro-clientes">
      {/* Encabezado de la vista */}
      <header className="top-bar">
        <div className="vista-titulo-seccion">
          <h2 id="titulo-registro-clientes">Registro de Clientes</h2>
          <p>Agrega nuevos dueños de mascotas al sistema.</p>
        </div>

        <button
          className="btn-volver-home"
          onClick={() => setVistaActual("home")}
        >
          ← Volver al inicio
        </button>
      </header>

      {/* article para el formulario de registro */}
      <article
        className="card"
        aria-label="Formulario de registro de clientes"
      >
        <h3 className="bloque-titulo">Datos del cliente</h3>
        <p className="bloque-descripcion">
          Completa la información básica del dueño de la mascota.
        </p>

        <form onSubmit={handleSubmitUsuario}>
          <div>
            <label htmlFor="nombre-usuario">Nombre completo</label>
            <input
              id="nombre-usuario"
              type="text"
              name="nombre"
              value={formUsuario.nombre}
              onChange={handleChangeUsuario}
              placeholder="Ej: Camilo Vélez"
            />
          </div>

          <div>
            <label htmlFor="correo-usuario">Correo electrónico</label>
            <input
              id="correo-usuario"
              type="email"
              name="correo"
              value={formUsuario.correo}
              onChange={handleChangeUsuario}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label htmlFor="telefono-usuario">Teléfono</label>
            <input
              id="telefono-usuario"
              type="text"
              name="telefono"
              value={formUsuario.telefono}
              onChange={handleChangeUsuario}
              placeholder="Ej: 3001234567"
            />
          </div>

          <button type="submit" className="btn-primary">
            Guardar Usuario
          </button>
        </form>
      </article>

      {/* article para la tabla de usuarios registrados */}
      <article
        className="card"
        aria-label="Lista de usuarios registrados"
      >
        <h3 className="bloque-titulo">Usuarios registrados</h3>
        <p className="bloque-descripcion">
          Lista de todos los dueños registrados en PetCare Tracker.
        </p>

        {cargando && <p>Cargando...</p>}

        {!cargando && usuarios.length === 0 && (
          <p>No hay usuarios registrados aún.</p>
        )}

        {!cargando && usuarios.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditarUsuario(u)}
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn-danger"
                      onClick={() => handleEliminarUsuario(u.id_usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </section>
  );

  // ----------- VISTA: REGISTRO DE MASCOTAS ----------
  const renderRegistroMascota = () => (
    <section aria-labelledby="titulo-registro-mascotas">
      <header className="top-bar">
        <div className="vista-titulo-seccion">
          <h2 id="titulo-registro-mascotas">Registro de Mascotas</h2>
          <p>
            Registra mascotas y asígnalas a sus dueños para llevar un control
            básico.
          </p>
        </div>

        <button
          className="btn-volver-home"
          onClick={() => setVistaActual("home")}
        >
          ← Volver al inicio
        </button>
      </header>

      <article
        className="card"
        aria-label="Formulario de registro de mascotas"
      >
        <h3 className="bloque-titulo">Datos de la mascota</h3>
        <p className="bloque-descripcion">
          Completa la información de la mascota que deseas registrar.
        </p>

        <form onSubmit={handleSubmitMascota}>
          <div>
            <label htmlFor="nombre-mascota">Nombre de la mascota</label>
            <input
              id="nombre-mascota"
              type="text"
              name="nombre"
              value={formMascota.nombre}
              onChange={handleChangeMascota}
              placeholder="Ej: Violeta"
            />
          </div>

          <div>
            <label htmlFor="especie-mascota">Especie</label>
            <input
              id="especie-mascota"
              type="text"
              name="especie"
              value={formMascota.especie}
              onChange={handleChangeMascota}
              placeholder="Perro, gato..."
            />
          </div>

          <div>
            <label htmlFor="raza-mascota">Raza</label>
            <input
              id="raza-mascota"
              type="text"
              name="raza"
              value={formMascota.raza}
              onChange={handleChangeMascota}
              placeholder="Ej: Labrador"
            />
          </div>

          <div>
            <label htmlFor="edad-mascota">Edad (años)</label>
            <input
              id="edad-mascota"
              type="number"
              name="edad"
              value={formMascota.edad}
              onChange={handleChangeMascota}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="peso-mascota">Peso (kg)</label>
            <input
              id="peso-mascota"
              type="number"
              name="peso"
              value={formMascota.peso}
              onChange={handleChangeMascota}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="condicion-mascota">Condición de salud</label>
            <input
              id="condicion-mascota"
              type="text"
              name="condicion"
              value={formMascota.condicion}
              onChange={handleChangeMascota}
              placeholder="Sano, alérgico..."
            />
          </div>

          <div>
            <label htmlFor="dueno-mascota">ID del Usuario (dueño)</label>
            <select
              id="dueno-mascota"
              name="id_usuario"
              value={formMascota.id_usuario}
              onChange={handleChangeMascota}
            >
              <option value="">Selecciona un usuario...</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.id_usuario} — {u.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Guardar Mascota
          </button>
        </form>
      </article>

      <article
        className="card"
        aria-label="Lista de mascotas registradas"
      >
        <h3 className="bloque-titulo">Mascotas registradas</h3>
        <p className="bloque-descripcion">
          Aquí puedes ver las mascotas que ya están registradas en el sistema.
        </p>

        {cargando && <p>Cargando...</p>}

        {!cargando && mascotas.length === 0 && (
          <p>No hay mascotas registradas aún.</p>
        )}

        {!cargando && mascotas.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Especie</th>
                <th scope="col">Raza</th>
                <th scope="col">Edad</th>
                <th scope="col">Peso</th>
                <th scope="col">Condición</th>
                <th scope="col">ID Usuario</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((m) => (
                <tr key={m.id_mascota}>
                  <td>{m.id_mascota}</td>
                  <td>{m.nombre}</td>
                  <td>{m.especie}</td>
                  <td>{m.raza}</td>
                  <td>{m.edad}</td>
                  <td>{m.peso}</td>
                  <td>{m.condicion}</td>
                  <td>{m.id_usuario}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditarMascota(m)}
                    >
                      Editar
                    </button>{" "}
                    <button
                      className="btn-danger"
                      onClick={() => handleEliminarMascota(m.id_mascota)}
                    >
                      Eliminar
                    </button>{" "}
                    <button
                      className="btn-secondary"
                      onClick={() => handleDetallesMascota(m)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </section>
  );

  // ----------- VISTA: HISTORIAL DE USUARIOS ----------
  const renderHistorialUsuarios = () => (
    <section aria-labelledby="titulo-historial-usuarios">
      <header className="top-bar">
        <div className="vista-titulo-seccion">
          <h2 id="titulo-historial-usuarios">Historial de Clientes</h2>
          <p>Consulta todos los usuarios registrados en el sistema.</p>
        </div>
        <button
          className="btn-volver-home"
          onClick={() => setVistaActual("home")}
        >
          ← Volver al inicio
        </button>
      </header>

      <article className="card" aria-label="Tabla de usuarios registrados">
        <h3 className="bloque-titulo">Usuarios registrados</h3>

        {cargando && <p>Cargando...</p>}
        {!cargando && usuarios.length === 0 && (
          <p>No hay usuarios registrados.</p>
        )}
        {!cargando && usuarios.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </section>
  );

  // ----------- VISTA: HISTORIAL DE MASCOTAS ----------
  const renderHistorialMascotas = () => (
    <section aria-labelledby="titulo-historial-mascotas">
      <header className="top-bar">
        <div className="vista-titulo-seccion">
          <h2 id="titulo-historial-mascotas">Historial de Mascotas</h2>
          <p>
            Revisa las mascotas registradas y su información básica de salud.
          </p>
        </div>
        <button
          className="btn-volver-home"
          onClick={() => setVistaActual("home")}
        >
          ← Volver al inicio
        </button>
      </header>

      <article className="card" aria-label="Tabla de mascotas registradas">
        <h3 className="bloque-titulo">Mascotas registradas</h3>

        {cargando && <p>Cargando...</p>}
        {!cargando && mascotas.length === 0 && (
          <p>No hay mascotas registradas.</p>
        )}
        {!cargando && mascotas.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Especie</th>
                <th scope="col">Raza</th>
                <th scope="col">Edad</th>
                <th scope="col">Peso</th>
                <th scope="col">Condición</th>
                <th scope="col">Dueño</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((m) => {
                const dueno = usuarios.find(
                  (u) => u.id_usuario === m.id_usuario
                );
                return (
                  <tr key={m.id_mascota}>
                    <td>{m.id_mascota}</td>
                    <td>{m.nombre}</td>
                    <td>{m.especie}</td>
                    <td>{m.raza}</td>
                    <td>{m.edad}</td>
                    <td>{m.peso}</td>
                    <td>{m.condicion}</td>
                    <td>{dueno ? dueno.nombre : "Sin dueño"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </article>
    </section>
  );

  /* =====================================================
   *  FUNCIÓN QUE DECIDE QUÉ VISTA MOSTRAR
   * ===================================================== */
  const renderContenido = () => {
    switch (vistaActual) {
      case "registroUsuario":
        return renderRegistroUsuario();
      case "registroMascota":
        return renderRegistroMascota();
      case "historialUsuarios":
        return renderHistorialUsuarios();
      case "historialMascotas":
        return renderHistorialMascotas();
      default:
        return renderHome();
    }
  };

  /* =====================================================
   *  RENDER PRINCIPAL DEL COMPONENTE
   * ===================================================== */
  return (
    // main semántico: contenido principal de la página
    <main className="app-container">
      {/* Encabezado global (título + slogan) */}
      <header>
        <h1 className="titulo-app">PetCare Tracker</h1>
        <p className="subtitulo">Registro sencillo de mascotas y sus dueños</p>
      </header>

      {/* Aquí se inserta la vista seleccionada */}
      {renderContenido()}
    </main>
  );
}

export default App;