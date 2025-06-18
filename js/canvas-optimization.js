/**
 * Canvas Optimization for OpenLayers
 * 
 * Este script otimiza o desempenho do canvas no OpenLayers definindo
 * o atributo willReadFrequently como true para todos os contextos de canvas
 * criados pelo OpenLayers, eliminando o aviso:
 * "Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true"
 */

(function() {
  // Armazena a função original getContext do HTMLCanvasElement.prototype
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  
  // Substitui a função getContext com nossa versão otimizada
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    // Para contextos '2d', adiciona willReadFrequently = true
    if (contextType === '2d') {
      contextAttributes = contextAttributes || {};
      contextAttributes.willReadFrequently = true;
    }
    
    // Chama a função original com os atributos modificados
    return originalGetContext.call(this, contextType, contextAttributes);
  };
  
  console.log('[canvas-optimization] Canvas 2D contexts optimized with willReadFrequently=true');
})();
