const express = require("express");
const axios = require("axios");
const app = express();
const mongoose = require("mongoose");


const Pasajero = mongoose.model("Pasajero", new mongoose.Schema({
    first: String,
    last: String,
    age: Number,
    email: String
}))

let nuevoPasajero = [];

axios.get('https://randomuser.me/api', {
    params: {
        results: 1,
        inc: 'name, email, dob',
        format: 'json'
    }
})
    .then(function (response) {
        nuevoPasajero = response.data.results;
        console.log(nuevoPasajero);
    })
    app.post("/home", async (_req,res) => {
    console.log('cargando...');
    await Pasajero.create({
        first:nuevoPasajero[0].name.first, 
        last:nuevoPasajero[0].name.last, 
        age:nuevoPasajero[0].dob.age, 
        email:nuevoPasajero[0].email})
    return res.send("Pasajero cargado")
})

//Conectar a mi API
mongoose.connect('mongodb://localhost:27017/seminario')

//render al .ejs
app.set('view engine', 'ejs');

app.get("/home", async (_req, res) => {
    console.log("listando....");
    const pasajeros = await Pasajero.find();
    console.log(pasajeros);
    return res.render("index", {pasajeros})
})

app.listen(5001, () => console.log("escuchando el puerto"));
