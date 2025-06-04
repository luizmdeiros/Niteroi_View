function style_CurvasdeNvel_5(feature, resolution) {
  var labelText = "";
  var labelFont = "10px, sans-serif";
  var labelFill = "#000000";
  var bufferColor = "";
  var bufferWidth = 0;
  var placement = 'line';
  return [ new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(149,149,149,0.17)', width: 0.76, lineCap: 'square', lineJoin: 'bevel'}),
    text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
  })];
}
