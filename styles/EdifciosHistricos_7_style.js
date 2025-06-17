var size = 0;
var placement = 'point';

var style_EdifciosHistricos_7 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("");
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    // Lógica para cor verde quando Tipo ou tipo for 'Praça'
    var tipo = feature.get('Tipo') || feature.get('tipo');
    var fillColor = (tipo === 'Praça') ? 'rgba(72,181,118,1.0)' : 'rgba(150,150,150,1.0)';
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(247,247,247,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.988}),
        fill: new ol.style.Fill({color: fillColor}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];

    return style;
};
