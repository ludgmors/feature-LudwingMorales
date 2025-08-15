import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const API_URL = "http://localhost:5194/api/alumnos";
  const API_KEY = "mi-api-key-123";

  const [alumno, setAlumno] = useState({
    nombre: "",
    fechaNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
    grado: "",
    seccion: "",
    fechaIngreso: ""
  });
  const [alumnos, setAlumnos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [gradoFiltro, setGradoFiltro] = useState("Todos");

  useEffect(() => {
    obtenerTodos();
  }, []);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", { timeZone: "UTC" });
  };

  const obtenerTodos = async () => {
    const res = await axios.get(API_URL, {
      headers: { "X-API-KEY": API_KEY }
    });
    setAlumnos(res.data);
  };

  const obtenerPorGrado = async (grado) => {
    if (grado === "Todos") {
      obtenerTodos();
      return;
    }
    const res = await axios.get(`${API_URL}/grado/${grado}`, {
      headers: { "X-API-KEY": API_KEY }
    });
    setAlumnos(res.data);
  };

  const handleChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await axios.put(`${API_URL}/${editandoId}`, alumno, {
        headers: { "X-API-KEY": API_KEY }
      });
      alert("Alumno actualizado");
      setEditandoId(null);
    } else {
      await axios.post(API_URL, alumno, {
        headers: { "X-API-KEY": API_KEY }
      });
      alert("Alumno agregado");
    }
    setAlumno({
      nombre: "",
      fechaNacimiento: "",
      nombrePadre: "",
      nombreMadre: "",
      grado: "",
      seccion: "",
      fechaIngreso: ""
    });
    obtenerTodos();
  };

  const eliminarAlumno = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este alumno?")) {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { "X-API-KEY": API_KEY }
      });
      obtenerTodos();
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4"> Gestión de Alumnos</h1>

      {/* Filtro por grado */}
      <div className="mb-3 d-flex justify-content-center">
        <select
          className="form-select w-auto"
          value={gradoFiltro}
          onChange={(e) => {
            setGradoFiltro(e.target.value);
            obtenerPorGrado(e.target.value);
          }}
        >
          <option value="Todos">Todos</option>
          <option value="1ro">1ro</option>
          <option value="2do">2do</option>
          <option value="3ro">3ro</option>
          <option value="4to">4to</option>
          <option value="5to">5to</option>
          <option value="6to">6to</option>
        </select>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          {Object.keys(alumno).map((campo) => (
            <div className="col-md-4" key={campo}>
              <input
                type={campo.toLowerCase().includes("fecha") ? "date" : "text"}
                className="form-control"
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                name={campo}
                value={alumno[campo]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3">
          {editandoId ? <FaEdit /> : <FaPlus />}{" "}
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Tabla */}
      <table className="table table-hover table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Fecha Nac.</th>
            <th>Padre</th>
            <th>Madre</th>
            <th>Grado</th>
            <th>Sección</th>
            <th>Fecha Ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No hay alumnos en este grado
              </td>
            </tr>
          ) : (
            alumnos.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{formatearFecha(a.fechaNacimiento)}</td>
                <td>{a.nombrePadre}</td>
                <td>{a.nombreMadre}</td>
                <td>{a.grado}</td>
                <td>{a.seccion}</td>
                <td>{formatearFecha(a.fechaIngreso)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setAlumno({
                        ...a,
                        fechaNacimiento: a.fechaNacimiento.split("T")[0],
                        fechaIngreso: a.fechaIngreso.split("T")[0]
                      });
                      setEditandoId(a.id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarAlumno(a.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;






