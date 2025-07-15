/**
 * PopupManager - Gerenciador de popups para o mapa histórico de Niterói
 * Responsável por criar, exibir e gerenciar popups informativos das features do mapa
 */
class PopupManager {
  constructor(map, logradourosLayer, edifLayer) {
    this.map = map;
    this.logradourosLayer = logradourosLayer;
    this.edifLayer = edifLayer;
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
        min-width: 150px;
        max-width: 300px;
        width: auto;
        height: auto;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 100;
        display: none;
        word-wrap: break-word;
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

    // Esconde popup ao mover mouse fora de features relevantes
    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (!feature) {
        this.hidePopup();
      } else {
        const props = feature.getProperties();
        // Esconde se não for logradouro nem edifício
        if (!this.isLogradouro(props) && !this.isEdificio(props)) {
          this.hidePopup();
        }
      }
    });
  }

  /**
   * Manipula cliques no mapa
   */
  handleMapClick(evt) {
    // Só considera features dos layers desejados
    const feature = this.map.forEachFeatureAtPixel(
      evt.pixel,
      function(f, l) {
        return f;
      },
      {
        layerFilter: (layer) => layer === this.logradourosLayer || layer === this.edifLayer
      }
    );

    if (feature) {
      const props = feature.getProperties();
      // Só mostra popup para logradouros e edifícios históricos
      if (this.isLogradouro(props) || this.isEdificio(props)) {
        const content = this.generatePopupContent(feature);
        this.showPopup(evt.pixel, content);
      } else {
        this.hidePopup();
      }
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
    // Verifica se tem propriedades típicas de edifícios históricos
    // Aceita se tem Tipo definido (mesmo com Nome null) ou se tem Nome com tipo/categoria
    return (props.Tipo && props.Tipo !== null) || 
           (props.tipo && props.tipo !== null) || 
           (props.categoria && props.categoria !== null) ||
           (props.Nome && (props.tipo || props.categoria)) ||
           // Também aceita se tem Bairro e data_abert (indicativo de edifício histórico)
           (props.Bairro && props.data_abert && props.data_abert !== null);
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
    
    // Nome do edifício (se disponível)
    if (props.Nome && props.Nome !== null) {
      html += `<div class="popup-title">${props.Nome}</div>`;
    } else if (props.Tipo && props.Tipo !== null) {
      // Se não tem nome, usa o tipo como título
      html += `<div class="popup-title">${props.Tipo}</div>`;
    } else {
      html += '<div class="popup-title">Edifício Histórico</div>';
    }
    
    // Tipo do edifício (Tipo ou tipo)
    if (props.Tipo && props.Tipo !== null && props.Nome) {
      html += `<div class="popup-info">🏢 Tipo: ${props.Tipo}</div>`;
    } else if (props.tipo && props.tipo !== null) {
      html += `<div class="popup-info">🏢 Tipo: ${props.tipo}</div>`;
    }
    
    // Bairro
    if (props.Bairro && props.Bairro !== null) {
      html += `<div class="popup-info">📍 Bairro: ${props.Bairro}</div>`;
    }
    
    // Endereço
    if (props.Endereço && props.Endereço !== null) {
      html += `<div class="popup-info">🏠 Endereço: ${props.Endereço}</div>`;
    }
    
    // Data de abertura/construção
    if (props.data_abert && props.data_abert !== null) {
      const dataFormatada = this.formatarData(props.data_abert);
      html += `<div class="popup-info">📅 Construção: ${dataFormatada}</div>`;
    }
    
    // Fonte da informação
    if (props.Fonte && props.Fonte !== null) {
      html += `<div class="popup-info">📚 Fonte: ${props.Fonte}</div>`;
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
   * Exibe o popup na posição especificada e garante que fique visível na tela
   */
  showPopup(pixel, content) {
    // Define o conteúdo do popup
    this.popup.innerHTML = content;
    
    // Adiciona classes CSS para estilização
    this.addPopupStyles();
    
    // Torna o popup visível mas fora da tela para medir suas dimensões
    this.popup.style.display = 'block';
    this.popup.style.left = '-9999px';
    this.popup.style.top = '-9999px';
    
    // Força um reflow para garantir que as dimensões sejam calculadas
    void this.popup.offsetWidth;
    
    // Agora podemos obter as dimensões reais
    const popupWidth = this.popup.offsetWidth;
    const popupHeight = this.popup.offsetHeight;
    
    // Obtém dimensões da janela
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calcula a posição inicial (offset do ponto clicado)
    let left = pixel[0] + 10;
    let top = pixel[1] - 30;
    
    // Ajusta posição horizontal para garantir visibilidade
    if (left + popupWidth > windowWidth - 10) {
      // Se o popup ultrapassar a borda direita, posiciona à esquerda do ponto clicado
      left = pixel[0] - popupWidth - 10;
      
      // Se ainda estiver fora da tela, alinha com a borda esquerda
      if (left < 10) {
        left = 10;
      }
    }
    
    // Ajusta posição vertical para garantir visibilidade
    if (top + popupHeight > windowHeight - 10) {
      // Se o popup ultrapassar a borda inferior, posiciona acima do ponto clicado
      top = pixel[1] - popupHeight - 10;
      
      // Se ainda estiver fora da tela, alinha com a borda superior
      if (top < 10) {
        top = 10;
      }
    }
    
    // Garante que o popup não fique sob o header (se houver)
    const headerHeight = document.querySelector('header') ? 
      document.querySelector('header').offsetHeight : 0;
    if (top < headerHeight + 10) {
      top = headerHeight + 10;
    }
    
    // Aplica a posição ajustada
    this.popup.style.left = left + 'px';
    this.popup.style.top = top + 'px';
    
    // Verificação final após renderização para garantir que o popup esteja na tela
    setTimeout(() => {
      // Recalcula dimensões após renderização completa
      const rect = this.popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Ajusta horizontalmente se necessário
      if (rect.right > viewportWidth) {
        left = Math.max(10, viewportWidth - rect.width - 10);
        this.popup.style.left = left + 'px';
      }
      if (rect.left < 0) {
        this.popup.style.left = '10px';
      }
      
      // Ajusta verticalmente se necessário
      if (rect.bottom > viewportHeight) {
        top = Math.max(headerHeight + 10, viewportHeight - rect.height - 10);
        this.popup.style.top = top + 'px';
      }
      if (rect.top < headerHeight) {
        this.popup.style.top = (headerHeight + 10) + 'px';
      }
    }, 0);
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
      `;
      document.head.appendChild(style);
    }
  }
}

// Exporta a classe para uso global
window.PopupManager = PopupManager;

