"use strict";


const connection = new signalR.HubConnectionBuilder()
    .withUrl("/progressHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start().then(() => {
    console.log("SignalR connection established.");
}).catch(err => console.error(err.toString()));

connection.on("ReceiveProgress", function (progress) {
    document.getElementById("progressBar").style.width = progress + "%";
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