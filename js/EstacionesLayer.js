define(
    ["dojo/_base/declare",
        "dojo/_base/lang",
        "esri/request",
        "dojo/_base/array",
        "esri/geometry/Point",
        "esri/graphic",
        "esri/dijit/PopupTemplate",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/layers/FeatureLayer"],
    function(declare, lang, esriRequest, array, Point, Graphic,PopupTemplate,SimpleMarkerSymbol,SimpleLineSymbol,Color,FeatureLayer)
    {
        return declare([], {

            urlJson: null,


            constructor: function(options){
                this.urlJson = options.urlJson || "js/estaciones.json" ;
                this.returnVal = lang.hitch(this, this.returnEvents);
            },

            searchByLoc: function() {
                var eventsResponse;
                eventsResponse = esriRequest({
                    "url": this.urlJson,
                    "handleAs": "json"
                });
                return eventsResponse.then(this.returnEvents, this.err);
            },

            returnEvents: function(response) {
                



                var features2 = [];
                array.forEach(response, function (item) {
                    var attr = {};
                    //console.log(item.id);
                    attr["ID"] = item.ID;
                    attr["RED_MONITOREO"] = item.RED_MONITOREO;
                    attr["ID_ESTACION"] = item.ID_ESTACION;
                    attr["NOMBRE_ESTACION"] = item.NOMBRE_ESTACION;
                    attr["LATITUD"] = item.LATITUD;
                    attr["LONGITUD"] = item.LONGITUD;
                    attr["ALTITUD"] = item.ELEVACION;
                    attr["TIPO_ESTACION"] = item.TIPO_ESTACION;
                    attr["TIPO_ALCANCE"] = item.TIPO_ALCANCE;
                    attr["TIPO_ADQUISICION"] = item.TIPO_ADQUISICION;
                    attr["ESTADO"] = item.ESTADO;
                    attr["AGENCIA"] = item.AGENCIA;
                    attr["RED"] = item.RED;
                    attr["SUBRED"] = item.SUBRED;
                    attr["FECHA_INSTALACION"] = item.FECHA_INSTALACION;
                    attr["FECHA_RETIRO"] = item.FECHA_RETIRO;
                    attr["DESCARGA"]=item.RUTA;

                    var geometry = new Point(parseFloat(item.LONGITUD), parseFloat(item.LATITUD));
                    var graphic = new Graphic(geometry);
                    graphic.setAttributes(attr);
                    features2.push(graphic);

                });
                


                //return FeatureLayerEstaciones;
                return features2;
            },
            err: function(err) {
                console.log("Error creando layer: ", err);
            }

        });

    }
);