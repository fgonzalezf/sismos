var myFeatureTable;
require([
    "esri/layers/FeatureLayer",
    "esri/dijit/FeatureTable",
    "esri/geometry/Extent",
    "esri/graphicsUtils",
    "esri/tasks/query",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/map",
    "dojo/dom",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "esri/Color",
    "esri/dijit/Scalebar",
    "esri/toolbars/navigation",
    "esri/geometry/webMercatorUtils",
    "dojo/_base/lang",
    "esri/dijit/InfoWindowLite",
    "esri/InfoTemplate",
    "dojo/dom-construct",
    "dojo/_base/connect",
    "esri/domUtils",
    "dijit/registry",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "dojo/dom-class",
    "esri/dijit/HomeButton",
    "esri/arcgis/utils",
    "esri/dijit/LayerList",
    "esri/request",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/tasks/BufferParameters",
    "esri/tasks/GeometryService",
    "dijit/form/RadioButton",
    "dijit/form/Button",
    "dojo/request",
    "esri/dijit/Legend",
    "esri/renderers/ClassBreaksRenderer",
    "dojo/fx/Toggler",
    "dojo/fx",
    "dojo/dom-geometry",
    "esri/dijit/BasemapGallery",
    "esri/dijit/OverviewMap",
    "dojo/_base/array",
    "dojo/html",
    "dojo/date/locale",
    "esri/config",
    "dojo/_base/array",
    "esri/dijit/Print",
    "esri/tasks/PrintTemplate",
    "dojo/data/ItemFileReadStore",
    "js/ModConsulta",
    "js/EstacionesLayer",
    "dijit/form/TextBox",
    "dijit/Menu", 
    "dijit/MenuItem", 
    "dijit/form/DropDownButton",
    "esri/tasks/Geoprocessor",
    "dojo/dom-style",
    "dojo/dom-attr",
    "esri/dijit/PopupMobile",
    "esri/symbols/PictureMarkerSymbol",
    "dijit/Dialog",
    "dijit/TooltipDialog",
    "dijit/popup",
    "esri/dijit/InfoWindow",
    "js/LimiteMaritimoLayer",
], function (FeatureLayer, FeatureTable, Extent, graphicsUtils, Query, SimpleMarkerSymbol, SimpleLineSymbol, Map,
             dom, parser, ready, on, ContentPane, BorderContainer, Color, Scalebar, Navigation, webMercatorUtils, lang, InfoWindowLite, InfoTemplate, domConstruct, connect, domUtils, registry, Popup, PopupTemplate, SimpleFillSymbol, Color,
             domClass, HomeButton, arcgisUtils, LayerList, esriRequest, Point, Graphic, BufferParameters, GeometryService, RadioButton, Button, request, Legend, ClassBreaksRenderer, Toggler, coreFx, domGeom, BasemapGallery, OverviewMap, array,
             html, locale, config, arrayUtils, Print, PrintTemplate, ItemFileReadStore, ModConsulta, Estaciones,TextBox,
             Menu,MenuItem, DropDownButton,Geoprocessor,Style,domAttr,PopupMobile,PictureMarkerSymbol,Dialog,TooltipDialog,djpopup,InfoWindow,LimiteMaritimoLayer ) {

    //parser.parse();
    esri.config.defaults.io.corsEnabledServers.push("https://sismos.sgc.gov.co/json/events.json");
    esri.config.defaults.io.corsEnabledServers.push("https://srvags.sgc.gov.co/arcgis/rest/services");
    //esri.config.defaults.io.corsEnabledServers.push("https://seiscompws.sgc.gov.co:16830/events");
    esri.config.defaults.io.timeout = 500000;
    
    //url Estaciones
    var url_hibridas='https://sismos.sgc.gov.co/json/estaciones_hibridas.json';
    var url_Acelerografos='https://sismos.sgc.gov.co/json/estaciones_rnac.json';
    var url_Sismologicas='https://sismos.sgc.gov.co/json/estaciones_rsnc.json';



    var url_Estaciones_portatiles_simologicas='https://sismos.sgc.gov.co/json/estaciones_rsnc_portatiles.json';
    var url_Estaciones_portatiles_acelerograficas='https://sismos.sgc.gov.co/json/estaciones_rnac_portatiles.json';


    //var url_Estaciones='https://sismos.sgc.gov.co/json/capa_estaciones.json';
    // modificacion 12_01_2018
    var Control=0;
    var url = "";
    //var url_UltimoSismo = "http://seiscompws.sgc.gov.co:16830/events";
    var url_UltimoSismo = "https://sismos.sgc.gov.co/json/events.json";
    function Get(yourUrl){
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET",yourUrl,false);
        Httpreq.send(null);
        return Httpreq.responseText;
    }
    try {
        var json_obj = JSON.parse(Get(url_UltimoSismo));
        console.log('Sintaxis Correcta');
    }
    catch (error) {
        url_UltimoSismo = "https://srvags.sgc.gov.co/VolcanesSGCJson/Volcanes/sismos/events.json";
        if(error instanceof SyntaxError) {
            var mensaje = error.message;
            console.log('ERROR EN LA SINTAXIS:', mensaje);
        } else {
            throw error; // si es otro error, que lo siga lanzando
        }
    }
    //var url_UltimoSismo ="images/prueba.json"
    var template = new PopupTemplate({
        "title": '<b>{DESCRIPCION}</b>',

        "fieldInfos": [
            {
                "fieldName": "EVENTO",
                "alias": "Identificador",
            },
            {
                "fieldName": "DESCRIPCION",
                "alias": "Descripcion",
            },
            {
                "fieldName": "MAGNITUDTEXT",
                "alias": "Magnitud",
            },
            {
                "fieldName": "PROFUNDIDAD",
                "alias": "Profundidad"
            },
            {
                "fieldName": "LATITUD",
                "alias": "Latitud",
            },
            {
                "fieldName": "LONGITUD",
                "alias": "Longitud"
            },
            {
                "fieldName": "FECHA",
                "alias": "Fecha"
            },
            {
                "fieldName": "FECHAUTC",
                "alias": "Fecha_UTC"
            },
            {
                "fieldName": "ESTADO",
                "alias": "ESTADO"
            },
            {
                "fieldName": "LOCALIZACION",
                "alias": "Localizacion"
            },
            {
                "fieldName": "PROFUNDIDADTEXT",
                "alias": "Prof"
            },
            {
                "fieldName": "SHAKEMAP",
                "alias": "Intensidad"
            }
        ],

        "description": "<B>Tiempo de origen: </B> {FECHA} Hora Local ({FECHAUTC} UTC) " +
        "<br><B>Magnitud:</B> {MAGNITUDTEXT} <br> <B>Estado:</B> {ESTADO}<br> <B>Profundidad:</B> {PROFUNDIDADTEXT}  " +
        "<br>  <b>Longitud:</b> {LONGITUD} <br> <b>Latitud:</b> {LATITUD}" +
        "<table style='width:100%' class='ShakemapL{SHAKEMAP}'><tr> " +
        "<th style='width:50% !important'><B>Intensidad Instrumental: </B></th> " +
        "<th style='width:15% !important'><div class='Shakemap  shakeMap{SHAKEMAP}'>{SHAKEMAP}</div></th>" +
        "<th style='width:35% !important'><div class='shakeMapTxt{SHAKEMAP}'></div> </th></tr> </table>" +
        "<div><b>Municipios Cercanos:</b> {LOCALIZACION}</div>",

    });
    ready(function () {

        on(dom.byId("previous"), "click", selectPrevious);
        on(dom.byId("next"), "click", selectNext);
        //parser.parse();

        var popup = new Popup({
            fillSymbol: new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255,255,0])),
                new Color([255, 255, 255, 0]))
        }, domConstruct.create("div"));
        var symbol = new SimpleMarkerSymbol({
            "color": [0,0,0,0],
            "size": 12,
            "angle": -30,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": [0,0,0],
                "width": 2,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
        var map = new Map("map", {

            center: [-72, 4],
            zoom: 6,
            infoWindow: popup,
            logo:false,
            autoResize:true
        });
        map.infoWindow.set("markerSymbol",symbol);

        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();

        var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "dual"
        });

        map.on("load", loadTable);

        loading = dom.byId("loadingImg");  //loading image. id
        function showLoading() {
            esri.show(loading);
            map.disableMapNavigation();
            map.hideZoomSlider();
        }

        function hideLoading(error) {
            esri.hide(loading);
            map.enableMapNavigation();
            map.showZoomSlider();
        }
        map.on("update-start", showLoading);
        map.on("update-end", hideLoading);
        function loadTable() {
            on(dom.byId("consulta1"), "click", function (evt) {
                var check1 = dom.byId("consulta1");
                var TextboxfecIni = dom.byId("fechaInicial");
                var TextboxfecFin = dom.byId("fechaFinal");
                var consultaFechaInput = dom.byId("consultaFecha");
                if(check1.checked == false){
                	domAttr.set(consultaFechaInput, 'style', 'display : none');
                }else{
                	domAttr.set(consultaFechaInput , 'style', 'display : block');
                }
                activarConsulta(TextboxfecIni,TextboxfecFin,check1);

            });
            on(dom.byId("consulta2"), "click", function (evt) {
                var check2 = dom.byId("consulta2");
                var TextboxMagMin = dom.byId("Mag1");
                var TextboxMagMax = dom.byId("Mag2");
                var consultaMagInput = dom.byId("consultaMagnitud");
                if(check2.checked == false){
                	domAttr.set(consultaMagInput, 'style', 'display : none');
                }else{
                	domAttr.set(consultaMagInput, 'style', 'display : block');
                }
                activarConsulta(TextboxMagMin,TextboxMagMax,check2);
                
            });
            on(dom.byId("consulta3"), "click", function (evt) {
                var check3 = dom.byId("consulta3");
                var TextboxProfMin = dom.byId("Prof1");
                var TextboxprofMax = dom.byId("Prof2");
                var consultaProfInput = dom.byId("consultaProfundidad");
                if(check3.checked == false){
                	domAttr.set(consultaProfInput, 'style', 'display : none');
                }else{
                	domAttr.set(consultaProfInput, 'style', 'display : block');
                }  
                activarConsulta(TextboxProfMin,TextboxprofMax,check3);

            });
            on(dom.byId("Prof1"),"change", function (evt) {
                var check3 = dom.byId("consulta3");
                var TextboxProfMin = dom.byId("Prof1");
                var TextboxprofMax = dom.byId("Prof2");
                activarConsulta(TextboxProfMin,TextboxprofMax,check3);
            });
            on(dom.byId("fechaFinal"),"focus", function (evt) {
                var check1 = dom.byId("consulta1");
                var TextboxfecIni = dom.byId("fechaInicial");
                var TextboxfecFin = dom.byId("fechaFinal");
                activarConsulta(TextboxfecIni,TextboxfecFin,check1);
            });
            on(dom.byId("fechaInicial"),"focus", function (evt) {
                var check1 = dom.byId("consulta1");
                var TextboxfecIni = dom.byId("fechaInicial");
                var TextboxfecFin = dom.byId("fechaFinal");
                activarConsulta(TextboxfecIni,TextboxfecFin,check1);
            });
            on(dom.byId("Prof2"),"change", function (evt) {
                var check3 = dom.byId("consulta3");
                var TextboxProfMin = dom.byId("Prof1");
                var TextboxprofMax = dom.byId("Prof2");
                activarConsulta(TextboxProfMin,TextboxprofMax,check3);
            });

            on(dom.byId("Mag1"),"change", function (evt) {
                var check2 = dom.byId("consulta2");
                var TextboxMagMin = dom.byId("Mag1");
                var TextboxMagMax = dom.byId("Mag2");
                activarConsulta(TextboxMagMin,TextboxMagMax,check2);
            });
            on(dom.byId("Mag2"),"change", function (evt) {
                var check2 = dom.byId("consulta2");
                var TextboxMagMin = dom.byId("Mag1");
                var TextboxMagMax = dom.byId("Mag2");
                activarConsulta(TextboxMagMin,TextboxMagMax,check2);
            });

            on(dom.byId("Consulta"), "click", function (evt) {
                // Request the text file
                //var urlconsulta = "js/events.json";

                    var check1 = dom.byId("consulta1");
                    var check2 = dom.byId("consulta2");
                    var check3 = dom.byId("consulta3");

                    var TextboxfecIni = document.getElementsByName("fromDate")[0].value;
                    var TextboxfecFin = document.getElementsByName("toDate")[0].value;
                    var TextboxMagMin = dom.byId("Mag1").value;
                    var TextboxMagMax = dom.byId("Mag2").value;
                    var TextboxProfMin = dom.byId("Prof1").value;
                    var TextboxprofMax = dom.byId("Prof2").value;
					domAttr.set(dom.byId("resultadoFiltro"), 'style', 'display : block');
                    console.log(TextboxprofMax + TextboxProfMin);
                    if (check1.checked == false) {
                        TextboxfecIni = "";
                        TextboxfecFin = "";

                    }
                    if (check2.checked == false) {
                        TextboxMagMin = "";
                        TextboxMagMax = "";
                    }
                    if (check3.checked == false) {
                        TextboxProfMin = "";
                        TextboxprofMax = "";
                    }

                    if (check1.checked || check2.checked || check3.checked) {

                        var consulta2 = new ModConsulta({
                            urlJson: url_UltimoSismo,
                            magnitudMin: TextboxMagMin,
                            magnitudMax: TextboxMagMax,
                            profundidadMin: TextboxProfMin,
                            profundidadMax: TextboxprofMax,
                            fechaInicio: TextboxfecIni,
                            fechaFinal: TextboxfecFin
                        });
                        var datos2 = consulta2.searchByVal();
                        datos2.then(requestSucceededVal, requestFailedVal);
                        function homeextent(){
                            home.home();
                        }
                        setTimeout(homeextent,1000);
                    }
                    else
                        {
                            requestPhotos();
                        }
            });

            function activarConsulta(text1, text2, checkbox) {
                var btnBorrar= dom.byId("BorrarConsulta");
                var btnConsulta=dom.byId("Consulta");
                if (text1.value!="" && text2.value!="" && checkbox.checked==true){
                    domAttr.set(btnConsulta, 'style', 'display : block');
                    domAttr.set(btnBorrar, 'style', 'display : block'); 
                }
                else{
                    domAttr.set(btnConsulta, 'style', 'display : none');
                    domAttr.set(btnBorrar, 'style', 'display : none');
                    domAttr.set(dom.byId("resultadoFiltro"), 'style', 'display : none');
                }
            }


            on(dom.byId("BorrarConsulta"), "click", function (evt) {
                dom.byId("consulta1").checked=false;
                dom.byId("consulta2").checked=false;
                dom.byId("consulta3").checked=false;
				var consultaProfInput = dom.byId("consultaProfundidad");
  				domAttr.set(consultaProfInput, 'style', 'display : none');
				var consultaMagInput = dom.byId("consultaMagnitud");
  				domAttr.set(consultaMagInput, 'style', 'display : none');
  				var consultaFechaInput = dom.byId("consultaFecha");
				domAttr.set(consultaFechaInput, 'style', 'display : none');
				
                dom.byId("Mag1").value="";
                dom.byId("Mag2").value="";
                dom.byId("Prof1").value="";
                dom.byId("Prof2").value="";

                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd;
                }
                if(mm<10){
                    mm='0'+mm;
                }
                var todaystr = yyyy+'-'+mm+'-'+dd;


               //document.getElementsByName("fromDate")[0].value=todaystr;
               //document.getElementsByName("toDate")[0].value=null;

                var btnBorrar= dom.byId("BorrarConsulta");
                var btnConsulta=dom.byId("Consulta");

                var markCheckAll = function() {
                    registry.toArray().forEach(function(widget) {
                        
                        if(widget.type === 'datetextbox')
                        {
                            widget.set('value', null);
                            console.log("datetextbox");
                        }
                        else if (widget.type === 'checkbox')
                        {
                            widget.set('checked', false);
                            console.log("checkbox");
                        }

                    });
                };
                domAttr.set(btnConsulta, 'style', 'display : none');
                domAttr.set(btnBorrar, 'style', 'display : none');
                domAttr.set(dom.byId("resultadoFiltro"), 'style', 'display : none');


                markCheckAll();
                requestPhotos();
            });

            function actualizar () {

                var myTooltipDialog = new TooltipDialog({
                    id: 'myTooltipDialog',
                    style: "width: 300px;",
                    content: "<p>Sismos Actualizados</p>",

                });


                djpopup.open({
                    popup: myTooltipDialog,
                    around: dom.byId('actualizar'),
                });
                function cerrar() {
                    myTooltipDialog.destroy();
                }
                setInterval(cerrar,5000);
                requestPhotos();

            }
            // modificacion 12_08_2018 actualizar datos cada 5 minutos
            setInterval(actualizar,300000);

            // modificacion 12_08_2018 actualizar datos cada 5 minutos

            gsvc = new esri.tasks.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

            var template2 = new PopupTemplate({
                "title": "Estación de Monitoreo: {NOMBRE_ESTACION}",

                "fieldInfos": [
                    {
                        "fieldName": "ID_ESTACION",
                        "alias": "Identificacion Estación"
                    },
                    {
                        "fieldName": "NOMBRE_ESTACION",
                        "alias": "Nombre Estaciones"
                    },
                    {
                        "fieldName": "RED_MONITOREO",
                        "alias": "Red de Monitoreo"
                    },
                    {
                        "fieldName": "LATITUD",
                        "alias": "Latitud"
                    },
                    {
                        "fieldName": "LONGITUD",
                        "alias": "Longitud"
                    },
                    {
                        "fieldName": "ALTITUD",
                        "alias": "Elevacion"
                    },

                    {
                        "fieldName": "TIPO_ESTACION",
                        "alias": "Tipo Estación"
                    },
                    {
                        "fieldName": "TIPO_ALCANCE",
                        "alias": "Tipo Alcance"
                    },
                    {
                        "fieldName": "TIPO_ADQUISICION",
                        "alias": "Fecha_UTC"
                    },
                    {
                        "fieldName": "ESTADO",
                        "alias": "Estado"
                    },
                    {
                        "fieldName": "AGENCIA",
                        "alias": "Agencia"
                    },
                    {
                        "fieldName": "RED",
                        "alias": "Red"
                    },
                    {
                        "fieldName": "SUBRED",
                        "alias": "Subred"
                    },
                    {
                        "fieldName": "FECHA_INSTALACION",
                        "alias": "Fecha Instalación"
                    },
                    {
                        "fieldName": "FECHA_RETIRO",
                        "alias": "Fecha Retiro"
                    },
                    {
                        "fieldName": "DESCARGA",
                        "alias": "Descargar Archivo Excel"
                    }
                ],
                "description": "<B>Identificador Estación: </B> {ID_ESTACION}  " +
                "<br> <B>Latitud:</B> {LATITUD} " +
                "<br> <B>Longitud :</B> {LONGITUD}" +
                "<br> <B>Elevación :</B> {ALTITUD}" +
                "<br> <B>Tipo Estación :</B> {TIPO_ESTACION}" +
                "<br> <B>Fecha Instalación:</B> {FECHA_INSTALACION}" +
                "<br> <B>Tipo Adquisición :</B> {TIPO_ADQUISICION}" +
                "<br> <B>Agencia :</B> {AGENCIA}" +
                "<br>  <a href='{DESCARGA}'><B>Descargar Archivo Excel</B></a> "

                ,
            });
            
            var featureCollection3 = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            var featureCollection4 = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            var featureCollection5 = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            var featureCollection6 = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            var featureCollection7 = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            
            featureCollection3.layerDefinition = {
                "name": "Estaciones Sismológicas",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "ID",
                        "alias": "ID",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "RED_MONITOREO",
                        "type": "esriFieldTypeString",
                        "alias": "RED_MONITOREO"
                    },
                    {
                        "name": "NOMBRE_ESTACION",
                        "alias": "NOMBRE_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LONGITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ALTITUD",
                        "alias": "ALTITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ESTACION",
                        "alias": "TIPO_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ALCANCE",
                        "alias": "TIPO_ALCANCE",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ADQUISICION",
                        "alias": "TIPO_ADQUISICION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "AGENCIA",
                        "type": "esriFieldTypeString",
                        "alias": "AGENCIA"
                    },
                    {
                        "name": "RED",
                        "type": "esriFieldTypeString",
                        "alias": "RED"
                    },
                    {
                        "name": "SUBRED",
                        "type": "esriFieldTypeString",
                        "alias": "SUBRED"
                    },
                    {
                        "name": "FECHA_INSTALACION",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_INSTALACION"
                    },
                    {
                        "name": "FECHA_RETIRO",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_RETIRO"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "type": "esriPMS",
                            "url": "5bdecc80721b6f0df425d483f8a3d6e2",
                            "imageData": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAiZJREFUSIm1la9P61AUgD+ymikk2QRN5jEMtcqpBXAzoKqGwkxtqp1bwiBDIDqxMIEBQ7KHwDXBTNCEP2BpcitezcQMogmjT7zepmx73fYe76ie23vPd+75dRX+syibbHZdN68oSm53d9f5doAQYggchWGIEMJRVfXg2wBCiBpwlFgqCiFe14GsBHieVwzD0JT6x8cHiqIAFD3PK64K10pAGIY1ICeNX11dUa/XURSFMAwtIPUWqYDI+5rUR6MRNzc3aJqGpmnwO1THqqoO/wqQDM37+zsXFxcAXF5esr+/TzabBbCAzQFCiGMSiX1+fubt7Q0Ax3GwbZtKpQKQE0LUVFXtbXoDQ35MJhMajcaXn61Wi1KpxPb2NoAJrA+IyrIo9YeHB4Ig+LLH932enp44PT2VtzBVVTVXAlzXzQNxYsfjMe12e5kfNJtNyuUyOzs7AIbrur1CofAzFZDJZI6k95+fn/T7/aXGpdzf33N+fi7PGsDZHwFRWVpSdxyHu7u7VECn0+Hw8JBCoQBQ8zyvl2y+L4BkWQZBwPX1dapxKYPBANM02draWmi+GBB5H5elbdu8vLysBbi9vaVarbK3twdzIyQGJL2fTqcYhrFgKE0sy6Lb7S6MkGSIYu8fHx/xfX8jwHA45OTkRI6QvFxPAn5IiK7r6Lq+EWBOFpM8m83OMpnMK9Hk/EfjcVfHgKhB8lGy88tOriPzk3Wh0aLsr/3mrpJfZvXxHTU0dL0AAAAASUVORK5CYII=",
                            "contentType": "image/png",
                            "width": 18,
                            "height": 16,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0
                        },
                        "label": "",
                        "description": ""
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },
                "defaultVisibility": true,
                "extent": {
                    "xmin": -91.260009765625,
                    "ymin": 1.93011474609375,
                    "xmax": -72.47998046875,
                    "ymax": 24.4901123046875,
                    "spatialReference": {
                        "wkid": 4326,
                        "latestWkid": 4326
                    }
                },
                "hasAttachments": false,
                "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
                "displayField": "NOMBRE_ESTACION",
                "typeIdField": null,
            };
            featureCollection4.layerDefinition = {
                "name": "Estaciones de Acelerógrafos",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "ID",
                        "alias": "ID",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "RED_MONITOREO",
                        "type": "esriFieldTypeString",
                        "alias": "RED_MONITOREO"
                    },
                    {
                        "name": "NOMBRE_ESTACION",
                        "alias": "NOMBRE_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LONGITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ALTITUD",
                        "alias": "ALTITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ESTACION",
                        "alias": "TIPO_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ALCANCE",
                        "alias": "TIPO_ALCANCE",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ADQUISICION",
                        "alias": "TIPO_ADQUISICION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "AGENCIA",
                        "type": "esriFieldTypeString",
                        "alias": "AGENCIA"
                    },
                    {
                        "name": "RED",
                        "type": "esriFieldTypeString",
                        "alias": "RED"
                    },
                    {
                        "name": "SUBRED",
                        "type": "esriFieldTypeString",
                        "alias": "SUBRED"
                    },
                    {
                        "name": "FECHA_INSTALACION",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_INSTALACION"
                    },
                    {
                        "name": "FECHA_RETIRO",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_RETIRO"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "type": "esriPMS",
                            "url": "f965a7d330904f298c88cd9e8a8ee36f",
                            "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMVJREFUOI3t1M8JwyAUBvAvPKdIQcEVskZco2sUb1khWSG3pms4QUAwB7cQe4mSplCStPSUDzw8//x4epDhh2HLwjl3BVBuPVwUxcA5Ny+YtbYkojuAak8nMcabc+4hhFAZI6J6L7RIPU1TxTk36ZoqrbRti3EcNylN04AxhhijAmDYeoP3Hn3fb8aWecO+yYmd2D8xnya01tBa73VMxkIImoiuBxsyQoghY1JKb629zL+H+nh0BYUQulTkN5NSegDdPA7lCXotO+0PIc28AAAAAElFTkSuQmCC",
                            "contentType": "image/png",
                            "width": 14,
                            "height": 14,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0
                        },
                        "label": "",
                        "description": ""
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },
                "defaultVisibility": true,
                "extent": {
                    "xmin": -91.260009765625,
                    "ymin": 1.93011474609375,
                    "xmax": -72.47998046875,
                    "ymax": 24.4901123046875,
                    "spatialReference": {
                        "wkid": 4326,
                        "latestWkid": 4326
                    }
                },
                "hasAttachments": false,
                "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
                "displayField": "NOMBRE_ESTACION",
                "typeIdField": null,
            };
            featureCollection5.layerDefinition = {
                "name": "Estaciones Híbridas",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "ID",
                        "alias": "ID",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "RED_MONITOREO",
                        "type": "esriFieldTypeString",
                        "alias": "RED_MONITOREO"
                    },
                    {
                        "name": "NOMBRE_ESTACION",
                        "alias": "NOMBRE_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LONGITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ALTITUD",
                        "alias": "ALTITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ESTACION",
                        "alias": "TIPO_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ALCANCE",
                        "alias": "TIPO_ALCANCE",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ADQUISICION",
                        "alias": "TIPO_ADQUISICION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "AGENCIA",
                        "type": "esriFieldTypeString",
                        "alias": "AGENCIA"
                    },
                    {
                        "name": "RED",
                        "type": "esriFieldTypeString",
                        "alias": "RED"
                    },
                    {
                        "name": "SUBRED",
                        "type": "esriFieldTypeString",
                        "alias": "SUBRED"
                    },
                    {
                        "name": "FECHA_INSTALACION",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_INSTALACION"
                    },
                    {
                        "name": "FECHA_RETIRO",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_RETIRO"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "type": "esriPMS",
                            "url": "73e98c5d4082dcd049efd1d9c0eb23ed",
                            "imageData": "iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAWFJREFUSInN1rGOgkAQBuB/gw0llFcwCa9wVoYnMHf3CBYW3HNcZ0usNMTOzs7Kdzh6Cpoh0SewM4ZrXIKIsMORy001M1t82WxmMyP8UYz+JcTMIYDwVq6JaD04xMx7AG+V1oqZX4noczCoilwuF5zPZziOAwAhM8ME64TqyHK5RJqmWCwWcF3XGGuFmpAoispzCfYU6kIOh4MIa4S6kD7YA2SKSLE7SIpIsBJi5vc+SBuW5/na87ykfiM98YjjWITUsSiKYNs2iqJYARjXoZNOptMpdrsdsiwTY7PZDLZt6zLRSQldr9cvy7JCACAibDYbzOdzEbbdbhEEQVkrpcq/sIR83z/leT4uiuK7D1ZHAHzo97mDAMDzvKQP1oQQ0b7aeJgjKWaCNEISzBR5CplgEqQVasOOxyMmk4kx0gk9w4hIhBhBTZgUMYY0BkDdFpQXpdS+OieDQTokm8+voL7xA4/DNytZVwJHAAAAAElFTkSuQmCC",
                            "contentType": "image/png",
                            "width": 19,
                            "height": 19,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0
                        },
                        "label": "",
                        "description": ""
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },
                "defaultVisibility": true,
                "extent": {
                    "xmin": -91.260009765625,
                    "ymin": 1.93011474609375,
                    "xmax": -72.47998046875,
                    "ymax": 24.4901123046875,
                    "spatialReference": {
                        "wkid": 4326,
                        "latestWkid": 4326
                    }
                },
                "hasAttachments": false,
                "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
                "displayField": "NOMBRE_ESTACION",
                "typeIdField": null,
            };

            featureCollection6.layerDefinition = {
                "name": "Estaciones portátiles sismólogicas",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "ID",
                        "alias": "ID",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "RED_MONITOREO",
                        "type": "esriFieldTypeString",
                        "alias": "RED_MONITOREO"
                    },
                    {
                        "name": "NOMBRE_ESTACION",
                        "alias": "NOMBRE_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LONGITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ALTITUD",
                        "alias": "ALTITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ESTACION",
                        "alias": "TIPO_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ALCANCE",
                        "alias": "TIPO_ALCANCE",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ADQUISICION",
                        "alias": "TIPO_ADQUISICION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "AGENCIA",
                        "type": "esriFieldTypeString",
                        "alias": "AGENCIA"
                    },
                    {
                        "name": "RED",
                        "type": "esriFieldTypeString",
                        "alias": "RED"
                    },
                    {
                        "name": "SUBRED",
                        "type": "esriFieldTypeString",
                        "alias": "SUBRED"
                    },
                    {
                        "name": "FECHA_INSTALACION",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_INSTALACION"
                    },
                    {
                        "name": "FECHA_RETIRO",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_RETIRO"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "type": "esriPMS",
                            "url": "51dafbbf524c89e7456e2b67636c4af7",
                            "imageData": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAjRJREFUSIm1lc9LFFEcwD/tTFQEFYTFruGLTcLAiJjyEAUFHZUu3qPLeukP6Lb7b+ipu2WUUUGHoAI7uEHuJib03DcubmulLYqp68zr0LxxdLf9UfY9zffNm+/n+3ts/rPY7VyWUiZs2453dXVl9xyglBoH+rXWKKWyQohLewZQSqWA/siRo5SabAXSFOC6rqO1zhjd87ewYjaA47qu0yxdTQFa6xQQB/B9j7f5+1zrvUMsZqG1HgYaRtEQEHifMrosZSlXJpGlC3R3XobfqRoQQoz/FSCamo3qT3JqFIC8eoA4eZ799kGAYaB9gFJqgEhhZ9Rrqt4KAJtehU/FCXpP3wCIK6VSQoiRdiNIm4eVte/Mfnm84+VM8RFn4g6HDhwByACtA4K2dIyem3uB1v6OO77eZFq9wjl7y0SREUJkmgKklAkgLOzicoHi0pt6fvC5/JzuziscPdwBkJZSjiSTyYWGAMuy+o33Wvt8kGN1jW9H94yrvbfNt2lg6I+AoC2Hja7KOZbXZhsCFpYnWPxxnRPHBEDKdd2R6PDtAETbcsvbYKow2tC4kam5J9y8eBfYVzN8ISDwPmzL2fl3rFe/tQRYWv1I8esMpzrOwa4VEgKi3q+tV5guPmzJ+HYUYySO36tZIdEUhd7nCy/x9WZbgNWNeWTpvVkhCXMeBTw1kL6eQfp6BtsC7JLaInueN2RZ1iTB5vxH4+FUh4BgQBJBsRP1vmxFdm/WmkELqt/yP7eZ/AL5SwOZpoM4xwAAAABJRU5ErkJggg==",
                            "contentType": "image/png",
                            "width": 13,
                            "height": 13,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0
                        },
                        "label": "",
                        "description": ""
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },
                "defaultVisibility": true,
                "extent": {
                    "xmin": -91.260009765625,
                    "ymin": 1.93011474609375,
                    "xmax": -72.47998046875,
                    "ymax": 24.4901123046875,
                    "spatialReference": {
                        "wkid": 4326,
                        "latestWkid": 4326
                    }
                },
                "hasAttachments": false,
                "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
                "displayField": "NOMBRE_ESTACION",
                "typeIdField": null,
            };

            featureCollection7.layerDefinition = {
                "name": "Estaciones portátiles acelerográficas",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "ID",
                        "alias": "ID",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "RED_MONITOREO",
                        "type": "esriFieldTypeString",
                        "alias": "RED_MONITOREO"
                    },
                    {
                        "name": "NOMBRE_ESTACION",
                        "alias": "NOMBRE_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LONGITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ALTITUD",
                        "alias": "ALTITUD",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ESTACION",
                        "alias": "TIPO_ESTACION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ALCANCE",
                        "alias": "TIPO_ALCANCE",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "TIPO_ADQUISICION",
                        "alias": "TIPO_ADQUISICION",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "AGENCIA",
                        "type": "esriFieldTypeString",
                        "alias": "AGENCIA"
                    },
                    {
                        "name": "RED",
                        "type": "esriFieldTypeString",
                        "alias": "RED"
                    },
                    {
                        "name": "SUBRED",
                        "type": "esriFieldTypeString",
                        "alias": "SUBRED"
                    },
                    {
                        "name": "FECHA_INSTALACION",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_INSTALACION"
                    },
                    {
                        "name": "FECHA_RETIRO",
                        "type": "esriFieldTypeString",
                        "alias": "FECHA_RETIRO"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "type": "esriPMS",
                            "url": "54c9860cf9c265bea002502c3611ed36",
                            "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAANFJREFUOI3t1D8KwjAUBvCvfT1FhQRyA+kVdLPX6ObkAcRr9AAewHoGt6yOgRTp5iCi6BDi0oa2grRVnPpBhpc/P14yJMAPE9QLrXUCIOx62PO8jDEmG5hSKiSiHYCoTyfW2rXWes85jx1GRIu+UC2LPM8jxpisrhlXK4fjFtfbqZMyj1bwfYK1NgYgg/aG+/OMy0N1wixso37DvsmIjdg/saKamE2XQxzpMGPMhoiSgQ1JznnmMCFEoZSalL9H/PFoCzLGpFXh3kwIUQBIyzEoL6TJOx+SMPaPAAAAAElFTkSuQmCC",
                            "contentType": "image/png",
                            "width": 17,
                            "height": 16,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0
                        },
                        "label": "",
                        "description": ""
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },
                "defaultVisibility": true,
                "extent": {
                    "xmin": -91.260009765625,
                    "ymin": 1.93011474609375,
                    "xmax": -72.47998046875,
                    "ymax": 24.4901123046875,
                    "spatialReference": {
                        "wkid": 4326,
                        "latestWkid": 4326
                    }
                },
                "hasAttachments": false,
                "htmlPopupType": "esriServerHTMLPopupTypeAsHTMLText",
                "displayField": "NOMBRE_ESTACION",
                "typeIdField": null,
            };

            var FeatureLayerEstacionesPortatilesAcelerograficas = new FeatureLayer(featureCollection7,
                {
                    id: 'PortatilAcelerograficas',
                    infoTemplate: template2,
                    visible: false
                }
            );


            var FeatureLayerEstacionesPortatilesSismologicas = new FeatureLayer(featureCollection6,
                {
                    id: 'PortatilSismologica',
                    infoTemplate: template2,
                    visible: false
                }
            );

            var FeatureLayerEstacionesHibridas = new FeatureLayer(featureCollection5,
                {
                    id: 'Hibridas',
                    infoTemplate: template2,
                    visible: false
                }
            );

            var FeatureLayerEstacionesAcelerometros = new FeatureLayer(featureCollection4,
                {
                    id: 'Acelerometros',
                    infoTemplate: template2,
                    visible: false
                }
            );
            var FeatureLayerEstacionessismologicas = new FeatureLayer(featureCollection3,
                {
                    id: 'Sismologicas',
                    infoTemplate: template2,
                    visible: false
                }
            );
            console.log("template 5");

            ///fin estaciones***************************
            
            
            var featureCollection = {
                "layerDefinition": null,
                "featureSet": {
                    "features": [],
                    "geometryType": "esriGeometryPoint"
                }
            };
            featureCollection.layerDefinition = {
                "name": "	Últimos Sismos",
                "geometryType": "esriGeometryPoint",
                "objectIdField": "ObjectID",
                "defaultVisibility": true,
                "fields": [
                    {
                        "name": "ObjectID",
                        "alias": "ObjectID",
                        "type": "esriFieldTypeOID"
                    },
                    {
                        "name": "EVENTO",
                        "alias": "Identificador",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "DESCRIPCION",
                        "type": "esriFieldTypeString",
                        "alias": "Localizacion"
                    },
                    {
                        "name": "LATITUD",
                        "alias": "LAT",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "LONGITUD",
                        "alias": "LON",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "FECHA",
                        "alias": "Fecha",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "FECHAUTC",
                        "alias": "FECHA UTC",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "MAGNITUD",
                        "type": "esriFieldTypeDouble",
                        "alias": "Magnitud"
                    },
                    {
                        "name": "MAGNITUDTEXT",
                        "type": "esriFieldTypeString",
                        "alias": "Magnitud"
                    },
                    {
                        "name": "UNION",
                        "type": "esriFieldTypeString",
                        "alias": "Descripción"
                    },
                    {
                        "name": "PROFUNDIDAD",
                        "alias": "Profundidad",
                        "type": "esriFieldTypeString"
                    },
                    {
                        "name": "PROFUNDIDADSIM",
                        "alias": "Profundidad",
                        "type": "esriFieldTypeDouble"
                    },
                    {
                        "name": "PROFUNDIDADTEXT",
                        "alias": "esriFieldTypeString",
                        "type": "esriFieldTypeStri"
                    },
                    {
                        "name": "ESTADO",
                        "type": "esriFieldTypeString",
                        "alias": "ESTADO"
                    },
                    {
                        "name": "LOCALIZACION",
                        "type": "esriFieldTypeString",
                        "alias": "LOCALIZACION"
                    },
                    {
                        "name": "SHAKEMAP",
                        "type": "esriFieldTypeString",
                        "alias": "INTENSIDAD"
                    },
                ],
                "drawingInfo": {
                    "renderer": {
                        "type": "classBreaks",
                        "field": "PROFUNDIDADSIM",
                        "label": "My Label",
                        "classificationMethod": "esriClassifyManual",
                        "minValue": 0,
                        "visualVariables": [
                            {
                                "type": "sizeInfo",
                                "field": "MAGNITUD",
                                "minDataValue": 0.2,
                                "maxDataValue": 9.1,
                                "valueUnit": "unknown",
                                "minSize": {
                                    "type": "sizeInfo",
                                    "expression": "view.scale",
                                    "stops": [
                                        {"value": 2, "size": 32},
                                        {"value": 4, "size": 26},
                                        {"value": 6, "size": 14},
                                        {"value": 8, "size": 6},
                                        {"value": 9, "size": 2},
                                    ]
                                },

                                "maxSize": {
                                    "type": "sizeInfo",
                                    "expression": "view.scale",
                                    "stops": [
                                        {"value": 2, "size": 120},
                                        {"value": 4, "size": 95},
                                        {"value": 6, "size": 65},
                                        {"value": 8, "size": 50},
                                        {"value": 9, "size": 30},

                                    ]
                                }
                            }],
                        "classBreakInfos": [
                            {
                                "symbol": {
                                    "type": "esriPMS",
                                    "url": "23216a9b12c5ea929a1a7f0956174fda",
                                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAb1JREFUOI2t1E1LlFEUAOBHky41tGhahEIUQQVCELlwUYsWkRGBk2FS4CIiKFrYoi8pWoRRgZvoH5jVylr0ZQVBf6CgFmnYwojGjRMERUc0WsyMTuIwDnTg5R7ufd+Hc+7lvk3+YzTVWF+fUmqNiExKaToi3uNnvdhhnEd7RIDSOIMn2Wx2oFAovKuFZTCMXC9OYltpMvCFlY/oulYo5HAV16thKzCCjvvoXrSYQRY7cIDGHgamUloVEVeWwi6iYwhHq/RejnY8RFvE5ZTSm4h4VYmtw6VOHKkBlWMnbqMv4gb+wXqw5jTSMjHoRB9tzc3N2/P5/Icytgu21AHBBmzEZD6/G/NYC6yuE2tUPJCplFoiYr7NWfhdJ/YHY4iIGRb2bAJ7J7CpDiyP8WL6uRJ7iVND2KP2HSvHi+Iwh9eV2OOU0qe7EVu7kFsGNI4TxXQEU5XYbEScxdNDNIxiHxqqQB9xvJj+wIXyfGVHz9GPm/txDr3YbOFufsMozhTf/5VS6o6IyaUwuIWvuDPI2sEqlaWUxjKZzLHFf46l9voenpUKOIjWUnHTeIsHETEcEXOLP6x2cN8xUHqWHX8BbsCHV1UPafMAAAAASUVORK5CYII=",
                                    "contentType": "image/png",
                                    "width": 14,
                                    "height": 14,
                                    "angle": 0,
                                    "xoffset": 0,
                                    "yoffset": 0
                                },
                                "classMaxValue": 30,
                                "label": "0 - 30",
                                "description": ""
                            },
                            {
                                "symbol": {
                                    "type": "esriPMS",
                                    "url": "ceb321b63dfbddc2e25640cf2abbf6e8",
                                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAfBJREFUOI2t1MFLVFEUB+DPzC45tNAWMS5qkbQIJMFFUK2sCEliSGSgzcwybOOmMotWZgXtIqH9RIm0KgtKhP6BgtqEGhIIM5smCAqPVLSYrCnGVOgHlwfv3vdx3+Hes9V/zNZ15nellPZHRCal9CEiXuPzZrEBnMfBiAA/nyt43N7ePlatVl+th2VQQm5wkEKBzk5aW4lgacm26Wmnb92q5nAV19bCmvEQJ+7e5dQpWlp+T7a20tZGVxfHj9tSLBqrVtP2iLjSCLuIE3fuMDCwVlVq6emhVOLo0bicUnoREc/rsZ0Y6esjl/s3tJoDBxgfZ3Q0ruMPLI8dxSIpbQyDvj5GR/Vks9mucrn8ZhU7DHv3bhyCjg6yWcrl8hH8wjqoFXkzaW6mu5tqNXVExK/f/ArLy5vDvn9nfp6IWOF3zRZwbHGR3bs3jlUqLCyAd/XYM5x98IBDh/48X//K7Cz4htl67FFKaW5qKvb193Py5PrQ/DzDw6gd9Eo99jUihjFdKGianKS3l6amxtDcHEND4BMurL6vvwFPcQk38vna4nyePXvIZGp3s1JhZoaREfAlpTQYEe8bYXATS7g9MaFtYqLxzlJKbzOZzJm/O0ejFnQPT3AO/div1k0+4CXuR0QpIr79/eFa/ewjxn6ODecHomeiluOmw9EAAAAASUVORK5CYII=",
                                    "contentType": "image/png",
                                    "width": 14,
                                    "height": 14,
                                    "angle": 0,
                                    "xoffset": 0,
                                    "yoffset": 0
                                },
                                "classMaxValue": 70,
                                "label": "30-70",
                                "description": ""
                            },
                            {
                                "symbol": {
                                    "type": "esriPMS",
                                    "url": "313c819b882a7cc1be8451e11214d827",
                                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAbdJREFUOI2t1M9LlEEYB/CPJg21dGg7xApRBBUIgeTBQx06REYEmmFS4CEiKDrYoZ8UHcKowEv0H5jVqTr0ywqC/oGCOqRhByPavbhBUPSIRod2dZNd1oW+MLwww/uZeWbeeVv8x7TUGV+bUmqLiExKaToi3uFHo9gBnEFnRIDScwaPs9nsULFYfFsPy2AUPQZwDFtKvYHPlnuot3il2IPLuFoLW4b76HIXfYtGM8iiHXs16zeUCmlFRFyqhp1DlxEcqlF8OZ14QHTExZTS64h4WYmtwXndOFgHKmcbbhKDcQ3/YP1Y5QTSEjHoxqCOXC63NZ/Pvy9j28GmBiBYh/Xkp/I7MI+1gpUNYs1oJxVSa0TMlzkLfjWI/cY4ETHDwp5NYpdJbGgAy2MCfKrEXuC4EexU/5KV8xzM4VUl9iil9DFux2a96FkCNIGj+PuhFyqx2Yg4hSf2azKG3WiqAX3AEfAdZ8vdlQU9wwVctwenMYCNFu7mV4zhJPiZUuqLiKlqGNzAF9wybLXh6gtLKY1nMpnDi/8c1bb6Dp6W5t+HttLapvEG9yJiNCLmFr9Y69y+YajUlpw/U6mHV4KFmE8AAAAASUVORK5CYII=",
                                    "contentType": "image/png",
                                    "width": 14,
                                    "height": 14,
                                    "angle": 0,
                                    "xoffset": 0,
                                    "yoffset": 0
                                },
                                "classMaxValue": 120,
                                "label": "70 - 120",
                                "description": ""
                            },
                            {
                                "symbol": {
                                    "type": "esriPMS",
                                    "url": "03ba13814a4a9e20c0b753e9f335c5c9",
                                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAbtJREFUOI2t1M2LjVEYAPDfjMmJm4VroZkSKdSUmsxiFiwshKSM0ZgoC0mRxVj4mshCI9Rs5D9gsMLCN6X8AxQLM2IxkjubuUqRZ5qRxXvvzHW7tzu3PPX21Dm9v+c85z3nbfMfo63B/MqUUmdE5FJKUxHxDj+bxfbhNHoiApTyNB7l8/nhYrH4thGWwyh6OYSj2FAaDnxZzIO+YvFSLy7icj1sEe5hB3fQXzWdQx5d2NXKwHBKk0si4kIt7GwG3cSBOt2Xowf3RXSfTym9joiXldgKnGMP9jeAyrEJ10UMXsE/2ACWcRxpgRhZ8cHu9vb2jYVC4X0Z25yldU1AsAqrFQoTWzCHdWRpaZNYK7qkNNkREXNtzmTpd5PYH4yJiGnm9+wTtmVpTRNYAePwuRJ7gWPZsdiq8S0rx3OYxatK7GFK6WPErfX0oXcB0DiOkB30yUpsJiJO4jF7W3iG7WipA33AYfiBM+XRyn6eYghX2YlTsvu51vzd/CYrdAJ+pZT6I2KiFgbX8BU3GFnOSM11pZTGcrncweo/R62dvo0npfK70Vla2hTe4G5EjEbEbPWL9T7bdwyXngXHXziSh1dZPICBAAAAAElFTkSuQmCC",
                                    "contentType": "image/png",
                                    "width": 14,
                                    "height": 14,
                                    "angle": 0,
                                    "xoffset": 0,
                                    "yoffset": 0
                                },
                                "classMaxValue": 180,
                                "label": "120 - 180",
                                "description": ""
                            },
                            {
                                "symbol": {
                                    "type": "esriPMS",
                                    "url": "8ab3a757c7ae021ba71612a36c97f010",
                                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAghJREFUOI2t1FtrFEYUAOAvJjrGRcQVKglSRTAWJSCKBPGGYElLCrl4aVVEELGFUjCCl6IoYmwVxH3oD6iFhOZBQdB4BcUXhT60oC9RDBorbqAkQkHpCRr6YBI3sjEJeGAYmGE+Zg5zTpmPGGVj7M9OKS2KiExKqTci7uHlRLEN2IeaiACDcz8uZbPZlr6+vr/GwjJoRUOtbRrtNk+VqTL6hR5Pp9xyoenXvuMNOIITo2GlOI/aY1qtt1GZycOb5TJmyFpoiZW+nLTflpaXqac8Ig4Xww6g9oizvrBltLSAajVyztkRyw+llG5HxI1CbBYOrlbvc5s/CA3FZ5ZqlpOL5p8xAvsa05t8a4o0LgzWqpfTvKyioqI6n8/fH8JWwqcWjBuCT8yRNVc+370Kw1gllJs2IaxUqcWW+CP1VEbE8DNfQ/hvQtiAAU91ioh+3uXsEdb/rUuleePGeuV1ewBdhdh1fNfhN8usGfG/PhR3XIc3uFmIXUwpPbwWbVXrNFqncUzoiQd+sou3H72nEHsdEXvQcdDGkpwOK9QqUVIUeqzTUTvhX+wfWi+sgCv4ESeb1fnGXnW2m2O+8sHa/Mdzd1112g/wKqW0KSK6i2FwCs/wS7szM9udKXqzlFJnJpPZ+n7nKNaC2nAZ3+MrLPK2m/TiT/weEa0R8eb9g6P1sxdoGRzjjv8BhG6idxpZl/cAAAAASUVORK5CYII=",
                                    "contentType": "image/png",
                                    "width": 14,
                                    "height": 14,
                                    "angle": 0,
                                    "xoffset": 0,
                                    "yoffset": 0
                                },
                                "classMaxValue": 9999,
                                "label": ">180",
                                "description": ""
                            }
                        ]
                    },
                    "transparency": 0,
                    "labelingInfo": null
                },

            };
            var myFeatureLayer = new FeatureLayer(featureCollection, {
                id: 'EventosSismicos',
                infoTemplate: template
            });


            var symbolSelect =  new PictureMarkerSymbol(
                {
                    "type": "esriPMS",
                    "url": "1eb582f2c969a716d09aa914a0e43eb2",
                    "imageData": "iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAABJ1JREFUWIXVl1+IVXUQxz9zsQZXCrz5p30pBRX0oYdK8M+SYKBFpoutrrhJvdT2KLhKqJFRZqQiUg+6gVK6ULqWilIZlYZiKPXgg4GKf3pJQo6guTEEd3o4c3Z/e/fedZUiG7ic35nfzPy+d2Z+M3OGcY/QsP8aQEH/XyCu2uQwX8ymAxOBkbF1HTjvqicFDorZ8X8FiEMzqu9iNllqi4wFxopZE7DSVc9itlrgwD8CxGEc0AXMwGyouMFsCrDf4QTQJnDlroG46lOY7QNGVW39CRxx1TNi9lvINorZY8AcYHgiOxM47aoLBwtXXSCuOguzb4D7EvZVYB2wS6Cnn4di7dAALAu5h2N3NGbfuurT9cDUBOIwHrPuFIRDl0C7wK164AEEeoDtDrsdOgWWxtb9mH3uMLVWmOp5pIskHK76TsnsjQTUg0Ar8AzwSLAvA18CewVuBuC2iuolMVsTMqPDdtNtgTi0ANOT964qEC8DGxmYN0+S625w6BDYBVAyW1uB8YlnZjo0C+yvC8RBUF2fxP6qQHvxUlHdgNnrVQAq8SzFcwzwSUV1UvEHBF4FZlPkTF4G6gMhT9BJCefNIiccXkpBOOyRcnkTWfYzAOXyE2TZyvAKYrbW4ZzkiX3L8+TdBoDZZFdtShO32iPzkmLVQ7jX4QHg/UR0eQm2kmV9nCw7BSxyWAFsCu4mhy8E/ghbW4ir7TAfqA0kynZBRySvFwCLyV2Ow54SbC2A0xe6bQKHBTY7TAvPjAndHQI9DkeABTXOGpCsE3q9o3omyZVne8GWy5vJMhyeBw4muvPCo4cplzeSZS2J7o7CppgtCP7EwYAUDYyiYgY9Gs8KWfZTrNsZSK8Bh0OmQp7A4+rYHJkq3rNjwHWKXFBtTELzK3mdKFEuP06WnQY+Ap6r0t8OEDKlRJfCpvTZvD4YkAsFkGhgBX0NLATwLFsBLBE44NAMvFKAEDgUMh3J7fuqWFTZPF8XiKueFLMZ8TrHYXjcnE+B9cAogVaH4wIfxqzRb95wWE5+UwCuAZ8Fv4G8M/eelTbN/tc3/0cr4rXoop0CNxxWEdkPfFCBprhBvQUtvLU4MdkhcCPWy0jGA+l/46pCY3YM1XNJdV0XXfeWwM6K6hQx6whDrWRZK0WJz7JSOrm56nsls4/DGyPIK2tOqr9UjwPVHnHPO+XeYDV6noAvApTMVjqcJa+yRdMr0Z9+B1YVIAJIp/TNJmC2ukpn4PUV6Hb4kbw6ItHKkwa202EfsASYS98YcIV8DNgjcLOwV1F9W8yWJkecqO68NYEEtQGngIcgb2DRytsjTDeAzvjVJIcRDtvFrC1hXyO8OyQgAhdddRFmRwoZycHNji66OyaxWgAa4rC3+oUD/kL1BTG7PGQgAGL2vavOxWwvUA52I3nObPHBh+eGKnPXUG0Rsx/qnTdoiRez7xymko9305KtBqBZzJoT2XpmTgJtYnZpsLNu22sELgLTHVpiept0Ox2AKANrBLqHIj7kpifQ7Wb7UJ3lMC/miQn0/+S8EJ+chzA7JuBDtX9H3VfAMTsKHK0rdCdfg3cL5N+kewbI33dQ3MBPYQOaAAAAAElFTkSuQmCC",
                    "contentType": "image/png",
                    "width": 30,
                    "height": 30,
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 0
                }
            );

            myFeatureLayer.setSelectionSymbol(symbolSelect);
            function requestPhotos() {
                var consulta = new ModConsulta({urlJson: url_UltimoSismo});
                var datos = consulta.searchByLoc();
                datos.then(requestSucceeded, requestFailed);
                function homeextent(){
                    home.home();
                }
                setTimeout(homeextent,1000);
                console.log("Actualizando Datos");

            }



            function requestSucceeded(resultados) {

                myFeatureLayer.clear();
                console.log(resultados);
                myFeatureLayer.applyEdits(resultados, null, null);
                myFeatureTable.refresh();


            }

            function requestFailed(error) {
                console.log('fallo'+ error);
            }
            
            function requestSucceededVal(resultados) {

                myFeatureLayer.clear();
                console.log(resultados);
                myFeatureLayer.applyEdits(resultados, null, null);
                myFeatureTable.refresh();
            }

            function requestFailedVal(error) {
                console.log('fallo'+ error);

            }
            requestPhotos();
            
            var mapExtentChange = map.on("extent-change", changeHandler);
            
            function changeHandler(evt) {
                try {
                    var oidFld = myFeatureLayer.objectIdField;
                    var query2 = new Query();
                    query2.geometry = evt.extent;
                    //query2.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
                    myFeatureLayer.queryIds(query2, lang.hitch(this, function (objectIds) {
                        myFeatureTable.selectedRowIds = objectIds;
                        myFeatureTable._showSelectedRecords();

                    }));
                }
                catch(error) { }
                console.log("ventana oculta");
                //map.infoWindow.show();
                console.log("cambio Extent");
            }

            map.on("layers-add-result", function (results) {

            });
            function encode_utf8(s) {
                return s.replace("Ã‘", "Ñ").replace("Ã¡", "ó").replace("Ã", "Á").replace("Ã“", "Ó").replace("Ã‰", "É").replace("Ã", "Í")
                    .replace("Ã, ", "Á,").replace("Ã“, ", "Ó,").replace("Ã", "Í");
            }

            //set a selection symbol for the featurelayer.
            //layer Limite Maritimo
            var FeatureLayerLimiteMaritimo = new LimiteMaritimoLayer().returnLayer();
            
            map.addLayer(myFeatureLayer);

            map.addLayer(FeatureLayerEstacionesAcelerometros);
            map.addLayer(FeatureLayerEstacionesHibridas);
            map.addLayer(FeatureLayerEstacionessismologicas);
            map.addLayer(FeatureLayerEstacionesPortatilesSismologicas);
            map.addLayer(FeatureLayerEstacionesPortatilesAcelerograficas);
            map.addLayer(FeatureLayerLimiteMaritimo);

            console.log("layerMaritimo" +FeatureLayerLimiteMaritimo.name);

            var estacionesLayerSismologica = new Estaciones({urlJson: url_Sismologicas});
            var estacionesArreglosimologica = estacionesLayerSismologica.searchByLoc();
            estacionesArreglosimologica.then(requestSucceededEstacionesSismologicas, requestFailedEstacionesSismologicas);

            var estacionesLayerAcerografos = new Estaciones({urlJson: url_Acelerografos});
            var estacionesArregloAcelerogarfo = estacionesLayerAcerografos.searchByLoc();
            estacionesArregloAcelerogarfo.then(requestSucceededEstacionesAcelerografos, requestFailedEstacionesAcelerografos);

            var estacionesLayerHibridas = new Estaciones({urlJson: url_hibridas});
            var estacionesArregloHibridas = estacionesLayerHibridas.searchByLoc();
            estacionesArregloHibridas.then(requestSucceededEstacionesHibridas, requestFailedEstacionesHibridas);

            var estacionesLayerPortatilesAcelerograficas = new Estaciones({urlJson: url_Estaciones_portatiles_acelerograficas});
            var estacionesArregloPortatilesAcelerograficas = estacionesLayerPortatilesAcelerograficas.searchByLoc();
            estacionesArregloPortatilesAcelerograficas.then(requestSucceededEstacionesPortatilesAcelerograficas, requestFailedEstacionesPortatilesAcelerograficas);

            var estacionesLayerPortatilesSismologicas = new Estaciones({urlJson: url_Estaciones_portatiles_simologicas});
            var estacionesArregloPortatilesSismologicas = estacionesLayerPortatilesSismologicas.searchByLoc();
            estacionesArregloPortatilesSismologicas.then(requestSucceededEstacionesPortatilesSismologicas, requestFailedEstacionesPortatilesSismologicas);



            function requestSucceededEstacionesPortatilesAcelerograficas(resultados) {
                FeatureLayerEstacionesPortatilesAcelerograficas.applyEdits(resultados, null, null);
                console.log("Layer devuelto exitosamente");
            }
            function requestFailedEstacionesPortatilesAcelerograficas(error) {
                console.log('failed' + error);
            }

            function requestSucceededEstacionesPortatilesSismologicas(resultados) {
                FeatureLayerEstacionesPortatilesSismologicas.applyEdits(resultados, null, null);
                console.log("Layer devuelto exitosamente");
            }
            function requestFailedEstacionesPortatilesSismologicas(error) {
                console.log('failed' + error);
            }

            function requestSucceededEstacionesSismologicas(resultados) {
                FeatureLayerEstacionessismologicas.applyEdits(resultados, null, null);
                console.log("Layer devuelto exitosamente");
            }
            function requestFailedEstacionesSismologicas(error) {
                console.log('failed' + error);
            }
            function requestSucceededEstacionesAcelerografos(resultados) {
                FeatureLayerEstacionesAcelerometros.applyEdits(resultados, null, null);
                console.log("Layer devuelto exitosamente");
            }
            function requestFailedEstacionesAcelerografos(error) {
                console.log('failed' + error);
            }
            function requestSucceededEstacionesHibridas(resultados) {
                FeatureLayerEstacionesHibridas.applyEdits(resultados, null, null);
                console.log("Layer devuelto exitosamente");
            }
            function requestFailedEstacionesHibridas(error) {
                console.log('failed' + error);
            }

            var gp = new Geoprocessor("https://srvags.sgc.gov.co/arcgis/rest/services/PortalSismos/ExportarKMZ/GPServer/EXPORTOKMZ");
            var gp2 = new Geoprocessor("https://srvags.sgc.gov.co/arcgis/rest/services/PortalSismos/EXPORTOXLS/GPServer/EXPORTOXLS");

            function exportToKml(evt) {
                var params = {
                    "Layer": myFeatureLayer,
                };
                //cleanup();
                gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);

            }

            function gpJobComplete(jobinfo){
                console.log("Descargando");
                //get the result map service layer and add to map
                gp.getResultData(jobinfo.jobId, "KMZ",downloadResult);


            }
            function gpJobStatus(jobinfo){
                var jobstatus = '';
                switch (jobinfo.jobStatus) {
                    case 'esriJobSubmitted':
                        jobstatus = 'Entregado...';
                        break;
                    case 'esriJobExecuting':
                        jobstatus = 'EJecutando...';
                        break;
                    case 'esriJobSucceeded':
                        jobstatus = 'Completado...';
                        break;
                }
                console.log(jobstatus);
            }
            function gpJobFailed(error){
                console.log(error);
            }
            function downloadResult(result) {
                var encodedUri = encodeURI(result.value);
                var link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', "KMZ.kmz");
                link.click();
            }
            
            //export xls

            function exportToXls(evt) {
                var params = {
                    "Layer": myFeatureLayer,
                };
                //cleanup();
                gp2.submitJob(params, gpJobComplete2, gpJobStatus2, gpJobFailed2);

            }

            function gpJobComplete2(jobinfo){
                console.log("Descargando");
                //get the result map service layer and add to map
                gp2.getResultData(jobinfo.jobId, "KMZ",downloadResult2);


            }

            function gpJobStatus2(jobinfo){
                var jobstatus = '';
                switch (jobinfo.jobStatus) {
                    case 'esriJobSubmitted':
                        jobstatus = 'Entregado...';
                        break;
                    case 'esriJobExecuting':
                        jobstatus = 'EJecutando...';
                        break;
                    case 'esriJobSucceeded':
                        jobstatus = 'Completado...';
                        break;
                }
                console.log(jobstatus);
            }
            function gpJobFailed2(error){
                console.log(error);
            }
            function downloadResult2(result) 
            {
                var encodedUri = encodeURI(result.value);
                console.log("Iniciando Descarga: "+ result.value);
                var link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', "XLS.xls");
                link.click();
            }

			map.infoWindow.set("popupWindow", false);
            //initializeSidebar(map);
            //create new FeatureTable and set its properties
            var myFeatureTable = new FeatureTable({
                featureLayer: myFeatureLayer,
                syncSelection: false,
                map: map,
                editable: false,
                showGridHeader: true,
                showFeatureCount: false,
                dateOptions: {
                    datePattern: 'M/d/y',
                    timeEnabled: true,
                    timePattern: 'H:mm',
                },
                gridOptions : {
                    noDataMessage: "Sin Datos",
                    allowSelectAll: false,
                    cellNavigation: false,
                    selectionMode: "extended",
                    pagination: false,
                    allowTextSelection: true,
                    pageSizeOptions: [10, 25, 50],
                    columnHider: true,
                    columnResizer: true,
                    pagingDelay: 300,
                },
                //use fieldInfos object to change field's label (column header),
                //change the editability of the field, and to format how field values are displayed
                //you will not be able to edit callnumber field in this example.
                fieldInfos: [
                    {
                        name: "ObjectID",
                        alias: "ObjectID",
                        visible: false,
                    },
                    {
                        name: "EVENTO",
                        alias: "EVENTO",
                        visible: false,
                    },
                    {
                        name: "FECHA",
                        alias: "FECHA",
                        visible: false,
                    },
                    {
                        name: "FECHAUTC",
                        alias: "FECHA_UTC",
                        visible: false,

                    },
                    {
                        name: "MAGNITUD",
                        alias: "Mag",
                        visible: false,

                    },
                    {
                        name: "MAGNITUDTEXT",
                        alias: "Mag",
                        visible: true,

                    },
                    {
                        name: "UNION",
                        alias: "Descripción",
                        visible: true,


                    },
                    {
                        name: "PROFUNDIDAD",
                        alias: "Prof",
                        visible: true,

                    },
                   
                    {
                        name: "PROFUNDIDADSIM",
                        alias: "PROFUNDIDADSIM",
                        visible: false,

                    },
                    {
                        name: "DESCRIPCION",
                        alias: "DESCRIPCIÓN",
                        visible: false,

                    },
                    {
                        name: "LATITUD",
                        alias: "LAT",
                        visible: false,

                    },
                    {
                        name: "LONGITUD",
                        alias: "LON",
                        visible: false,

                    },
                    {
                        name: "SHAKEMAP",
                        alias: "INTENSIDAD",
                        visible: false,

                    },


                    {
                        name: "LOCALIZACION",
                        alias: "LOCALIZACION",
                        visible: false,

                    },
                    {
                        name: "ESTADO",
                        alias: "ESTADO",
                        visible: false,

                    },
                    {
                        name: "PROFUNDIDADTEXT",
                        alias: "Prof",
                        visible: false,

                    },
                ],
               //add custom menu functions to the 'Options' drop-down Menu
                menuFunctions: [
                    {
                        label: "Zoom a Elementos Seleccionados",
                        callback: function (evt) {
                            console.log(" -- evt: ", evt);
                            var query = new Query();
                            //selectedRowIds property returns ObjectIds of features selected in the feature table
                            //Use the ObjectIds to query the feature layer. In this case, we will zoom to
                            //selected features on the map
                            query.objectIds = myFeatureTable.selectedRowIds;
                            query.geometry = map.extent;



                            myFeatureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (features) {
                                //zoom to the selected feature
                                //if only one point feature is selected in the table
                                if (features.length == 1 && features[0].geometry.type === "point") {
                                    maxZoom = map.getMaxZoom();
                                    map.centerAndZoom(features[0].geometry, maxZoom - 1);


                                }
                                else {
                                    var extent = graphicsUtils.graphicsExtent(features);
                                    map.setExtent(extent)
                                }
                                //show only selected features in the feature table.
                                myFeatureTable.filterSelectedRecords(true);

                            });
                        }
                    },
                    //{label: "Refrescar", callback: customRefresh},
                    {label: "Exportar a XLS", callback: exportToXls},
                    {label: "Exportar a KML", callback: exportToKml}

                ]
            }, 'myTableNode');

            myFeatureTable.startup();
           myFeatureTable.on("row-select", function (evt) {
                //displayPopupContent(evt.getSelectedFeature());
                var query = new Query();
                var featureLayer = myFeatureTable.featureLayer;
                //console.log("features", evt.selectedRowIds);
                fadeIt();
                var rowData = myFeatureTable.getRowDataById(myFeatureTable.selectedRowIds[0]);
                query.objectIds = [parseInt(rowData.ObjectID)];
                console.log("row data", rowData.ObjectID);
                featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);


            });

            myFeatureTable.on("refresh", function (evt) {

                if (Control==1){

                    myFeatureTable.selectRows([0], true);
                    var jsonPoint = myFeatureLayer.getSelectedFeatures()[0].geometry;
                    var pPoint = new Point(jsonPoint.x+2.5, jsonPoint.y+2);
                    function getcenter(){
                        map.centerAt(pPoint);
                    }

                    setTimeout(getcenter,1000);
                }
                Control=Control+1;
                //myFeatureTable.refresh();
            });

            myFeatureTable.on("filter", function (evt) {
                console.log("filter event - ", evt);
            });
            myFeatureTable.on("load", function (evt) {
                console.log("Tabla cargada");

            });
            dojo.connect(map, "onClick", selectFeat);
            function selectFeat(evt) {
                myFeatureTable.grid.refresh();
                var centerPoint = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, evt.mapPoint.spatialReference);
                var mapWidth = map.extent.getWidth();

                //Divide width in map units by width in pixels
                var pixelWidth = mapWidth / map.width;

                //Calculate a 10 pixel envelope width (5 pixel tolerance on each side)
                var tolerance = 20 * pixelWidth;

                //Build tolerance envelope and set it as the query geometry
                var queryExtent = new esri.geometry.Extent(1, 1, tolerance, tolerance, evt.mapPoint.spatialReference);

                var query = new Query();
                query.geometry = queryExtent.centerAt(centerPoint);
                console.log("punto - " + "Id:", queryExtent.centerAt(centerPoint));
                var featureLayer = myFeatureTable.featureLayer;
                featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                //var featureLayer = FeatureLayerEstaciones;
                FeatureLayerEstacionesHibridas.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                FeatureLayerEstacionesAcelerometros.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                FeatureLayerEstacionessismologicas.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                FeatureLayerEstacionesPortatilesAcelerograficas.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                FeatureLayerEstacionesPortatilesSismologicas.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                //console.log("punto - "+"Id:", evt);

            }

            function doBuffer(evt) {

                map.graphics.clear();
                var params = new BufferParameters();
                params.geometries = [evt.mapPoint];

                params.distances = [5, 10];
                params.unit = GeometryService.UNIT_KILOMETER;
                params.bufferSpatialReference = map.spatialReference;
                params.outSpatialReference = map.spatialReference;
                gsvc.buffer(params, selectFeat);
            }
            
           function fadeIt(){
		      dojo.style("popup1", "opacity", "0");
		      var fadeArgs = {
		        node: "popup1",
		        duration: 1000
		      };
		      dojo.fadeIn(fadeArgs).play();
		   }		   
		   
            myFeatureLayer.on("selection-complete", function (evt) {


                try {
                    fadeIt();
                    //myFeatureTable.clearSelection();
                    if (myFeatureLayer.visible==true) {
                        var popup = map.infoWindow;
                        displayPopupContent(myFeatureLayer.getSelectedFeatures()[0]);
                        var id = myFeatureLayer.getSelectedFeatures()[0].attributes.ObjectID;
                        try{
                            myFeatureTable.grid.select(myFeatureTable.getRowDataById(id), true);
                        }
                        catch (e)
                        {
                            
                        }
                        //var row = myFeatureTable.grid.row(myFeatureTable.getRowDataById(id));
                        //row.element.scrollIntoView();
                        //myFeatureTable.selectRows([id], true);
                        dom.byId("magnitud").innerHTML = myFeatureLayer.getSelectedFeatures()[0].attributes.MAGNITUDTEXT;
						
                        if (myFeatureLayer.getSelectedFeatures()[0].attributes.PROFUNDIDAD.indexOf("Superficial") != -1) {
                            dom.byId("profundidad").innerHTML = "Superficial";
                        }
                        else {
                            dom.byId("profundidad").innerHTML = myFeatureLayer.getSelectedFeatures()[0].attributes.PROFUNDIDAD;
                        }
                        if (myFeatureLayer.getSelectedFeatures()[0].attributes.SHAKEMAP == "0") {
                            
                            dom.byId("intensidad").innerHTML = "";

                        }
                        else {
                            
                            dom.byId("intensidad").innerHTML = myFeatureLayer.getSelectedFeatures()[0].attributes.SHAKEMAP;
                        }
                        dom.byId("localizacion").innerHTML = myFeatureLayer.getSelectedFeatures()[0].attributes.LATITUD +"<br>" + myFeatureLayer.getSelectedFeatures()[0].attributes.LONGITUD  ;

                        dom.byId("masinformacion").innerHTML = "<a class='b-iconMas' title='Clic para más información' target='_blank' href='https://www2.sgc.gov.co/sgc/sismos/Paginas/sismo-detalle.aspx?sismosId=" + myFeatureLayer.getSelectedFeatures()[0].attributes.EVENTO + "'><span class='la mas'>+</span></a>";

                        console.log("select-complete - " + "Id:", evt);
                        console.log("Id:", id);


                    }
                }
                catch (err) {

                }

            });

            

            myFeatureLayer.on("edits-complete", function (evt) {
                /*
                var query = new Query();
                query.objectIds =[0];
                myFeatureLayer.selectFeatures(query,FeatureLayer.SELECTION_NEW);
                myFeatureLayer.refresh();
                console.log("Despues de ediciones")
              */
            });

            //imprimir Mapa

            var TextNombre =dom.byId("NombreImpresion");
            var VentanaPrint=dom.byId("VentanaImprimir");
            var printer=null;
            on(VentanaPrint, "onClose",function (){
                if(printer){
                    printer.destroy();
                }
            });

            on(TextNombre, "change", function () {
                if(printer){
                    printer.destroy();
                }
                printer = new Print({
                    map: map,
                    templates:templatePrint,
                    url: "https://srvags.sgc.gov.co/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
                }, dom.byId("ImprimirBoton"));
                var templatePrint= [

                    {
                        label: "Layout",
                        format: "PDF",
                        layout: "A4 Landscape",
                        layoutOptions: {
                            titleText: dom.byId("NombreImpresion").value,
                            authorText: "",
                            copyrightText: "Servicio Geol?ico Colombiano",
                            scalebarUnit: "Kilometers",
                        }
                    }];
                printer.templates=templatePrint;
                printer.startup();
            });


            function handleError(err) {
                console.log("Something broke: ", err);
            }
            

            var ListLayersView = [
                {
                    layer: FeatureLayerEstacionesPortatilesAcelerograficas, // required unless featureCollection.
                    showLegend: true,

                },
                {
                    layer: FeatureLayerEstacionesPortatilesSismologicas, // required unless featureCollection.
                    showLegend: true,

                },

                {
                    layer: FeatureLayerEstacionesHibridas, // required unless featureCollection.
                    showLegend: true,

                },
                {
                    layer: FeatureLayerEstacionessismologicas, // required unless featureCollection.
                    showLegend: true,

                },
                {
                    layer: FeatureLayerEstacionesAcelerometros, // required unless featureCollection.
                    showLegend: true,

                },
                {
                    layer: myFeatureLayer, // required unless featureCollection
                    showLegend: true,
                }
            ];


            console.log(ListLayersView);

            var myWidget = new LayerList({
                map: map,
                layers: ListLayersView
            }, "capasDiv2");
            myWidget.startup();

            //fin Load Table

            FeatureLayerEstacionesPortatilesSismologicas.on("selection-complete", function (evt) {
                if (FeatureLayerEstacionesPortatilesSismologicas.visible==true) {
                    displayPopupContent(FeatureLayerEstacionesPortatilesSismologicas.getSelectedFeatures()[0]);
                    console.log("select-complete - " + "Id:", evt);
                }
            });

            FeatureLayerEstacionesPortatilesAcelerograficas.on("selection-complete", function (evt) {
                if (FeatureLayerEstacionesPortatilesAcelerograficas.visible==true) {
                    displayPopupContent(FeatureLayerEstacionesPortatilesAcelerograficas.getSelectedFeatures()[0]);
                    console.log("select-complete - " + "Id:", evt);
                }
            });
    
            
            FeatureLayerEstacionesHibridas.on("selection-complete", function (evt) {
                if (FeatureLayerEstacionesHibridas.visible==true) {
                    displayPopupContent(FeatureLayerEstacionesHibridas.getSelectedFeatures()[0]);
                    console.log("select-complete - " + "Id:", evt);
                }
            });
            FeatureLayerEstacionessismologicas.on("selection-complete", function (evt) {
                if (FeatureLayerEstacionessismologicas.visible==true) {
                    displayPopupContent(FeatureLayerEstacionessismologicas.getSelectedFeatures()[0]);
                    console.log("select-complete - " + "Id:", evt);
                }
            });
            FeatureLayerEstacionesAcelerometros.on("selection-complete", function (evt) {
                if (FeatureLayerEstacionesAcelerometros.visible==true) {
                    displayPopupContent(FeatureLayerEstacionesAcelerometros.getSelectedFeatures()[0]);
                    console.log("select-complete - " + "Id:", evt);
                }
            });



        }

        function initializeSidebar(map) {
            var popup = map.infoWindow;

            //when the selection changes update the side panel to display the popup info for the
            //currently selected feature.
            connect.connect(popup, "onSelectionChange", function () {
                try {
                    displayPopupContent(popup.getSelectedFeature());
                    //myFeatureTable.clearSelection();
                    var query = new Query();
                    query.objectIds = [popup.getSelectedFeature().attributes.ObjectID];
                    var featureLayer = popup.getSelectedFeature().getLayer();
                    featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                }
                catch (e) {
                    console.log("Errorn on change selection")
                }

            });

            //when the selection is cleared remove the popup content from the side panel.
            connect.connect(popup, "onClearFeatures", function () {
                //dom.byId replaces dojo.byId
                dom.byId("featureCount").innerHTML = "Click to select feature(s)";
                //registry.byId replaces dijit.byId
                registry.byId("popup1").set("content", "");
                domUtils.hide(dom.byId("pager"));
            });

            //When features are associated with the  map's info window update the sidebar with the new content.
            connect.connect(popup, "onSetFeatures", function () {
                displayPopupContent(popup.getSelectedFeature());
                dom.byId("featureCount").innerHTML = popup.features.length + " feature(s) selected";


                //enable navigation if more than one feature is selected
                popup.features.length > 1 ? domUtils.show(dom.byId("pager")) : domUtils.hide(dom.byId("pager"));
            });

        }

        function displayPopupContent(feature) {
            if (feature)
            {
                var content = feature.getContent();
                var longitud=feature.attributes.LONGITUD;
                var shakemap = feature.attributes.SHAKEMAP;
                //modificaciones 01_15_2018
                function getTextContent(graphic){
                    var attr = graphic.attributes;
                    var FECHA = attr.FECHA;
                    var FECHAUTC = attr.FECHAUTC;

                    var MAGNITUD = attr.MAGNITUDTEXT;
                    var ESTADO = attr.ESTADO;
                    var PROFUNDIDAD = attr.PROFUNDIDAD;
                    var LONGITUD = attr.LONGITUD;

                    var LATITUD = attr.LATITUD;
                    var LOCALIZACION = attr.LOCALIZACION;
                    var EVENTO = attr.EVENTO;
                    var DESCRIPCION = attr.DESCRIPCION;
                    var PROFUNDIDADTEXT = attr.PROFUNDIDADTEXT;

                    return '<div class="headerinf" dojoattachpoint="_title"><b>'+DESCRIPCION+'</b></div><div class="hzLine"></div>'+ "<B>Tiempo de origen:</B>"+FECHA +"Hora Local ("+FECHAUTC+" UTC) <br> " +
                        "<B>Magnitud: </B> "+MAGNITUD+" <br> <B>Estado: </B> "+ESTADO +"<br> <B>Profundidad: </B>"+PROFUNDIDADTEXT+ "<br><B>Municipios Cercanos: </B>"+LOCALIZACION 
                }
                function getTextContent2(graphic){
                    var attr = graphic.attributes;
                    var FECHA = attr.FECHA;
                    var FECHAUTC = attr.FECHAUTC;

                    var MAGNITUD = attr.MAGNITUDTEXT;
                    var ESTADO = attr.ESTADO;
                    var PROFUNDIDAD = attr.PROFUNDIDAD;
                    var LONGITUD = attr.LONGITUD;

                    var LATITUD = attr.LATITUD;
                    var LOCALIZACION = attr.LOCALIZACION;
                    var EVENTO = attr.EVENTO;
                    var DESCRIPCION = attr.DESCRIPCION;
                    var PROFUNDIDADTEXT = attr.PROFUNDIDADTEXT;
                    var SHAKEMAP = attr.SHAKEMAP;

                    return '<div class="headerinf" dojoattachpoint="_title"><b>'+DESCRIPCION+'</b></div><div class="hzLine"></div>'+ "<B>Tiempo de origen:</B>"+FECHA +"Hora Local ("+FECHAUTC+" UTC) <br> " +
                        "<B>Magnitud: </B> "+MAGNITUD+" <br> <B>Estado: </B> "+ESTADO +"<br> <B>Profundidad: </B>"+PROFUNDIDADTEXT+ "<br> <B>Longitud: </B>"+LONGITUD+"<br><B>Latitud: </B>"+LATITUD+ "<br><B>Municipios Cercanos: </B>"+LOCALIZACION
                }
                if (longitud == "" && shakemap=="0")
                {
                    content= getTextContent(feature);
                    console.log(content);
                }
                else if (longitud != "" && shakemap=="0")
                {
                    content= getTextContent2(feature);
                    console.log(content);
                }
                //modificaciones 01_15_2018
                console.log(content);
                registry.byId("popup1").set("content", content);
            }
        }

        function selectPrevious() {
            map.infoWindow.selectPrevious();
        }

        function selectNext() {
            map.infoWindow.selectNext();
        }
       function toggleSidebar(appLayout, contentAccordion) {
            var panelIndex = appLayout.getIndexOfChild(contentAccordion);
            if (panelIndex >= 0) {
                appLayout.removeChild(contentAccordion);
            } else {
                appLayout.addChild(contentAccordion);
            }
        }

        function toggleSidebarMovil(appLayout,columna1,columna2,columna3) {
            var panelIndex1 = appLayout.getIndexOfChild(columna1);
            var panelIndex2 = appLayout.getIndexOfChild(columna2);
            var panelIndex3 = appLayout.getIndexOfChild(columna3);
            columna1.set('style','display: block !important;');
            columna2.set('style','display: block !important;');
            columna3.set('style','display: block !important;');
            if (panelIndex1 >= 0) {
                appLayout.removeChild(columna1);
            }
            if (panelIndex2 >= 0) {
                appLayout.removeChild(columna2);
            }
            appLayout.addChild(columna3);
            
        }
        
        var bc = dijit.byId("appLayout");
        var leadingR = dijit.byId("RightCol");
        var leadingL = dijit.byId("leftCol");
        var leadingC = dijit.byId("Central");

        on(dom.byId("Boton2"), "click", function () {
            toggleSidebar(bc, leadingL);

        });

        on(dom.byId("Boton1"), "click", function () {
            toggleSidebar(bc, leadingR);
        });
        // Basemaps listado
        var menu = new Menu({
            style: "display: none;",
            class:"MenuDesplegable"
        });
        var menuItem1 = new MenuItem({
            label: "Topográfico",
            onClick: function(){ map.setBasemap("topo"); }
        });
        menu.addChild(menuItem1);

        var menuItem2 = new MenuItem({
            label: "Lona Gris",
            onClick: function(){ map.setBasemap("gray"); }
        });
        menu.addChild(menuItem2);

        var menuItem3 = new MenuItem({
            label: "Oceanos",
            onClick: function(){ map.setBasemap("oceans"); }
        });
        menu.addChild(menuItem3);
        menu.startup();

        var button4 = new DropDownButton({
            id:"MapaBase",
            class:"MapaBaseClass",
            showLabel:false,
            dropDown: menu,
            iconClass:'MapaBaseIcon',
        });
        button4.placeAt(dom.byId("Basemaps"));
        button4.startup();

// menu Movil listado
        
        var menuMovil = new Menu({ style: "display: none;"});
        var menuItemMovil1 = new MenuItem({
            label: "Tabla e informaci?",
            onClick: function(){ toggleSidebarMovil(bc, leadingC,leadingR,leadingL); }
        });
        menuMovil.addChild(menuItemMovil1);

        var menuItemMovil2 = new MenuItem({
            label: "Solo Mapa",
            onClick: function(){ toggleSidebarMovil(bc, leadingL,leadingR,leadingC); }
        });
        menuMovil.addChild(menuItemMovil2);

        var menuMovil3 = new MenuItem({
            label: "Herramientas",
            onClick: function(){ toggleSidebarMovil(bc, leadingC,leadingL,leadingR); }
        });
        menuMovil.addChild(menuMovil3);
        menuMovil.startup();

        var buttonMovil = new DropDownButton({
            id:"Movil",
            class:"Movil",
            showLabel:false,
            dropDown: menuMovil,
            iconClass:'NavToggle',
        });
        dom.byId("Basemaps2").appendChild(buttonMovil.domNode);
		on(dom.byId("btnAjustes"), "click", function () {
            toggleSidebarMovil(bc, leadingC,leadingL,leadingR);
        });
		on(dom.byId("btnMapa"), "click", function () {
            toggleSidebarMovil(bc, leadingL,leadingR,leadingC);
            if ( window.matchMedia("(max-device-width: 600px)") ||window.matchMedia("(max-width: 600px)"))
            {
                var myFeatureLayer = map.getLayer("EventosSismicos");
                var jsonPoint = myFeatureLayer.getSelectedFeatures()[0].geometry;

                var pPoint2 = new Point(jsonPoint.x+2.5, jsonPoint.y+2);
                var pPoint = new Point(jsonPoint.x, jsonPoint.y);
                map.infoWindow.hide();
                map.infoWindow.setTitle("");
                map.infoWindow.setContent(displayPopupContentMobil(myFeatureLayer.getSelectedFeatures()[0]));

                map.infoWindow.show(pPoint,InfoWindow.ANCHOR_UPPERRIGHT);

                map.centerAndZoom(pPoint2, 6);

                //map.zoom();
            }

        });
		on(dom.byId("btnTabla"), "click", function () {
            toggleSidebarMovil(bc, leadingC,leadingR,leadingL);
        });

        
        var mqls = [
            window.matchMedia("(max-device-width: 600px)"),
            window.matchMedia("(max-width: 600px)")
        ];

        function displayPopupContentMobil(feature) {
            if (feature)
            {
                var content = feature.getContent();
                var longitud=feature.attributes.LONGITUD;
                var shakemap = feature.attributes.SHAKEMAP;
                //modificaciones 01_15_2018
                function getTextContent(graphic){
                    var attr = graphic.attributes;
                    var FECHA = attr.FECHA;
                    var FECHAUTC = attr.FECHAUTC;

                    var MAGNITUD = attr.MAGNITUDTEXT;
                    var ESTADO = attr.ESTADO;
                    var PROFUNDIDAD = attr.PROFUNDIDAD;
                    var LONGITUD = attr.LONGITUD;

                    var LATITUD = attr.LATITUD;
                    var LOCALIZACION = attr.LOCALIZACION;
                    var EVENTO = attr.EVENTO;
                    var DESCRIPCION = attr.DESCRIPCION;
                    var PROFUNDIDADTEXT = attr.PROFUNDIDADTEXT;

                    return '<div class="headerinf" dojoattachpoint="_title"><b>'+DESCRIPCION+'</b></div><div class="hzLine"></div>'+ "<B>Tiempo de origen:</B>"+FECHA +"Hora Local ("+FECHAUTC+" UTC) <br> " +
                        "<B>Magnitud: </B> "+MAGNITUD+" <br> <B>Estado: </B> "+ESTADO +"<br> <B>Profundidad: </B>"+PROFUNDIDADTEXT+ "<br><B>Municipios Cercanos: </B>"+LOCALIZACION +
                        " <br> <a  target='_blank' href='https://www2.sgc.gov.co/sgc/sismos/Paginas/sismo-detalle.aspx?sismosId="+EVENTO+"'><B>Más información</B></a>"
                            
                    
                }
                function getTextContent2(graphic){
                    var attr = graphic.attributes;
                    var FECHA = attr.FECHA;
                    var FECHAUTC = attr.FECHAUTC;

                    var MAGNITUD = attr.MAGNITUDTEXT;
                    var ESTADO = attr.ESTADO;
                    var PROFUNDIDAD = attr.PROFUNDIDAD;
                    var LONGITUD = attr.LONGITUD;

                    var LATITUD = attr.LATITUD;
                    var LOCALIZACION = attr.LOCALIZACION;
                    var EVENTO = attr.EVENTO;
                    var DESCRIPCION = attr.DESCRIPCION;
                    var PROFUNDIDADTEXT = attr.PROFUNDIDADTEXT;
                    var SHAKEMAP = attr.SHAKEMAP;

                    return '<div class="headerinf" dojoattachpoint="_title"><b>'+DESCRIPCION+'</b></div><div class="hzLine"></div>'+ "<B>Tiempo de origen:</B>"+FECHA +"Hora Local ("+FECHAUTC+" UTC) <br> " +
                        "<B>Magnitud: </B> "+MAGNITUD+" <br> <B>Estado: </B> "+ESTADO +"<br> <B>Profundidad: </B>"+PROFUNDIDADTEXT+ "<br> <B>Longitud: </B>"+LONGITUD+"<br><B>Latitud: </B>"+LATITUD+ "<br><B>Municipios Cercanos: </B>"+LOCALIZACION +
                        " <br> <a  target='_blank' href='https://www2.sgc.gov.co/sgc/sismos/Paginas/sismo-detalle.aspx?sismosId="+EVENTO+"'><B>Más información</B></a>"
                }
                if (longitud == "" && shakemap=="0")
                {
                    content= getTextContent(feature);
                    console.log(content);
                }
                else if (longitud != "" && shakemap=="0")
                {
                    content= getTextContent2(feature);
                    console.log(content);
                }
                //modificaciones 01_15_2018
                return content;
            }


        }

        function WidthChange(mq) {
            var template3 = new PopupTemplate({
                "title": '<b>{DESCRIPCION}</b>',

                "fieldInfos": [
                    {
                        "fieldName": "EVENTO",
                        "alias": "Identificador",
                    },
                    {
                        "fieldName": "DESCRIPCION",
                        "alias": "Descripcion",
                    },
                    {
                        "fieldName": "MAGNITUDTEXT",
                        "alias": "Magnitud",
                    },
                    {
                        "fieldName": "PROFUNDIDAD",
                        "alias": "Profundidad"
                    },
                    {
                        "fieldName": "LATITUD",
                        "alias": "Latitud",
                    },
                    {
                        "fieldName": "LONGITUD",
                        "alias": "Longitud"
                    },
                    {
                        "fieldName": "FECHA",
                        "alias": "Fecha"

                    },
                    {
                        "fieldName": "FECHAUTC",
                        "alias": "Fecha_UTC"

                    },
                    {
                        "fieldName": "ESTADO",
                        "alias": "ESTADO"


                    },
                    {
                        "fieldName": "LOCALIZACION",
                        "alias": "Localizacion"

                    },
                    {
                        "fieldName": "PROFUNDIDADTEXT",
                        "alias": "Prof"

                    },
                    {
                        "fieldName": "SHAKEMAP",
                        "alias": "Intensidad"

                    }
                ],
                "description": "<B>Tiempo de origen: </B> {FECHA} Hora Local ({FECHAUTC} UTC) " +
                "<br><B>Magnitud:</B> {MAGNITUDTEXT} <br> <B>Estado:</B> {ESTADO}<br> <B>Profundidad:</B> {PROFUNDIDADTEXT}  " +
                "<br>  <b>Longitud:</b> {LONGITUD} <br> <b>Latitud:</b> {LATITUD}" +
                "<table style='width:100%' class='ShakemapL{SHAKEMAP}'><tr> " +
                "<th style='width:50% !important'><B>Intensidad Instrumental: </B></th> " +
                "<th style='width:15% !important'><div class='Shakemap  shakeMap{SHAKEMAP}'>{SHAKEMAP}</div></th>" +
                "<th style='width:35% !important'><div class='shakeMapTxt{SHAKEMAP}'></div> </th></tr> </table>" +
                "<div><b>Municipios Cercanos:</b> {LOCALIZACION}</div>"+ 
                "<a  target='_blank' href='https://www2.sgc.gov.co/sgc/sismos/Paginas/sismo-detalle.aspx?sismosId={EVENTO}'><B>Más información</B></a>" ,
            });
            if (mqls[0].matches || mqls[1].matches) {
                console.log("aplicado");
                var _mapInfoWindow = map.infoWindow;
                //if (_mapInfoWindow) {
                    //_mapInfoWindow.destroy();
                //}
                //var FeatureSismos =
                //FeatureSismos.setInfoTemplate(template3);
                var popup2 = new Popup({
                    fillSymbol: new SimpleFillSymbol(
                        SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255,0])),
                        new Color([255, 255, 255, 0]))
                }, domConstruct.create("div"));
                 //var myFeatureLayer = new FeatureLayer() ;
                var symbol = new SimpleMarkerSymbol({
                    "color": [0,0,0,0],
                    "size": 12,
                    "angle": -30,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSCircle",
                    "outline": {
                        "color": [0,0,0,0],
                        "width": 2,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                });
                var myFeatureLayer = map.getLayer("EventosSismicos");
                //popup2.setTitle("Sismo");
                
                myFeatureLayer.setInfoTemplate(template3);
                map.setInfoWindow(popup2);
                
                map.infoWindow.setTitle("");
                map.infoWindow.setContent(displayPopupContentMobil(myFeatureLayer.getSelectedFeatures()[0]));

                map.infoWindow.set("markerSymbol",symbol);


                console.log("500px activo");
            } else {
                try {
                    var myFeatureLayer = map.getLayer("EventosSismicos");
                    myFeatureLayer.setInfoTemplate(template);
                    //popup2.setTitle("Sismo");
                    map.setInfoWindow(popup);
                    map.infoWindow.set("markerSymbol",symbol);
                }
                catch (err) {
                }
                //Add the dark theme which is customized further in the <style> tag at the top of this page
                bc.addChild(leadingC);
                console.log("1000px");
            }

        }

        var controlevt=true;
        // media query change
        map.on("update-end",function (results)
        {

         if(controlevt) {
             for (var i = 0; i < mqls.length; i++) {
                 // call listener function explicitly at run time
                 mqls[i].addListener(WidthChange); // attach listener function to listen in on state changes
                 WidthChange(mqls[i])
             }
             /*
              var mq = window.matchMedia("(max-device-width: 600px)");
              mq.addListener(WidthChange);
              WidthChange(mq);

              var rq = window.matchMedia("(max-width: 600px)");
              rq.addListener(WidthChange);
              WidthChange(rq);
              */


             // modificacion 12/01/2018
             function getTextContent(graphic) {
                 var attr = graphic.attributes;
                 var FECHA = attr.FECHA;
                 var FECHAUTC = attr.FECHAUTC;

                 var MAGNITUD = attr.MAGNITUDTEXT;
                 var ESTADO = attr.ESTADO;
                 var PROFUNDIDAD = attr.PROFUNDIDAD;
                 var LONGITUD = attr.LONGITUD;

                 var LATITUD = attr.LATITUD;
                 var LOCALIZACION = attr.LOCALIZACION;
                 var EVENTO = attr.EVENTO;
                 var DESCRIPCION = attr.DESCRIPCION;
                 var PROFUNDIDADTEXT=attr.PROFUNDIDADTEXT;

                 return '<div class="headerinf" dojoattachpoint="_title"><b>' + DESCRIPCION + '</b></div><div class="hzLine"></div>' + "<B>Tiempo de origen:</B>" + FECHA + " Hora local (" + FECHAUTC + " UTC) <br> " +
                     "<B>Magnitud:</B> " + MAGNITUD + " <br> <B>Estado:</B> " + ESTADO + "<br> <B>Profundidad:</B> " + PROFUNDIDADTEXT +
                     "<br> <b>Longitud:</b> " + LONGITUD + " <br> <b>Latitud:</b> " + LATITUD +
                     "<br><b>Municipios cercanos:</b> " + LOCALIZACION + " <br> <a  target='_blank' href='https://www2.sgc.gov.co/sgc/sismos/Paginas/sismo-detalle.aspx?sismosId=" + EVENTO + "'><B>Más información</B></a>";
             }

             if (Control == 3 || Control == 4) {
                 var myFeatureLayer = map.getLayer("EventosSismicos");
                 var jsonPoint = myFeatureLayer.getSelectedFeatures()[0].geometry;

                 var feat = myFeatureLayer.getSelectedFeatures()[0];
                 var pPoint = new Point(jsonPoint.x, jsonPoint.y);
                 map.infoWindow.setTitle("");
                 map.infoWindow.setContent(displayPopupContentMobil(feat));
                 map.infoWindow.show(pPoint);

                 console.log("Mostrar Popup - ", feat);
                 controlevt = false;
                 domAttr.set(dom.byId("Consulta"), 'style', 'display : none');
                 domAttr.set(dom.byId("BorrarConsulta"), 'style', 'display : none');
                 domAttr.set(dom.byId("resultadoFiltro"), 'style', 'display : none');
             }

             console.log("ultimo" + Control);
             // modificacion 12/01/2018
         }
        });
        map.setBasemap("oceans");

       
    });
    
});