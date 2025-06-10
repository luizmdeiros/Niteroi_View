var size = 0;
var placement = 'point';

var style_Logradouros_6 = function(feature, resolution) {
    var labelText = "";
    var labelFont = "8px 'Arial', sans-serif";
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
    // Função para pegar o maior segmento de uma MultiLineString
    function getLongestLine(coords) {
        var maxLen = 0;
        var maxLine = null;
        coords.forEach(function(line) {
            var len = 0;
            for (var i = 1; i < line.length; i++) {
                var dx = line[i][0] - line[i-1][0];
                var dy = line[i][1] - line[i-1][1];
                len += Math.sqrt(dx*dx + dy*dy);
            }
            if (len > maxLen) {
                maxLen = len;
                maxLine = line;
            }
        });
        return maxLine;
    }

    var geom = feature.getGeometry();
    var coords = geom.getCoordinates();
    var labelGeom = geom;
    var lengthPx = 0;
    if (geom.getType() === 'LineString') {
        for (var i = 1; i < coords.length; i++) {
            var dx = (coords[i][0] - coords[i-1][0]) / resolution;
            var dy = (coords[i][1] - coords[i-1][1]) / resolution;
            lengthPx += Math.sqrt(dx*dx + dy*dy);
        }
    } else if (geom.getType() === 'MultiLineString') {
        // Seleciona apenas o maior segmento para rotulagem
        var longest = getLongestLine(coords);
        if (longest) {
            labelGeom = new ol.geom.LineString(longest);
            // Calcula o comprimento do maior segmento
            for (var i = 1; i < longest.length; i++) {
                var dx = (longest[i][0] - longest[i-1][0]) / resolution;
                var dy = (longest[i][1] - longest[i-1][1]) / resolution;
                lengthPx += Math.sqrt(dx*dx + dy*dy);
            }
        }
    }
    var textLength = nome && permitido ? nome.length * 8.5 : 0;
    if (permitido && lengthPx > textLength + 40) {
        labelText = String(nome);
    } else {
        labelText = ""; // Não renderiza se não couber
    }

    // Ajuste de largura do traço por escala de referência
    var strokeWidth = 3.3744; // padrão
    if (typeof map !== 'undefined') {
        var zoom = map.getView().getZoom();
        if (zoom >= 15 && zoom <= 18) {
            // Simula escala de referência 1:15000, largura QGIS 3.7px
            var dpi = 96;
            var metersPerUnit = 1; // EPSG:3857 já está em metros
            var resolution = map.getView().getResolution();
            var scale = resolution * 39.37 * dpi / metersPerUnit;
            strokeWidth = 3.7 * (15000 / scale); // 3.7px na escala 1:15000
        }
        // Garante um valor mínimo para strokeWidth
        if (strokeWidth < 0.5 || isNaN(strokeWidth)) strokeWidth = 0.5;
        console.log('[Logradouros] zoom:', zoom, 'strokeWidth:', strokeWidth);
    }
    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255,255,255,1.0)',
                lineDash: null,
                lineCap: 'round',
                lineJoin: 'round',
                width: strokeWidth
            })
        }),
        new ol.style.Style({
            geometry: labelGeom,
            text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
        })
    ];
};
