function style_EdifciosHistricos_7(feature, resolution) {
  var labelText = "";
  var labelFont = "10px, sans-serif";
  var labelFill = "#000000";
  var bufferColor = "";
  var bufferWidth = 0;
  var placement = 'point';
  return [ new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(247,247,247,1.0)', width: 0.988}),
    fill: new ol.style.Fill({color: 'rgba(150,150,150,1.0)'}),
    text: createTextStyle(feature, resolution, labelText, labelFont, labelFill, placement, bufferColor, bufferWidth)
  })];
}
