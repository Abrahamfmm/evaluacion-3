import { useState, useEffect } from "react";

function App() {
  // Estado inicial cargado desde localStorage para guardar la lista de estudiantes
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado para los datos del formulario
  const [form, setForm] = useState({ name: "", lastName: "", subject: "", grade: "" });

  // Estado para manejar si se está editando un estudiante
  const [editIndex, setEditIndex] = useState(null);

  // Guardar automáticamente en localStorage cuando cambia la lista de estudiantes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Manejo del cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // No permitir números en nombre, apellido y asignatura
    if (["name", "lastName", "subject"].includes(name)) {
      if (/\d/.test(value)) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, lastName, subject, grade } = form;
    const parsedGrade = parseFloat(grade);

    // Validación de campos vacíos o nota fuera de rango
    if (!name || !lastName || !subject || isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 7) {
      alert("Por favor completa todos los campos con datos válidos.");
      return;
    }

    const newStudent = { name, lastName, subject, grade: parsedGrade };

    // Si se está editando, actualiza ese estudiante; si no, agrega uno nuevo
    const updatedStudents = editIndex !== null
      ? students.map((s, i) => (i === editIndex ? newStudent : s))
      : [...students, newStudent];

    setStudents(updatedStudents);
    setForm({ name: "", lastName: "", subject: "", grade: "" });
    setEditIndex(null);
  };

  // Cargar datos de un estudiante al formulario para editar
  const handleEdit = (index) => {
    const student = students[index];
    setForm(student);
    setEditIndex(index);
  };

  // Eliminar un estudiante de la lista
  const handleDelete = (index) => {
    if (confirm("¿Estás seguro de eliminar este estudiante?")) {
      const updated = [...students];
      updated.splice(index, 1);
      setStudents(updated);
    }
  };

  // Calcular el promedio general de las notas
  const average = students.length
    ? (students.reduce((acc, s) => acc + s.grade, 0) / students.length).toFixed(2)
    : "N/A";

  // Determinar la escala de apreciación según la nota
  const getApreciacion = (grade) => {
    if (grade >= 6.5) return "destacado";
    if (grade >= 5.6) return "buen trabajo";
    if (grade >= 4.0) return "con mejora";
    return "deficiente";
  };

  // Estadísticas generales de los estudiantes
  const stats = {
    total: students.length,
    mustTakeExam: students.filter((s) => s.grade < 5).length,
    exempted: students.filter((s) => s.grade >= 5).length,
  };

  // Renderización del componente principal
  return (
    <div className="app">
      <h2>Notas Asignatura Front-End</h2>

      {/* Promedio general del curso */}
      <div id="average">Promedio general del curso: {average}</div>

      {/* Estadísticas */}
      <div id="stats">
        <p>Total de estudiantes: {stats.total}</p>
        <p>Estudiantes que deben rendir examen: {stats.mustTakeExam}</p>
        <p>Estudiantes eximidos: {stats.exempted}</p>
      </div>

      {/* Formulario para agregar o editar estudiantes */}
      <form onSubmit={handleSubmit} id="studentForm">
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Asignatura:</label>
          <input type="text" name="subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div>
          <label>Nota:</label>
          <input type="number" name="grade" step="0.1" min="1" max="7" value={form.grade} onChange={handleChange} required />
        </div>
        <button type="submit">{editIndex !== null ? "Actualizar" : "Guardar"}</button>
      </form>

      {/* Tabla de estudiantes */}
      <table id="studentTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Asignatura</th>
            <th>Nota</th>
            <th>Escala de Apreciación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            // Mensaje si no hay estudiantes aún
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                Aún no hay alumnos agregados.
              </td>
            </tr>
          ) : (
            // Renderizar la lista de estudiantes
            students.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.lastName}</td>
                <td>{s.subject}</td>
                <td>{s.grade.toFixed(1)}</td>
                <td>{getApreciacion(s.grade)}</td>
                <td>
                  <button onClick={() => handleEdit(i)}>Editar</button>
                  <button onClick={() => handleDelete(i)}>Eliminar</button>
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


