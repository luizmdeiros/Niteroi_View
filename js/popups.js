/**
 * PopupManager - Gerenciador de popups para o mapa histórico de Niterói
 * Responsável por criar, exibir e gerenciar popups informativos das features do mapa
 */
class PopupManager {
  constructor(map) {
    this.map = map;
    this.popup = null;
    this.init();
  }

  /**
   * Inicializa o popup manager
   */
  init() {
    this.createPopupElement();
    this.attachEventListeners();
  }

  /**
   * Cria o elemento HTML do popup
   */
  createPopupElement() {
    // Verifica se já existe um popup
    let existingPopup = document.getElementById('popup');
    if (!existingPopup) {
      // Cria o elemento popup se não existir
      this.popup = document.createElement('div');
      this.popup.id = 'popup';
      this.popup.style.cssText = `
        position: absolute;
        background: white;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        bottom: 12px;
        left: -50px;
        min-width: 180px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 100;
        display: none;
      `;
      document.body.appendChild(this.popup);
    } else {
      this.popup = existingPopup;
    }
  }

  /**
   * Adiciona event listeners para o mapa
   */
  attachEventListeners() {
    this.map.on('singleclick', (evt) => {
      this.handleMapClick(evt);
    });

    // Esconde popup ao clicar fora
    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (!feature) {
        this.hidePopup();
      }
    });
  }

  /**
   * Manipula cliques no mapa
   */
  handleMapClick(evt) {
    const feature = this.map.forEachFeatureAtPixel(evt.pixel, f => f);
    
    if (feature) {
      const content = this.generatePopupContent(feature);
      this.showPopup(evt.pixel, content);
    } else {
      this.hidePopup();
    }
  }

  /**
   * Gera o conteúdo do popup baseado na feature
   */
  generatePopupContent(feature) {
    const props = feature.getProperties();
    
    // Detecta o tipo de feature e usa template apropriado
    if (this.isLogradouro(props)) {
      return this.createLogradouroTemplate(props);
    } else if (this.isEdificio(props)) {
      return this.createEdificioTemplate(props);
    } else if (this.isAreaUrbana(props)) {
      return this.createAreaUrbanaTemplate(props);
    } else {
      return this.createGenericTemplate(props);
    }
  }

  /**
   * Verifica se é um logradouro (rua)
   */
  isLogradouro(props) {
    return props.nome_compl || props.nome_pop;
  }

  /**
   * Verifica se é um edifício
   */
  isEdificio(props) {
    return props.Nome && (props.tipo || props.categoria);
  }

  /**
   * Verifica se é área urbana
   */
  isAreaUrbana(props) {
    return props.area || props.bairro;
  }

  /**
   * Template para logradouros (ruas)
   */
  createLogradouroTemplate(props) {
    let html = '<div class="popup-logradouro">';
    
    // Nome principal
    if (props.nome_compl) {
      html += `<div class="popup-title">${props.nome_compl}</div>`;
    }
    
    // Nome popular
    if (props.nome_pop && props.nome_pop !== '-') {
      html += `<div class="popup-subtitle"><em>(${props.nome_pop})</em></div>`;
    }
    
    // Nome anterior
    if (props.no_ant && props.no_ant !== '-') {
      html += `<div class="popup-info"><small>📜 Nome anterior: ${props.no_ant}</small></div>`;
    }
    
    // Bairro
    if (props.bairro_esq) {
      html += `<div class="popup-info">📍 Bairro: ${props.bairro_esq}</div>`;
    }
    
    // Data de abertura
    if (props.data_abert) {
      const dataFormatada = this.formatarData(props.data_abert);
      html += `<div class="popup-info">📅 Abertura: ${dataFormatada}</div>`;
    }
    
    // Legislação
    if (props.legislacao && props.legislacao !== '-') {
      html += `<div class="popup-info">🏛️ Legislação: ${props.legislacao}</div>`;
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Template para edifícios
   */
  createEdificioTemplate(props) {
    let html = '<div class="popup-edificio">';
    
    if (props.Nome) {
      html += `<div class="popup-title">${props.Nome}</div>`;
    }
    
    if (props.tipo) {
      html += `<div class="popup-info">🏢 Tipo: ${props.tipo}</div>`;
    }
    
    if (props.data_abert) {
      const dataFormatada = this.formatarData(props.data_abert);
      html += `<div class="popup-info">📅 Construção: ${dataFormatada}</div>`;
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Template para área urbana
   */
  createAreaUrbanaTemplate(props) {
    let html = '<div class="popup-area">';
    
    if (props.nome || props.Nome) {
      html += `<div class="popup-title">${props.nome || props.Nome}</div>`;
    }
    
    if (props.bairro) {
      html += `<div class="popup-info">📍 ${props.bairro}</div>`;
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Template genérico para outras features
   */
  createGenericTemplate(props) {
    let html = '<div class="popup-generic">';
    
    if (props.Nome || props.nome) {
      html += `<div class="popup-title">${props.Nome || props.nome}</div>`;
    } else {
      html += '<div class="popup-title">Informação do Mapa</div>';
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Formata datas para exibição mais amigável
   */
  formatarData(dataString) {
    if (!dataString) return '';
    
    // Se é apenas ano (4 dígitos)
    if (dataString.length === 4) {
      return dataString;
    }
    
    // Se tem formato de data completa, tenta formatar
    try {
      const data = new Date(dataString);
      if (!isNaN(data.getTime())) {
        return data.toLocaleDateString('pt-BR');
      }
    } catch (e) {
      // Se falhar, retorna string original
    }
    
    return dataString;
  }

  /**
   * Exibe o popup na posição especificada
   */
  showPopup(pixel, content) {
    this.popup.innerHTML = content;
    this.popup.style.display = 'block';
    this.popup.style.left = (pixel[0] + 10) + 'px';
    this.popup.style.top = (pixel[1] - 30) + 'px';
    
    // Adiciona classes CSS para estilização
    this.addPopupStyles();
  }

  /**
   * Esconde o popup
   */
  hidePopup() {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }

  /**
   * Adiciona estilos CSS dinâmicos para o popup
   */
  addPopupStyles() {
    // Verifica se os estilos já foram adicionados
    if (!document.getElementById('popup-styles')) {
      const style = document.createElement('style');
      style.id = 'popup-styles';
      style.textContent = `
        .popup-title {
          font-weight: bold;
          font-size: 16px;
          color: #1976d2;
          margin-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 4px;
        }
        
        .popup-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 6px;
        }
        
        .popup-info {
          font-size: 13px;
          color: #444;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        
        .popup-info:last-child {
          margin-bottom: 0;
        }
        
        .popup-logradouro {
          max-width: 250px;
        }
        
        .popup-edificio {
          max-width: 220px;
        }
        
        .popup-area {
          max-width: 200px;
        }
        
        .popup-generic {
          max-width: 180px;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Exporta a classe para uso global
window.PopupManager = PopupManager;
