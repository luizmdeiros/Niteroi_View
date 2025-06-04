function categories_Terreno_Niteroi_1(feature, value, size, resolution, labelText, labelFont, labelFill, bufferColor, bufferWidth, placement) {
  var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
  switch(valueStr) {
    case 'Terra':
      return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(225,249,227,0.792)', width: 0.0}),
        fill: new ol.style.Fill({color: 'rgba(214,248,226,0.792)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
      })];
    case 'Areia':
      return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(225,249,227,0.792)', width: 0.0}),
        fill: new ol.style.Fill({color: 'rgba(246,236,207,0.792)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
      })];
    default:
      return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(225,249,227,0.792)', width: 0.0}),
        fill: new ol.style.Fill({color: 'rgba(214,248,226,0.792)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont, placement, bufferColor, bufferWidth)
      })];
  }
}

function style_Terreno_Niteroi_1(feature, resolution) {
  var labelText = "";
  var value = feature.get("Tipo");
  var labelFont = "10px, sans-serif";
  var labelFill = "#000000";
  var bufferColor = "";
  var bufferWidth = 0;
  var placement = 'point';
  return categories_Terreno_Niteroi_1(feature, value, 0, resolution, labelText, labelFont, labelFill, bufferColor, bufferWidth, placement);
}
