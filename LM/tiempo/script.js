document.addEventListener('DOMContentLoaded', function() {
    cargarProvincias();
});

function cargarProvincias() {
// Realizar una solicitud fetch para obtener los datos de las provincias
fetch('https://www.el-tiempo.net/api/json/v2/provincias')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor.');
        }
        return response.json();
    })
    .then(data => {
        // Extraer los nombres de las provincias del JSON
        const provincias = data.provincias.map(provincia => ({ nombre: provincia.NOMBRE_PROVINCIA, codigo: provincia.CODPROV }));

         // Obtener el select del DOM
        const selectProvincia = document.getElementById('provincia');

        // Crear opciones para cada provincia y agregarlas al select
        provincias.forEach(provincia => {
            const option = document.createElement('option');
            option.value = provincia.codigo;
            option.textContent = provincia.nombre;
            selectProvincia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
}

document.getElementById('provincia').addEventListener('change', function() {
    var codigoProvincia = this.value;
    
    // Ocultar el formulario de ciudades y los datos de tiempo
    document.getElementById('ciudadForm').style.display = 'block';
    document.getElementById('tiempoDatos').style.display = 'none';
    
    // Si se selecciona una provincia válida, cargar las ciudades correspondientes
    if (codigoProvincia) {
        cargarCiudades(codigoProvincia);
    }
});

function cargarCiudades(codigoProvincia) {
    //TIENES QUE BORRAR EL CONTENIDO DEL COMBO ANTES DE CARGAR NADA
    var selectCiudad = document.getElementById('ciudad');
    selectCiudad.innerHTML = '';
    // Realizar una solicitud fetch para obtener los datos de las ciudades de la provincia seleccionada
    fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${codigoProvincia}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor.');
        }
        return response.json();
    })
    .then(data => {
        // Extraer los nombres de las ciudades del JSON
        const ciudades = data.ciudades.map(ciudad => ({ nombre: ciudad.name, codigo: ciudad.id }));

         // Obtener el select del DOM
        const selectCiudad = document.getElementById('ciudad');

        // Crear opciones para cada ciudad y agregarlas al select
        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad.codigo;
            option.textContent = ciudad.nombre;
            selectCiudad.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

    
}

document.getElementById('ciudad').addEventListener('change', function() {
    var ciudadSeleccionada = this.value;
    
    // Si se selecciona una ciudad válida, mostrar los datos de tiempo y temperatura
    if (ciudadSeleccionada) {
        mostrarTiempoTemperatura(ciudadSeleccionada);
    }
});

function mostrarTiempoTemperatura(ciudadSeleccionada) {
    // Realizar una solicitud fetch para obtener los datos de tiempo y temperatura de la ciudad seleccionada
    fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${document.getElementById('provincia').value}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la respuesta del servidor.');
            }
            return response.json();
        })
        .then(data => {
            // Encontrar la ciudad seleccionada en los datos
            
            var ciudad = data.ciudades.find(c => c.id === ciudadSeleccionada);

            if (!ciudad) {
                throw new Error('No se encontraron datos para la ciudad seleccionada.');
            }
            
            // Mostrar los datos de tiempo y temperatura en la página
            document.getElementById('tiempoActual').textContent = ciudad.stateSky.description;
            document.getElementById('temperaturamax').textContent = ciudad.temperatures.max + '°C';
            document.getElementById('temperaturamin').textContent = ciudad.temperatures.min + '°C'
            document.getElementById('tiempoDatos').style.display = 'block';
        })
        .catch(error => {
            // En caso de error, mostrar un mensaje
            console.error('Error al obtener los datos:', error);
            alert('Error al cargar los datos de tiempo y temperatura.');
        });
}
