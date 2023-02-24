const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(__dirname ));
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/public/video'));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/index.html" , function(req, res){
  const query=req.body.cityName
  const apikey="bc41ceec266dfe86f748257816dbce71"
  const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&APPID="+ apikey +"&units=metric";

  https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data) {
      const weatherData = JSON.parse(data);
      const description = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon=weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
      res.write(`
        <head>
        <link rel="stylesheet" type="text/css" href="/css/style.css">
        </head>
        <body class="js">
        <div class='video-container'>
          <video autoplay muted loop id="myVideo">
            <source src="/public/video/weather-bg.mp4" type="video/mp4">
          </video>
        </div>
        <div class='weather-info'>
          <p>the weather description ${description}</p>
          <h1 class="h1">The temperature in ${query} is ${temp} degree Celsius</h1>
          <img src=${imageUrl}>
        </div>
        </body>
      `);
      res.send();
    });
  });

});

app.listen(5000,function(){
  console.log("server is running on port 5000");
});
