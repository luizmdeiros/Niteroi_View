var size = 0;
var placement = 'point';

var style_Logradouros_6 = function(feature, resolution) {
    var labelText = "";
    var labelFont = "5.2px 'Arial', sans-serif";
    var labelFill = "#323232";
    var bufferColor = "";
    var bufferWidth = 0;
    var placement = 'line';
    var nome = feature.get("nome_compl");
    // Permitir apenas Rua, Avenida, Alameda e Túnel
    var permitidos = ["Rua ", "Avenida ", "Alameda ", "Túnel "];
    var permitido = false;
    if (nome) {
        for (var i = 0; i < permitidos.length; i++) {
            if (nome.startsWith(permitidos[i])) {
                permitido = true;
                break;
            }
        }
    }
    if (permitido && resolution > 0 && resolution < 14) {
        // Calcular comprimento da linha em pixels
        var geom = feature.getGeometry();
        var coords = geom.getCoordinates();
        var lengthPx = 0;
        if (geom.getType() === 'LineString') {
            for (var i = 1; i < coords.length; i++) {
                var dx = (coords[i][0] - coords[i-1][0]) / resolution;
                var dy = (coords[i][1] - coords[i-1][1]) / resolution;
                lengthPx += Math.sqrt(dx*dx + dy*dy);
            }
        } else if (geom.getType() === 'MultiLineString') {
            coords.forEach(function(line) {
                for (var i = 1; i < line.length; i++) {
                    var dx = (line[i][0] - line[i-1][0]) / resolution;
                    var dy = (line[i][1] - line[i-1][1]) / resolution;
                    lengthPx += Math.sqrt(dx*dx + dy*dy);
                }
            });
        }
        var textLength = nome.length * 6.5;
        if (lengthPx > textLength + 20) {
            labelText = String(nome);
        }
    }
    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(255,255,255,1.0)', lineDash: null, lineCap: 'round', lineJoin: 'round', width: 3.3744}),
        text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
    })];
};
