// contient les articles de presse, qui doivent être 
// gardés en mémoire même après affichage du graphique

var news_data;

// Palette de couleurs utilisée par tous les graphiques
var colors = ["#1D507A", "#2F6999", "#66A0D1", "#8FC0E9", "#4682B4"];

/*
// Chargement des articles de presse
$.ajax({
          url: "/api/news",
          success: display_news
});
*/
var len=0;
var tab_names = [];
var counter = 0;
var CSS_classes = ["red", "teal", "sky", "black", "gray", "orange","pink","green","blue","yellow","purple"];

function changeChartID(){
    var elem = document.getElementsByClassName("chart");
    console.log(elem.length);
    
    var cpt = 0;
    for (i = 0; i < elem.length; i++) {
        if (i%4 == 0) {
            cpt ++;
        }
        var element = elem[i];
        switch (i%4) {
            case 0:
                var new_id = tab_names[cpt-1] + "-meteo"
                element.setAttribute("id", new_id );
                break;
            case 1:
                var new_id = tab_names[cpt-1] + "-hum"
                element.setAttribute("id", new_id );
                break;
            case 2:
                var new_id = tab_names[cpt-1] + "-tempext"
                element.setAttribute("id", new_id );
                break;
            case 3:
                var new_id = tab_names[cpt-1] + "-humext"
                element.setAttribute("id", new_id );
                break;
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }
        
    }
    /*
    Array.from(elem).forEach((el) => {
        // Do stuff here
        console.log(el);
    }); 
    */
}

function changeWidgetID(){
    var elem = document.getElementsByClassName("find");
    console.log(elem.length);
    var cpt = 0;
    for (i = 0; i < elem.length; i++) {
        if (i%4 == 0) {
            cpt ++;
        }
        var element = elem[i];
        switch (i%4) {
            case 0:
                var new_id = tab_names[cpt-1] + "-eau"
                element.setAttribute("id", new_id );
                break;
            case 1:
                var new_id = tab_names[cpt-1] + "-tempint"
                element.setAttribute("id", new_id );
                break;
            case 2:
                var new_id = tab_names[cpt-1] + "-humint"
                element.setAttribute("id", new_id );
                break;
            case 3:
                var new_id = tab_names[cpt-1] + "-lum"
                element.setAttribute("id", new_id );
                break;
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }
        
    } 
}

function changeTitleID(){
    var elem = document.getElementsByClassName("titre");
    console.log(elem.length);
    for (i = 0; i < elem.length; i++) {
        var element = elem[i];
        var new_id = tab_names[i]+"-titre";
        element.setAttribute("id", new_id );   
    } 
}

 $.ajax({
    url: "/api/values",
    dataType: "json",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
        if (data["status"] == "ok") {
            var key;
            var key_tab=[];
            for(key in data.val._default) {
                len++;
                key_tab.push(key);
            }
            for (var i=0; i < len; i++) {
                tab_names.push("dashboard"+i);
                createDiv("dashboard"+i,i);   
            }
            counter = includeHTML();
            var css_cpt = 0;
            for (var i=0; i < tab_names.length; i++ ){
                var myDiv = document.getElementById("dashboard-buttons"); 
                var a = document.createElement('a');
                var desiredLink = "#" + tab_names[i];
                a.setAttribute('href',desiredLink);
                a.className = " boutton block circular " + CSS_classes[css_cpt];
                a.innerHTML = "Dahboard de " + data["val"]["_default"][key_tab[i]].nom;

                // add the button to the div
                myDiv.appendChild(a);
                css_cpt++;
                if(css_cpt>= CSS_classes.length){
                    css_cpt = 0;
                }
            }
            
                //console.log(tab_names);
                console.log(len);
                setTimeout(function(){

                    google.charts.load('visualization', { packages: ['corechart'] });
                    //console.log("je suis executer mtn");
                    changeChartID();
                    changeWidgetID();
                    changeTitleID();

                    google.charts.setOnLoadCallback(drawValuesChart);

                        function drawValuesChart() {
                            $.ajax({
                                url: "/api/values",
                                dataType: "json",
                                type: "GET",
                                contentType: "application/json; charset=utf-8",
                                success: function (data) {
                                    for (var i = 0; i < len; i++){
                                        var id = tab_names[i];
                                        
                                        var myDiv = document.getElementById(tab_names[i] +'-titre');
                                        myDiv.innerHTML = "Dahboard de " + data["val"]["_default"][key_tab[i]].nom;

                                        /* Construct hum exterieur */
                                        var arrSales = [['Date', 'Humidité']];    // Define an array and assign columns for the chart.
                                        var lum = [['Luminosité']]; 
                                        // Loop through each data and populate the array.
                                        $.each(data["val"]["_default"][key_tab[i]]["measures"], function (index, value) {
                                            arrSales.push([new Date(value.date * 1000), value.hum_air]);
                                            lum.push([value.lum]);
                                        });
                                        var myDiv = document.getElementById(id +'-lum');
                                        myDiv.fontWeight = "bold";
                                        var lum_text = "None";
                                        if ( lum[lum.length - 1] == "0" ){
                                            lum_text = "Mauvaise";
                                        }
                                        else if ( lum[lum.length - 1] == "1"  ){
                                            lum_text = "Moyenne";
                                        }
                                        else if ( lum[lum.length - 1] == "1"  ){
                                            lum_text = "Bonne";
                                        }
                                        else {
                                            lum_text = "Excellente";
                                        }
                                        myDiv.innerHTML = lum_text;
                                        
                                        // Set chart Options.
                                        var options = {
                                            //title: 'Temperature interieur',
                                            hAxis: {title: 'Dates'},
                                            vAxis: {title: 'Humidité %'},
                                            curveType: 'function',
                                            legend: { position: 'bottom', textStyle: { color: '#555', fontSize: 14} }  // You can position the legend on 'top' or at the 'bottom'.
                                        };
                                        
                                        // Create DataTable and add the array to it.
                                        var figures = google.visualization.arrayToDataTable(arrSales)
                                        // Define the chart type (LineChart) and the container (a DIV in our case).
                                        var chart = new google.visualization.LineChart(document.getElementById(id + '-humext'));
                                        chart.draw(figures, options);      // Draw the chart with Options.

                                         /* Construct temp exterieur */

                                        var arrSales = [['Date', 'Temperature']];    // Define an array and assign columns for the chart.
                                        var eau = [['Eau']];
                                        // Loop through each data and populate the array.
                                        $.each(data["val"]["_default"][key_tab[i]]["measures"], function (index, value) {
                                            arrSales.push([new Date(value.date * 1000), value.temp_air]);
                                            eau.push([value.eau]);
                                        });
                                        var myDiv = document.getElementById(id +'-eau');
                                        myDiv.fontWeight = "bold";
                                        myDiv.innerHTML = eau[eau.length - 1] + "%";

                                        // Set chart Options.
                                        var options = {
                                            //title: 'Temperature interieur',
                                            hAxis: {title: 'Dates'},
                                            vAxis: {title: 'Temperature °C'},
                                            curveType: 'function',
                                            legend: { position: 'bottom', textStyle: { color: '#555', fontSize: 14} }  // You can position the legend on 'top' or at the 'bottom'.
                                        };
                                        
                                        // Create DataTable and add the array to it.
                                        var figures = google.visualization.arrayToDataTable(arrSales)

                                        // Define the chart type (LineChart) and the container (a DIV in our case).
                                        var chart = new google.visualization.LineChart(document.getElementById(id +'-tempext'));
                                        chart.draw(figures, options);      // Draw the chart with Options.

                                         /* Construct hum interieur */

                                        var arrSales = [['Date', 'Humidité']];    // Define an array and assign columns for the chart.
                                    
                                        // Loop through each data and populate the array.
                                        $.each(data["val"]["_default"][key_tab[i]]["measures"], function (index, value) {
                                            arrSales.push([new Date(value.date * 1000), value.hum_sol]);
                                        });
                                        var myDiv = document.getElementById(id +'-humint');
                                        myDiv.fontWeight = "bold";
                                        myDiv.innerHTML = arrSales[arrSales.length - 1][1] + "%";
                                        // Set chart Options.
                                        var options = {
                                            //title: 'Temperature interieur',
                                            hAxis: {title: 'Dates'},
                                            vAxis: {title: 'Humidité %'},
                                            curveType: 'function',
                                            legend: { position: 'bottom', textStyle: { color: '#555', fontSize: 14} }  // You can position the legend on 'top' or at the 'bottom'.
                                        };
                                        
                                        // Create DataTable and add the array to it.
                                        var figures = google.visualization.arrayToDataTable(arrSales)

                                        // Define the chart type (LineChart) and the container (a DIV in our case).
                                        var chart = new google.visualization.LineChart(document.getElementById(id +'-hum'));
                                        chart.draw(figures, options);      // Draw the chart with Options.

                                         /* Construct temp interieur */

                                         var arrSales = [['Date', 'Temperature']];    // Define an array and assign columns for the chart.
                                        var batterie = [['Batterie']];
                                        // Loop through each data and populate the array.
                                        $.each(data["val"]["_default"][key_tab[i]]["measures"], function (index, value) {
                                            arrSales.push([new Date(value.date * 1000), value.temp_sol]);
                                            batterie.push([value.batterie]);
                                        });
                                        var myDiv = document.getElementById(id +'-tempint');
                                        myDiv.fontWeight = "bold";
                                        myDiv.innerHTML = batterie[batterie.length - 1] + "%";
                                        // Set chart Options.
                                        var options = {
                                            //title: 'Temperature interieur',
                                            hAxis: {title: 'Dates'},
                                            vAxis: {title: 'Temperature °C'},
                                            curveType: 'function',
                                            legend: { position: 'bottom', textStyle: { color: '#555', fontSize: 14} }  // You can position the legend on 'top' or at the 'bottom'.
                                        };
                                        
                                        // Create DataTable and add the array to it.
                                        var figures = google.visualization.arrayToDataTable(arrSales)

                                        // Define the chart type (LineChart) and the container (a DIV in our case).
                                        var chart = new google.visualization.LineChart(document.getElementById(id +'-meteo'));
                                        chart.draw(figures, options);      // Draw the chart with Options.

                                    }
                                    
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert('Got an Error');
                                }
                            });
                        }

                       

                }, len*500);

            } 
        },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Got an Error');
    }
});

/*
window.onload = function test(){
                console.log("page loaded");
                console.log(tab_names);
                
                setTimeout(function(){

                    google.charts.load('visualization', { packages: ['corechart'] });
                    google.charts.setOnLoadCallback(drawLineChart);

                    function drawLineChart() {
                        console.log(counter);
                        $.ajax({
                            url: "/api/values",
                            dataType: "json",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                //console.log("im called now");
                                changeChartID();
                                changeWidgetID();
                                var arrSales = [['Month', 'Sales Figure', 'Perc. (%)']];    // Define an array and assign columns for the chart.
                                console.log(data)
                                /*
                                // Loop through each data and populate the array.
                                $.each(data, function (index, value) {
                                    arrSales.push([value.Month, value.Sales_Figure, value.Perc]);
                                });

                                // Set chart Options.
                                var options = {
                                    title: 'Monthly Sales',
                                    curveType: 'function',
                                    legend: { position: 'bottom', textStyle: { color: '#555', fontSize: 14} }  // You can position the legend on 'top' or at the 'bottom'.
                                };

                                // Create DataTable and add the array to it.
                                var figures = google.visualization.arrayToDataTable(arrSales)

                                // Define the chart type (LineChart) and the container (a DIV in our case).
                                var chart = new google.visualization.LineChart(document.getElementById('#dashboard0-meteo'));
                                chart.draw(figures, options);      // Draw the chart with Options.
                                
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert('Got an Error');
                            }
                        });
                    }
                }, len*1500);
     
            }
*/


        /*
                // Chargement des données météo
        d3.json('/api/values', display_nvd3_graph);

        function display_nvd3_graph(data) {
            
            if (data["status"] == "ok") {

                start_value = 
                var temperature_data = [{
                    key: 'Température',
                    values: data["val"][0]["measures"]
                }]
                console.log(temperature_data)

                //console.log(temperature_data);
                console.log(data["val"][0]["measures"][0].temp_sol);
                var first_date = temperature_data[0]['values'][0].date;
                console.log(first_date)
                values = 

                
                nv.addGraph(function() {

                        var chart = nv.models.lineWithFocusChart()
                            .x(function(d) {
                                return d[0]
                            })
                            .y(function(d) {
                                console.log(d[1]);
                                return d[1]
                            })
                            .yDomain([-5, 35])
                            .height(270)
                            .color(colors);

                        chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

                        chart.xAxis
                            .showMaxMin(false)
                            .tickFormat(function(d) {
                                return d3.time.format('%H:00 (%a)')(new Date(d))
                            });

                        chart.x2Axis
                            .showMaxMin(false)
                            .tickFormat(function(d) {
                                return d3.time.format('%a %-d/%-m')(new Date(d))
                            });

                        chart.yAxis //Chart y-axis settings
                            .showMaxMin(false)
                            .axisLabel('Température (°c)')
                            .tickFormat(d3.format('.00f'));

                        chart.y2Axis
                            .showMaxMin(false)
                            .ticks(false);

                        d3.select('#dashboard0-meteo svg')
                            .datum(temperature_data)
                            .call(chart);

                        //Update the chart when window resizes.
                        nv.utils.windowResize(chart.update);

                        return chart;
                    }); 
                    
            } 

        }*/
           
 /*              
        d3.json('/api/meteo', display_nvd4_graph);
        function display_nvd4_graph(data) {

            if (data["status"] == "ok") {
                var temperature_data = [{
                    key: 'Humidite',
                    values: data["data"]
                }]

                var first_date = temperature_data[0]['values'][0][0];

                nv.addGraph(function() {

                    var chart = nv.models.lineWithFocusChart()
                        .x(function(d) {
                            return d[0]
                        })
                        .y(function(d) {
                            return d[1]
                        })
                        .yDomain([-5, 35])
                        .height(270)
                        .color(colors);

                    chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

                    chart.xAxis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%H:00 (%a)')(new Date(d))
                        });

                    chart.x2Axis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%a %-d/%-m')(new Date(d))
                        });

                    chart.yAxis //Chart y-axis settings
                        .showMaxMin(false)
                        .axisLabel('Humidité relative (%)')
                        .tickFormat(d3.format('.00f'));

                    chart.y2Axis
                        .showMaxMin(false)
                        .ticks(false);

                    d3.select('#dashboard0-hum svg')
                        .datum(temperature_data)
                        .call(chart);

                    //Update the chart when window resizes.
                    nv.utils.windowResize(chart.update);

                    return chart;
                });

               
            }
        }
        */
        /*
        d3.json('/api/meteo', display_nvd5_graph);
        function display_nvd5_graph(data) {

            if (data["status"] == "ok") {
                var temperature_data = [{
                    key: 'Température extérieur',
                    values: data["data"]
                }]

                var first_date = temperature_data[0]['values'][0][0];

                nv.addGraph(function() {

                    var chart = nv.models.lineWithFocusChart()
                        .x(function(d) {
                            return d[0]
                        })
                        .y(function(d) {
                            return d[1]
                        })
                        .yDomain([-5, 35])
                        .height(270)
                        .color(colors);

                    chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

                    chart.xAxis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%H:00 (%a)')(new Date(d))
                        });

                    chart.x2Axis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%a %-d/%-m')(new Date(d))
                        });

                    chart.yAxis //Chart y-axis settings
                        .showMaxMin(false)
                        .axisLabel('Température (°c)')
                        .tickFormat(d3.format('.00f'));

                    chart.y2Axis
                        .showMaxMin(false)
                        .ticks(false);

                    d3.select('#dashboard0-tempext svg')
                        .datum(temperature_data)
                        .call(chart);

                    //Update the chart when window resizes.
                    nv.utils.windowResize(chart.update);

                    return chart;
                });

               
            }
        }

        d3.json('/api/meteo', display_nvd6_graph);
        function display_nvd6_graph(data) {

            if (data["status"] == "ok") {
                var temperature_data = [{
                    key: 'Humidite extérieur',
                    values: data["data"]
                }]

                var first_date = temperature_data[0]['values'][0][0];

                nv.addGraph(function() {

                    var chart = nv.models.lineWithFocusChart()
                        .x(function(d) {
                            return d[0]
                        })
                        .y(function(d) {
                            return d[1]
                        })
                        .yDomain([-5, 35])
                        .height(270)
                        .color(colors);

                    chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

                    chart.xAxis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%H:00 (%a)')(new Date(d))
                        });

                    chart.x2Axis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%a %-d/%-m')(new Date(d))
                        });

                    chart.yAxis //Chart y-axis settings
                        .showMaxMin(false)
                        .axisLabel('Humidité relative (%)')
                        .tickFormat(d3.format('.00f'));

                    chart.y2Axis
                        .showMaxMin(false)
                        .ticks(false);

                    d3.select('#dashboard0-humext svg')
                        .datum(temperature_data)
                        .call(chart);

                    //Update the chart when window resizes.
                    nv.utils.windowResize(chart.update);

                    return chart;
                });

               
            }
        }

        d3.json('/api/meteo', display_nvd7_graph);
        function display_nvd7_graph(data) {

            if (data["status"] == "ok") {
                var temperature_data = [{
                    key: 'Humidite extérieur',
                    values: data["data"]
                }]

                var first_date = temperature_data[0]['values'][0][0];

                nv.addGraph(function() {

                    var chart = nv.models.lineWithFocusChart()
                        .x(function(d) {
                            return d[0]
                        })
                        .y(function(d) {
                            return d[1]
                        })
                        .yDomain([-5, 35])
                        .height(270)
                        .color(colors);

                    chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

                    chart.xAxis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%H:00 (%a)')(new Date(d))
                        });

                    chart.x2Axis
                        .showMaxMin(false)
                        .tickFormat(function(d) {
                            return d3.time.format('%a %-d/%-m')(new Date(d))
                        });

                    chart.yAxis //Chart y-axis settings
                        .showMaxMin(false)
                        .axisLabel('Humidité relative (%)')
                        .tickFormat(d3.format('.00f'));

                    chart.y2Axis
                        .showMaxMin(false)
                        .ticks(false);

                    d3.select('#dashboard1-meteo svg')
                        .datum(temperature_data)
                        .call(chart);

                    //Update the chart when window resizes.
                    nv.utils.windowResize(chart.update);

                    return chart;
                });

               
            }
        } */



    


