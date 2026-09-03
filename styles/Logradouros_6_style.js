var size = 0;
var placement = 'point';


// Define a partir de qual zoom cada categoria de via passa a ser desenhada.
// Isso evita que, em zoom baixo, todas as ruas (inclusive travessas/becos)
// apareçam juntas formando uma "maçaroca" ilegível.
function zoomMinimoParaTipo(tipo) {
    switch (tipo) {
        case 'Estrada':
            return 11;
        case 'Tunel':
            return 11;
        case 'Avenida':
            return 11; // sempre visível, mesmo no zoom mínimo do mapa
        case 'Rua':
            return 13;
        case 'Alameda':
            return 14;
        case 'Travessa':
            return 15;
        case 'Beco':
            return 15;
        default:
            return 14;
    }
}

var style_Logradouros_6 = function(feature, resolution) {
      var tipo = feature.get('tipo') || feature.get('tipo_logra') || '';

    if (typeof map !== 'undefined') {
        var zoomAtual = map.getView().getZoom();
        if (zoomAtual < zoomMinimoParaTipo(tipo)) {
            return null; // não desenha nada para essa feature neste zoom
        }
    }
    var labelText = "";
    var labelFont = "9px 'Arial', sans-serif";
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

// Define um multiplicador de largura conforme a categoria da via (campo "tipo"),
// para vias maiores (avenidas) ficarem visivelmente mais largas que travessas/becos,
// mantendo a mesma escala relativa entre zooms que larguraTracoLogradouro já calcula.
function fatorHierarquiaViaria(feature) {
    var tipo = feature.get('tipo') || feature.get('tipo_logra') || '';
    switch (tipo) {
        case 'Avenida':
            return 1.35;
        case 'Rua':
            return 1.0;
        case 'Alameda':
            return 0.9;
        case 'Travessa':
            return 0.6;
        case 'Beco':
            return 0.55;
        default:
            return 0.85; // categorias não mapeadas (ex: Praça, Estrada) ficam num meio-termo
    }
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
    var showLabels = false;
    if (typeof map !== 'undefined') {
        var zoom = map.getView().getZoom();
        if (zoom >= 15) { // ajuste conforme desejado
            showLabels = true;
        }
    }
    if (permitido && lengthPx > textLength + 40 && showLabels) {
        labelText = String(nome);
    } else {
        labelText = ""; // Não renderiza se não couber ou se zoom for baixo
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
        // Aplica a hierarquia viária sobre a largura calculada pela escala/zoom
var fatorHierarquia = fatorHierarquiaViaria(feature);

strokeWidth = strokeWidth * fatorHierarquia;

// Garante um valor mínimo para strokeWidth
if (strokeWidth < 0.5 || isNaN(strokeWidth)) {
    strokeWidth = 0.5;
}
    }
    // Define cor do traço para Túnel
    var strokeColor = 'rgba(255,255,255,1.0)'; // padrão branco
    if (nome && nome.startsWith('Túnel')) {
        strokeColor = '#f5f2f5'; // cinza claro
    }
    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: strokeColor,
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
