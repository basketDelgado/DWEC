
class Vista{
    constructor(controlador){
        this.controlador = controlador;
        this.cuerpo = $(".container");
        this.mostrarMasDatos();
    }

    EventoBuscar(){
        var that = this;
        $("#titulo").keyup(function (event) {
            if(event.key == "Enter") {
                that.buscarPeliculas();
            }
        });
    }

    buscarPeliculas(){
        this.pagina = 1;
        $(".container").html("");
        this.titulo = $("#titulo").val();
        this.controlador.obtenerPeliculas(this.titulo,this.pagina,"http://www.omdbapi.com/?");
        this.pagina ++;
    }

    mostrarPelicula(pelicula){
        $(".container").append(pelicula);
    }

    mostrarMasDatos(){
        var that = this;
        var ventana = $(window);
        ventana.scroll(function () {
            if($(window).scrollTop() + $(window).height() == Vista.getDocHeight()) {
                that.controlador.obtenerPeliculas(that.titulo, that.pagina, "http://www.omdbapi.com/?");
                that.pagina++;
            }
        });
    }
    static getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }
}

class Controlador{
    constructor(){
        this.modelo = new Modelo(this);
        this.vista = new Vista(this);
        this.vista.EventoBuscar();
    }

    obtenerPeliculas(titulo,pagina,api){
        var that = this;
        $.getJSON(api,
            {s:titulo, page:pagina},
            function (data) {
                that.modelo.cargarDatosPeliculas(data);
        });
    }

    mostrarPelicula(pelicula){
        this.vista.mostrarPelicula(pelicula);
    }
}

class Modelo{
    constructor(controlador){
        this.controlador = controlador;
    }

    cargarDatosPeliculas(data){
        var that = this;
        $.each(data["Search"], function (index,item) {
            if (item.Poster == "N/A"){
                that.crearPelicula("no_photo.jpg", item.Title, item.Year);
            }else {
                that.crearPelicula(item.Poster, item.Title, item.Year);
            }
        });
    }

    crearPelicula(poster, title, year){
        var pelicula = document.createElement("div");
        $(pelicula).addClass("col-sm-5 card");
        var portada = document.createElement("img");
        $(portada).addClass("card-img-top").attr("src",poster);
        var descripcion = document.createElement("div");
        $(descripcion).addClass("card-block");
        var titulo = document.createElement("p");
        $(titulo).text(title);
        var año = document.createElement("p");
        $(año).text(year);
        $(descripcion).append(titulo,año);
        $(pelicula).append(portada,descripcion);
        this.controlador.mostrarPelicula(pelicula);
    }
}


$(document).ready(function(){
    var controlador = new Controlador();
});