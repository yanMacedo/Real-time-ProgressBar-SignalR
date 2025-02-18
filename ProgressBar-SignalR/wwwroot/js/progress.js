"use strict";


const connection = new signalR.HubConnectionBuilder()
    .withUrl("/progressHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start().then(() => {
    console.log("SignalR connection established.");
}).catch(err => console.error(err.toString()));

connection.on("ReceiveProgress", function (progress) {
    //document.getElementById("progressBar").style.width = progress + "%";
    //var progreesBarWidth = document.getElementById("progressBar").style.width = progress + "%";

    var progreesBar = document.getElementById("progressBar");
    progreesBar.style.width = progress + "%";

    if (progress == 100) {
        progressBar.addEventListener("transitionend", function resetBar() {
            progreesBar.style.width = "0%";
            alert("File uploaded succesfully!");

            progreesBar.removeEventListener("transitionend", resetBar);
        }, { once: true }); //o evento só dispara uma vez  
    }

});


function uploadFile() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    var formData = new FormData();
    formData.append("file", file);

    fetch("/api/ImportExcel/importExcel", {
        method: "POST",
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log("File uploaded succesfully!")
        }).catch(error => {
            console.error("Error: ", error);
        })
}