// Array para almacenar los trabajadores registrados
let trabajadores = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Recuperar datos guardados en localStorage (si existen)
  const trabajadoresGuardados = localStorage.getItem('trabajadores');
  if (trabajadoresGuardados) {
    trabajadores = JSON.parse(trabajadoresGuardados);
  }
  
  // Inicializar el modal
  const modalBusqueda = new bootstrap.Modal(document.getElementById('modalBusqueda'));
  
  // Eventos
  document.getElementById('formTrabajador').addEventListener('submit', registrarTrabajador);
  document.getElementById('btnAbrirBusqueda').addEventListener('click', function() {
    actualizarTablaTrabajadores(); // Actualizar tabla antes de abrir
    modalBusqueda.show();
  });
  document.getElementById('btnBuscar').addEventListener('click', buscarTrabajadores);
  document.getElementById('buscarTrabajador').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') buscarTrabajadores();
  });
  document.getElementById('ordenarPor').addEventListener('change', ordenarTrabajadores);
  document.getElementById('limpiarFiltros').addEventListener('click', limpiarFiltros);
  
  // Evento para cuando se abre el modal
  document.getElementById('modalBusqueda').addEventListener('shown.bs.modal', function () {
    document.getElementById('buscarTrabajador').focus();
  });
});

// Función para registrar un nuevo trabajador
function registrarTrabajador(e) {
  e.preventDefault();
  
  // Obtener valores del formulario
  const nombre = document.getElementById('nombreTrabajador').value;
  const fecha = document.getElementById('fechaIngreso').value;
  const tarea = document.getElementById('tarea').value;
  const tareaTexto = document.getElementById('tarea').options[document.getElementById('tarea').selectedIndex].text;
  const comentarios = document.getElementById('comentariosTrabajador').value;
  
  // Crear objeto de trabajador
  const trabajador = {
    id: Date.now(), // ID único basado en timestamp
    nombre: nombre,
    fecha: fecha,
    fechaFormateada: formatearFecha(fecha),
    tarea: tarea,
    tareaTexto: tareaTexto,
    comentarios: comentarios
  };
  
  // Añadir al array y guardar en localStorage
  trabajadores.push(trabajador);
  guardarEnLocalStorage();
  
  // Mostrar alerta de éxito
  const alertSuccess = document.getElementById('alertSuccess');
  alertSuccess.style.display = 'flex';
  
  // Ocultar alerta después de 3 segundos
  setTimeout(function() {
    alertSuccess.style.display = 'none';
  }, 3000);
  
  // Limpiar formulario
  e.target.reset();
}

// Función para limpiar el formulario
function limpiarFormulario() {
  document.getElementById('formTrabajador').reset();
}

// Función para formatear la fecha en formato legible
function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
  return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
}

// Función para actualizar la tabla de trabajadores
function actualizarTablaTrabajadores(trabajadoresFiltrados = null) {
  const tablaTrabajadores = document.getElementById('tablaTrabajadores');
  const sinResultados = document.getElementById('sinResultados');
  tablaTrabajadores.innerHTML = '';
  
  // Si hay trabajadores filtrados, los usamos, si no, todos los trabajadores
  const listaAMostrar = trabajadoresFiltrados || trabajadores;
  
  // Si no hay resultados, mostrar mensaje
  if (listaAMostrar.length === 0) {
    sinResultados.style.display = 'block';
    return;
  }
  
  // Ocultar mensaje de sin resultados
  sinResultados.style.display = 'none';
  
  // Crear filas de la tabla
  listaAMostrar.forEach(trabajador => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${trabajador.nombre}</td>
      <td>${trabajador.fechaFormateada}</td>
      <td>${trabajador.tareaTexto}</td>
      <td>${trabajador.comentarios || '-'}</td>
    `;
    tablaTrabajadores.appendChild(fila);
  });
}

// Función para buscar trabajadores
function buscarTrabajadores() {
  const terminoBusqueda = document.getElementById('buscarTrabajador').value.toLowerCase();
  const filtroFecha = document.getElementById('filtroFecha').value;
  
  // Filtrar por nombre y fecha si se proporcionan
  const trabajadoresFiltrados = trabajadores.filter(trabajador => {
    const coincideNombre = trabajador.nombre.toLowerCase().includes(terminoBusqueda);
    const coincideFecha = filtroFecha ? trabajador.fecha === filtroFecha : true;
    return coincideNombre && coincideFecha;
  });
  
  // Actualizar la tabla con los resultados
  actualizarTablaTrabajadores(trabajadoresFiltrados);
}

// Función para ordenar trabajadores
function ordenarTrabajadores() {
  const criterio = document.getElementById('ordenarPor').value;
  let trabajadoresOrdenados = [...trabajadores]; // Crear copia para no modificar el original
  
  switch (criterio) {
    case 'nombre':
      trabajadoresOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'fecha':
      trabajadoresOrdenados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Más reciente primero
      break;
    case 'fechaAntigua':
      trabajadoresOrdenados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Más antigua primero
      break;
    case 'tarea':
      trabajadoresOrdenados.sort((a, b) => a.tareaTexto.localeCompare(b.tareaTexto));
      break;
  }
  
  // Actualizar la tabla con los resultados ordenados
  actualizarTablaTrabajadores(trabajadoresOrdenados);
}

// Función para limpiar filtros
function limpiarFiltros() {
  document.getElementById('buscarTrabajador').value = '';
  document.getElementById('filtroFecha').value = '';
  document.getElementById('ordenarPor').selectedIndex = 0;
  
  // Mostrar todos los trabajadores
  actualizarTablaTrabajadores();
}