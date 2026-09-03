var size = 0;
var placement = 'point';

function zoomMinimoParaTipo(tipo) {
    switch (tipo) {
        case 'Estrada':
            return 11;
        case 'Tunel':
            return 11;
        case 'Avenida':
            return 11;
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
            return 0.85;
    }
}
// Calcula a largura do traço (em px) para uma feature de logradouro, dado o zoom/resolução atuais.
// Precisa ser IDÊNTICA à mesma função em Logradouros_6_style.js, para a margem
// acompanhar exatamente a espessura do traço principal em qualquer zoom.
function larguraTracoLogradouroMargin(resolution) {
    var strokeWidth = 3.3744;

    if (typeof map !== 'undefined') {
        var zoom = map.getView().getZoom();

        if (zoom >= 15 && zoom <= 18) {
            var dpi = 96;
            var metersPerUnit = 1;
            var res = map.getView().getResolution();
            var scale = res * 39.37 * dpi / metersPerUnit;

            strokeWidth = 3.7 * (15000 / scale);
        }

        if (strokeWidth < 0.5 || isNaN(strokeWidth)) {
            strokeWidth = 0.5;
        }
    }

    return strokeWidth;
}
 
// Estilo de margem (casing/borda) dos logradouros.
// Só desenha um traço mais largo por baixo — sem texto, sem lógica de label —
// porque essa camada existe só pra dar contorno; o traço principal e o label
// continuam vivendo em Logradouros_6_style.js, na camada de cima.
var style_Logradouros_6_style_Margin = function(feature, resolution) {

     var tipo = feature.get('tipo') || feature.get('tipo_logra') || '';

    if (typeof map !== 'undefined') {
        var zoomAtual = map.getView().getZoom();
        if (zoomAtual < zoomMinimoParaTipo(tipo)) {
            return null;
        }
    }

    // Largura-base, igual à camada principal
    var strokeWidth = larguraTracoLogradouroMargin(resolution);

    // Aplica a hierarquia viária
    var fatorHierarquia = fatorHierarquiaViaria(feature);
    strokeWidth = strokeWidth * fatorHierarquia;

    // Cor do casing
    var casingColor = 'rgb(0, 0, 0)';

    // 1 px adicional ao redor do traço principal
    var casingWidth = strokeWidth + 1;

    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: casingColor,
                lineDash: null,
                lineCap: 'round',
                lineJoin: 'round',
                width: casingWidth
            })
        })
    ];
};