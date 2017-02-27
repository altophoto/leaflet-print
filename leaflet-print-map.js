 var PrintMap = (function() {	
        var callback,
			map,
			
            layerCount,
            loadedLayerCount,
            loadInterval;

		//the start point. only this function should be calling
        var print = function(_map, _callback) {
            map = _map;
            callback = _callback;
            layerCount = 0;
            loadedLayerCount = 0;

            redrawLayer();

            loadInterval = setInterval(function() {
                onCheckInterval();
            }, 500)
        }

		//for all dynamics layer need to redraw it, because it may contains a lot of unnecessary for printing information
		//it happens when maps dragging and old information stay in map, but outside outside of visible area
        var redrawLayer = function() {
            map.eachLayer(function(layer) {
                layerCount++;
				//It's a strange bug fix - some dynamic layers (like polygons, markers etc) doesn't throw "load" event
                //but contains setUrl function, so by this i detect dynamic layer and redraw it				
                if (typeof layer.setUrl == "function") {
                    layer.redraw();
                    layer.on("load", onLayerLoad);
                } else {
                    onLayerLoad();
                }
            });
        }

		//its a counter represent how many  layers are already loaded after reload event was thrown
        var onLayerLoad = function() {
            loadedLayerCount++;
        }

		//check when all layers are loaded and start to get screenshot 
        var onCheckInterval = function() {
            console.log("Waiting while layer is loading ", layerCount, loadedLayerCount)
            if (layerCount <= loadedLayerCount) {
                clearInterval(loadInterval);
                startPrint();
            }
        }

		//before start making screenshot unbind custom onload event
        var startPrint = function() {
            map.eachLayer(function(layer) {
                layer.off("load", onLayerLoad);
            });
            exportMap();
        }

		//huge function to create correct screenshot of map
        var exportMap = function() {
            var mapPane = $(".leaflet-map-pane")[0];
            var mapTransform = mapPane.style.transform.split(",");
            var mapX = parseFloat(mapTransform[0].split("(")[1].replace("px", ""));
            var mapY = parseFloat(mapTransform[1].replace("px", ""));
            mapPane.style.transform = "";
            mapPane.style.left = mapX + "px";
            mapPane.style.top = mapY + "px";

            var myTiles = $("img.leaflet-tile");
            var tilesLeft = [];
            var tilesTop = [];
            var tileMethod = [];
            for (var i = 0; i < myTiles.length; i++) {
                if (myTiles[i].style.left != "") {
                    tilesLeft.push(parseFloat(myTiles[i].style.left.replace("px", "")));
                    tilesTop.push(parseFloat(myTiles[i].style.top.replace("px", "")));
                    tileMethod[i] = "left";
                } else if (myTiles[i].style.transform != "") {
                    var tileTransform = myTiles[i].style.transform.split(",");
                    tilesLeft[i] = parseFloat(tileTransform[0].split("(")[1].replace("px", ""));
                    tilesTop[i] = parseFloat(tileTransform[1].replace("px", ""));
                    myTiles[i].style.transform = "";
                    tileMethod[i] = "transform";
                } else {
                    tilesLeft[i] = 0;
                    tilesRight[i] = 0;
                    tileMethod[i] = "neither";
                }
                myTiles[i].style.left = (tilesLeft[i]) + "px";
                myTiles[i].style.top = (tilesTop[i]) + "px";
            }

            var myDivicons = $(".leaflet-marker-icon");
            var dx = [];
            var dy = [];
            for (var i = 0; i < myDivicons.length; i++) {
                var curTransform = myDivicons[i].style.transform;
                var splitTransform = curTransform.split(",");
                dx.push(parseFloat(splitTransform[0].split("(")[1].replace("px", "")));
                dy.push(parseFloat(splitTransform[1].replace("px", "")));
                myDivicons[i].style.transform = "";
                myDivicons[i].style.left = dx[i] + "px";
                myDivicons[i].style.top = dy[i] + "px";
            }

            html2canvas(document.getElementById("themap"), {
                useCORS: true,
                onrendered: function(canvas) {
                    if (typeof callback == "function") {
                        callback(canvas.toDataURL());
                    }
                }
            });

            for (var i = 0; i < myTiles.length; i++) {
                if (tileMethod[i] == "left") {
                    myTiles[i].style.left = (tilesLeft[i]) + "px";
                    myTiles[i].style.top = (tilesTop[i]) + "px";
                } else if (tileMethod[i] == "transform") {
                    myTiles[i].style.left = "";
                    myTiles[i].style.top = "";
                    myTiles[i].style.transform = "translate(" + tilesLeft[i] + "px, " + tilesTop[i] + "px)";
                } else {
                    myTiles[i].style.left = "0px";
                    myTiles[i].style.top = "0px";
                    myTiles[i].style.transform = "translate(0px, 0px)";
                }
            }
            for (var i = 0; i < myDivicons.length; i++) {
                myDivicons[i].style.transform = "translate(" + dx[i] + "px, " + dy[i] + "px)";
                myDivicons[i].style.left = "0px";
                myDivicons[i].style.top = "0px";
            }

            mapPane.style.transform = "translate(" + (mapX) + "px," + (mapY) + "px)";
            mapPane.style.left = "";
            mapPane.style.top = "";
        }


        return {
            print: print
        }
    }());