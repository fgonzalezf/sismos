define(
    ["dojo/_base/declare", "dojo/_base/lang", "esri/request","dojo/_base/array","esri/geometry/Point", "esri/graphic"],
    function(declare, lang, esriRequest, array, Point, Graphic )
    {
        return declare([], {

            urlJson: null,
            magnitudMin:null,
            magnitudMax:null,
            profundidadMin:null,
            profundidadMax:null,
            fechaInicio:null,
            fechaFinal:null,

            constructor: function(options){
                this.urlJson = options.urlJson || "js/Volcanes.json";
                this.magnitudMin = options.magnitudMin;
                this.magnitudMax = options.magnitudMax;
                this.profundidadMin = options.profundidadMin;
                this.profundidadMax = options.profundidadMax;
                this.fechaInicio = options.fechaInicio;
                this.fechaFinal =options.fechaFinal;


                this.returnEvents = lang.hitch(this, this.returnEvents);
                this.returnVal = lang.hitch(this, this.returnVal);
            },

            searchByVal: function() {
                var eventsResponse;
                eventsResponse = esriRequest({
                    "url": this.urlJson,
                    "handleAs": "json",
                    "timeout":0
                });
                return eventsResponse.then(this.returnVal, this.errVal);
            },

            returnVal: function(response) {
                console.log("Respuesta exitosa mode");

                var features = [];
                var magMin = this.magnitudMin;
                var magMax = this.magnitudMax;
                var profMin = this.profundidadMin;
                var profMax = this.profundidadMax;
                var fechaIni = this.fechaInicio;
                var fechaFin = this.fechaFinal;
                array.forEach(response, function (item) {
                    var attr = {};
                    //pull in any additional attributes if required
                    MagControl=true;
                    PrfControl=true;
                    fechaControl=true;
                    var profundidad = item.depth;
                    var fechaLocal = new Date(item.last_modified);
                    var milsegUTC = fechaLocal.getTime() + 18000000;
                    var fechautc = fechaLocal.setTime(milsegUTC);
                    var fechautcLc = fechaLocal.setTime(milsegUTC - 18000000);

                    
                    var attr = {};
                    //console.log(item.id);
                    attr["EVENTO"] = item.id;

                    if (profundidad.indexOf("Superficial")!=-1)
                    {
                        attr["PROFUNDIDAD"] = "Superficial";
                    }
                    else{
                        attr["PROFUNDIDAD"] = profundidad;
                    }

                    
                    attr["PROFUNDIDADSIM"] =  Math.abs(item.depth1);
                    if(item.latitude.toString()=="")
                    {
                        attr["LATITUD"] = item.latitude.toString();
                    }
                    else{
                        attr["LATITUD"] = item.latitude.toString()+"°";
                    }
                    if(item.longitude.toString()=="")
                    {
                        attr["LONGITUD"] = item.longitude.toString();
                    }
                    else{
                        attr["LONGITUD"] = item.longitude.toString()+"°";
                    }
                    //attr["URL"] = item.arURL;
                    attr["FECHA"] = item.time_local;
                    attr["FECHAUTC"] = item.time_UTC;
                    attr["DESCRIPCION"] = item.description;

                    var magString = item.mag.toString();
                    if (magString.indexOf(".")!=-1){
                        attr["MAGNITUDTEXT"] = item.mag;
                    }
                    else{
                        attr["MAGNITUDTEXT"] =item.mag.toString()+".0"
                    }
                    attr["MAGNITUD"] =item.mag;

                    //attr["RMS"] = item.rms;
                    //attr["GAP"] = item.gap;
                    attr["SHAKEMAP"] = item.shakemap;
                    //attr["MAPURL"] = item.mapURL;
                    //attr["URL"] = item.arURL;
                    //attr["FECA_UTC"] = item.time_UTC;
                    attr["ESTADO"] = item.status;
                    attr["LOCALIZACION"] = item.closer_towns;
                    //Descripción -> Región, fecha local / hora
                    if(parseFloat(item.mag)<4)
                    {
                        attr["UNION"] = item.description.toLocaleString() + "<BR>" + item.time_local.toString();
                    }
                    else {
                        attr["UNION"] = "<B>" + item.description.toLocaleString() + "<BR>" + item.time_local.toString() + "</B>";
                    }
                    attr["PROFUNDIDADTEXT"] =item.depth;
                    console.log(profMin + profMax);
                    if ((magMax != "" && magMin!= ""))
                    {


                        if(parseFloat(magMax) > parseFloat(item.mag) && parseFloat(magMin)< parseFloat(item.mag))
                        {
                            MagControl=true;

                        }
                        else{
                            MagControl=false;
                        }

                        
                    }
                    if ((profMin != "" && profMax != ""))
                    {
                        
                        if(parseFloat(profMin)< item.depth1 && parseFloat(profMax) > item.depth1)
                        {
                            PrfControl=true;
                        }
                        else{
                            
                            PrfControl=false;
                        }
                           

                    }
                        
                    if ((fechaIni != "" && fechaFin != ""))
                        
                    {
                        console.log("fecha");
                        var fechaLocal= item.time_local.split(" ")[0];
                        //fechaLocal =fechaLocal.split("/")[1]+"/"+fechaLocal.split("/")[0]+"/"+fechaLocal.split("/")[2];
                        console.log(fechaLocal);
                        fechaLocal= new Date(fechaLocal);
                        console.log(fechaIni);
                        console.log(fechaFin);
                        var fechaLocalIni= new Date(fechaIni);
                        var fechaLocalFin=new Date(fechaFin);

                        if(fechaLocalIni <= fechaLocal && fechaLocalFin >= fechaLocal)
                        {
                            fechaControl=true;
                        }
                        else{
                            fechaControl=false;
                        }
                    }
                    //console.log(MagControl);
                    //console.log(PrfControl);
                    console.log(fechaControl);
                    
                    if ( MagControl&&PrfControl&&fechaControl) {
                        var geometry = new Point(item.longitude1, item.latitude1);
                        var graphic = new Graphic(geometry);
                        graphic.setAttributes(attr);
                        features.push(graphic);
                    }
                });

                if (typeof features !== 'undefined'&& features.length == 0)
                {
                    var attr = {};

                    attr["EVENTO"] = "";
                    attr["PROFUNDIDAD"] = "";
                    attr["PROFUNDIDADSIM"] = "";
                    attr["LATITUD"] = "";
                    attr["LONGITUD"] = "";
                    //attr["URL"] = item.arURL;
                    attr["FECHA"] = "";
                    attr["FECHAUTC"] = "";
                    attr["DESCRIPCION"] = "SIN DATOS";
                    attr["MAGNITUD"] = "";
                    //attr["RMS"] = item.rms;
                    //attr["GAP"] = item.gap;
                    attr["SHAKEMAP"] = "";
                    //attr["MAPURL"] = item.mapURL;
                    //attr["URL"] = item.arURL;
                    attr["ESTADO"] = "";
                    attr["LOCALIZACION"] = "";
                    attr["UNION"] = "";
                    attr["PROFUNDIDADTEXT"] ="";
                    var geometry = null;
                    var graphic = new Graphic(geometry);
                    graphic.setAttributes(attr);
                    features.push(graphic);
                }

                return features;
            },
            errVal: function(err) {
                console.log("Failed to get results from Seat Geek due to an error: ", err);
            },

            searchByLoc: function() {
                var eventsResponse;
                eventsResponse = esriRequest({
                    "url": this.urlJson,
                    "handleAs": "json",
                    "timeout":0
                });
                return eventsResponse.then(this.returnEvents, this.err);
            },



            returnEvents: function(response) {
                console.log("Respuesta exitosa mode");
                var features = [];
                array.forEach(response, function (item) {
                    var attr = {};
                    var profundidad = item.depth;
                   //console.log(item.id);
                    attr["EVENTO"] = item.id;
                    if (profundidad.indexOf("Superficial")!=-1)
                    {
                        attr["PROFUNDIDAD"] = "Superficial";
                    }
                    else{
                        attr["PROFUNDIDAD"] = profundidad;
                    }
                    attr["PROFUNDIDADSIM"] = Math.abs(item.depth1);
                    if(item.latitude.toString()=="")
                    {
                        attr["LATITUD"] = item.latitude.toString();
                    }
                    else{
                        attr["LATITUD"] = item.latitude.toString()+"°";
                    }
                    if(item.longitude.toString()=="")
                    {
                        attr["LONGITUD"] = item.longitude.toString();
                    }
                    else{
                        attr["LONGITUD"] = item.longitude.toString()+"°";
                    }
                    //attr["URL"] = item.arURL;
                    attr["FECHA"] = item.time_local;
                    attr["FECHAUTC"] = item.time_UTC;
                    attr["DESCRIPCION"] = item.description;
                    var magString = item.mag.toString();
                    if (magString.indexOf(".")!=-1){
                        attr["MAGNITUDTEXT"] = item.mag;
                    }
                    else{
                        attr["MAGNITUDTEXT"] =item.mag.toString()+".0"
                    }
                    attr["MAGNITUD"] =item.mag;
                    //attr["RMS"] = item.rms;
                    //attr["GAP"] = item.gap;
                    attr["SHAKEMAP"] = item.shakemap;
                    //attr["MAPURL"] = item.mapURL;
                    //attr["URL"] = item.arURL;
                    attr["ESTADO"] = item.status;
                    attr["LOCALIZACION"] = item.closer_towns;
                    if(parseFloat(item.mag)<4)
                    {
                        attr["UNION"] = item.description.toLocaleString()+  "<BR>" + item.time_local.toString();
                    }
                    else {
                        attr["UNION"] = "<B>" + item.description.toLocaleString() +  "<BR>" + item.time_local.toString() + "</B>";
                    }
                    attr["PROFUNDIDADTEXT"] = item.depth;
                    var geometry = new Point(item.longitude1, item.latitude1);
                    var graphic = new Graphic(geometry);
                    graphic.setAttributes(attr);
                    features.push(graphic);

                });
                if (typeof features !== 'undefined'&& features.length == 0)
                {
                    var attr = {};
                    attr["EVENTO"] = "";
                    attr["PROFUNDIDAD"] = "";
                    attr["PROFUNDIDADSIM"] = "";
                    attr["LATITUD"] = "";
                    attr["LONGITUD"] = "";
                    //attr["URL"] = item.arURL
                    attr["FECHA"] = "";
                    attr["FECHAUTC"] = "";
                    attr["DESCRIPCION"] = "SIN DATOS";
                    attr["MAGNITUD"] = "";
                    //attr["RMS"] = item.rms;
                    //attr["GAP"] = item.gap;
                    attr["SHAKEMAP"] = "";
                    //attr["MAPURL"] = item.mapURL;
                    //attr["URL"] = item.arURL;
                    attr["ESTADO"] = "";
                    attr["LOCALIZACION"] = "";
                    attr["UNION"] = "";
                    attr["PROFUNDIDADTEXT"] ="";
                    var geometry = null;
                    var graphic = new Graphic(geometry);
                    graphic.setAttributes(attr);
                    features.push(graphic);
                }
                return features;
            },
            err: function(err) {
                console.log("Failed to get results from Seat Geek due to an error: ", err);
            }
        });

    }
);
