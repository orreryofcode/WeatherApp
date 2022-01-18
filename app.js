const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));



app.get("/", function (req, res) {
    res.render('home');
})


app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.OPEN_WEATHERMAP_API_KEY;
    const units = "imperial"

    const url = "https://api.openweathermap.org/data/2.5/find?q=" + query + "&units=" + units + "&appid=" + apiKey;
    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const name = weatherData.list[0].name;
            const temp = Math.floor(weatherData.list[0].main.temp);
            const description = weatherData.list[0].weather[0].description;
            const icon = weatherData.list[0].weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.render("result", {
                name: name,
                temp: temp,
                description: description,
                icon: imageURL
            })
        })
    })



})

app.listen(process.env.PORT || 3000, () => {
    console.log("server started");
})