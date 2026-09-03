var size = 0;
var placement = 'point';
 
// Calcula a largura do traço (em px) para uma feature de logradouro, dado o zoom/resolução atuais.
// Precisa ser IDÊNTICA à mesma função em Logradouros_6_style.js, para a margem
// acompanhar exatamente a espessura do traço principal em qualquer zoom.
function larguraTracoLogradouroMargin(resolution) {
    var strokeWidth = 3.3744; // padrão
    if (typeof map !== 'undefined') {
        var zoom = map.getView().getZoom();
        if (zoom >= 15 && zoom <= 18) {
            var dpi = 96;
            var metersPerUnit = 1; // EPSG:3857 já está em metros
            var res = map.getView().getResolution();
            var scale = res * 39.37 * dpi / metersPerUnit;
            strokeWidth = 3.7 * (15000 / scale); // 3.7px na escala 1:15000
        }
        if (strokeWidth < 0.5 || isNaN(strokeWidth)) strokeWidth = 0.5;
    }
    return strokeWidth;
}
 
// Estilo de margem (casing/borda) dos logradouros.
// Só desenha um traço mais largo por baixo — sem texto, sem lógica de label —
// porque essa camada existe só pra dar contorno; o traço principal e o label
// continuam vivendo em Logradouros_6_style.js, na camada de cima.
var style_Logradouros_6_style_Margin = function(feature, resolution) {
    var strokeWidth = larguraTracoLogradouroMargin(resolution);
 
    var casingColor = 'rgb(0, 0, 0)'; // tom terroso discreto, puxa a mesma família da mancha urbana
    var casingWidth = strokeWidth + 1; // 1px de borda visível de cada lado
 
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