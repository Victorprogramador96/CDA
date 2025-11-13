const form = document.getElementById('formCita');
const lista = document.getElementById('listaCitas');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnCancelar = document.getElementById('btnCancelar');

// Genera un ID único
function uid() {
  return 'c-' + Date.now().toString(36).slice(-6);
}

// Leer y guardar en localStorage
function obtenerCitas() {
  const raw = localStorage.getItem('citas_cda_demo');
  return raw ? JSON.parse(raw) : [];
}
function guardarCitas(arr) {
  localStorage.setItem('citas_cda_demo', JSON.stringify(arr));
}

// Renderiza la lista
function render() {
  const datos = obtenerCitas();
  lista.innerHTML = '';
  if (!datos.length) {
    lista.innerHTML = '<div class="empty">No hay citas registradas</div>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'citas';
  datos.forEach(c => {
    const li = document.createElement('li');
    li.className = 'cita';
    li.innerHTML = `
      <div>
        <div style="font-weight:700">${escapeHtml(c.propietario)} — <span style="color:#555">${escapeHtml(c.placa)}</span></div>
        <div class="meta">${escapeHtml(c.fecha)} · ${escapeHtml(c.hora)} · ${escapeHtml(c.marca || '')}</div>
      </div>
      <div class="actions">
        <button class="edit" data-id="${c.id}">Editar</button>
        <button class="del" data-id="${c.id}">Eliminar</button>
      </div>
    `;
    ul.appendChild(li);
  });
  lista.appendChild(ul);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Reinicia el formulario
function resetForm() {
  form.reset();
  document.getElementById('idCita').value = '';
  document.getElementById('btnEnviar').textContent = 'Guardar cita';
}

// Guardar/editar cita
form.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('idCita').value || uid();
  const nueva = {
    id,
    propietario: document.getElementById('propietario').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    placa: document.getElementById('placa').value.trim(),
    marca: document.getElementById('marca').value.trim(),
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    observaciones: document.getElementById('observaciones').value.trim()
  };

  if (!nueva.propietario || !nueva.placa || !nueva.fecha || !nueva.hora) {
    alert('Por favor complete los campos obligatorios.');
    return;
  }

  let arr = obtenerCitas();
  const existe = arr.findIndex(x => x.id === id);
  if (existe >= 0) arr[existe] = nueva;
  else arr.push(nueva);

  guardarCitas(arr);
  render();
  resetForm();
  alert('Cita guardada correctamente.');
});

// Editar o eliminar
lista.addEventListener('click', e => {
  if (e.target.matches('.del')) {
    const id = e.target.dataset.id;
    if (!confirm('¿Eliminar esta cita?')) return;
    let arr = obtenerCitas().filter(x => x.id !== id);
    guardarCitas(arr);
    render();
  } else if (e.target.matches('.edit')) {
    const id = e.target.dataset.id;
    const arr = obtenerCitas();
    const c = arr.find(x => x.id === id);
    if (!c) return;
    document.getElementById('idCita').value = c.id;
    document.getElementById('propietario').value = c.propietario;
    document.getElementById('telefono').value = c.telefono;
    document.getElementById('placa').value = c.placa;
    document.getElementById('marca').value = c.marca;
    document.getElementById('fecha').value = c.fecha;
    document.getElementById('hora').value = c.hora;
    document.getElementById('observaciones').value = c.observaciones;
    document.getElementById('btnEnviar').textContent = 'Actualizar cita';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

btnLimpiar.addEventListener('click', () => {
  if (!confirm('¿Eliminar todas las citas?')) return;
  localStorage.removeItem('citas_cda_demo');
  render();
});

btnCancelar.addEventListener('click', resetForm);

render();
