function style_Agua_Niteroi_0(feature, resolution) {
  var labelText = "";
  var labelFont = "10px, sans-serif";
  var labelFill = "#000000";
  var bufferColor = "";
  var bufferWidth = 0;
  var placement = 'point';
  return [ new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(149,214,233,1.0)', width: 0.0}),
    fill: new ol.style.Fill({color: 'rgba(152,218,238,1.0)'}),
    text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
  })];
}
