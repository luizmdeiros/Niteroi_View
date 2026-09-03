var size = 0;
var placement = 'point';
function categories_Terreno_Niteroi_1(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement) {
                var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
                switch(valueStr) {case 'Terra':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(180,208,123,1)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.0}),
        fill: new ol.style.Fill({color: 'rgba(180,208,123,1)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Areia':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(254,225,147,1)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.0}),
        fill: new ol.style.Fill({color: 'rgba(254,225,147,1)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;}};

var style_Terreno_Niteroi_1 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("Tipo");
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
    
    var style = categories_Terreno_Niteroi_1(feature, value, size, resolution, labelText,
                            labelFont, labelFill, bufferColor,
                            bufferWidth, placement);

    return style;
};
