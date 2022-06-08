function botonComentarios(idreview) {
    var x = document.getElementById("comentarios_"+idreview);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}