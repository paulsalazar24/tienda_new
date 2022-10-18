window.addEventListener('load', function(){
   
//CAMBIAR IMAGES DE LA TIENDA
    var imagenes = [];

    imagenes[0] = 'img/ra.png';
    imagenes[1] = 'img/val.jpg';
    imagenes[2] = 'img/esc.jpg';

    var indiceImagen = 0;

function cambiarImagen(){
    document.anime.src = imagenes[indiceImagen];

    if(indiceImagen < 2){
        indiceImagen++;
    }else{
        indiceImagen=0;
    }
}

//LLAMAMOS A LA FUNCION CAMBIAR IMAGEN CADA 1 SEGUNDO
setInterval(cambiarImagen, 2000);


//UBICACION DE LA TIENDA

var latitud = -12.04318;
var longitud =  -77.02824;
var map = L.map('map').setView([latitud, longitud], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([latitud, longitud]).addTo(map);




});




