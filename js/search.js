/**
 * SearchManager - Gerenciador de busca para o mapa histórico de Niterói
 * Responsável por buscar e filtrar elementos no mapa (edifícios históricos e logradouros)
 */
class SearchManager {
  constructor(map, logradourosLayer, edifLayer) {
    this.map = map;
    this.logradourosLayer = logradourosLayer;
    this.edifLayer = edifLayer;
    this.searchResults = [];
    this.searchResultsContainer = null;
    this.searchInput = null;
    this.init();
  }

  /**
   * Inicializa o gerenciador de busca
   */
  init() {
    this.createSearchInterface();
    this.attachEventListeners();
  }

  /**
   * Cria a interface de busca
   */
  createSearchInterface() {
    // Cria o container de busca
    const searchContainer = document.createElement('div');
    searchContainer.id = 'search-container';
    searchContainer.className = 'search-container collapsed';
    
    // Cria o campo de busca
    const searchForm = document.createElement('div');
    searchForm.className = 'search-form';
    
    // Input de busca
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.id = 'search-input';
    this.searchInput.placeholder = 'Buscar lugares, edifícios, ruas...';
    
    // Botão de busca
    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
    
    // Container para resultados
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.id = 'search-results';
    this.resultsContainer.className = 'search-results';
    
    // Adiciona os elementos ao DOM
    searchForm.appendChild(this.searchInput);
    searchForm.appendChild(searchButton);
    searchContainer.appendChild(searchForm);
    searchContainer.appendChild(this.resultsContainer);
    
    // Adiciona ao mapa
    document.getElementById('map').appendChild(searchContainer);
    
    // Adiciona estilos CSS
    this.addSearchStyles();
  }

  /**
   * Adiciona estilos CSS para a interface de busca
   */
  addSearchStyles() {
    if (!document.getElementById('search-styles')) {
      const style = document.createElement('style');
      style.id = 'search-styles';
      style.textContent = `
        .search-container {
          position: absolute;
          top: 10px;
          left: 40px;
          z-index: 1000;
          width: 300px;
          max-width: 90%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          overflow: hidden;
          transition: width 0.3s ease;
        }
        
        /* Estilo para o container colapsado (apenas mostra o botão) */
        .search-container.collapsed {
          width: 40px;
          overflow: hidden;
        }
        
        .search-container.collapsed #search-input {
          width: 0;
          padding: 0;
          opacity: 0;
        }
        
        .search-form {
          display: flex;
          border-bottom: 1px solid #eee;
          width: 100%;
        }
        
        #search-input {
          flex: 1;
          padding: 12px 15px;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: Arial, sans-serif;
          transition: width 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
        }
        
        #search-button {
          background: #1976d2;
          border: none;
          color: white;
          min-width: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        
        #search-button:hover {
          background: #1565c0;
        }
        
        #search-button svg {
          width: 20px;
          height: 20px;
          fill: white;
        }
        
        .search-results {
          max-height: 300px;
          overflow-y: auto;
          display: none;
        }
        
        .search-results.active {
          display: block;
        }
        
        .search-result-item {
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .search-result-item:hover {
          background: #f5f5f5;
        }
        
        .search-result-title {
          font-weight: bold;
          margin-bottom: 3px;
        }
        
        .search-result-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 3px;
        }
        
        .search-result-type {
          font-size: 11px;
          color: #1976d2;
          text-transform: uppercase;
        }
        
        .search-no-results {
          padding: 15px;
          text-align: center;
          color: #666;
        }
        
        .search-results-count {
          padding: 8px 15px;
          font-size: 12px;
          background: #f5f5f5;
          border-bottom: 1px solid #eee;
        }
        
        .search-results-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        @media (max-width: 768px) {
          .search-container {
            width: 250px;
          }
          
          .search-container.collapsed {
            width: 40px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Adiciona event listeners
   */
  attachEventListeners() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.getElementById('search-container');
    
    // Evento de clique no botão de busca
    searchButton.addEventListener('click', (e) => {
      // Se a caixa de busca estiver colapsada, expande ela
      if (searchContainer.classList.contains('collapsed')) {
        searchContainer.classList.remove('collapsed');
        searchInput.focus();
        e.preventDefault(); // Evita a busca no primeiro clique
        return;
      }
      
      // Se já estiver expandida, realiza a busca
      this.performSearch();
    });
    
    // Evento de pressionar Enter no campo de busca
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });
    
    // Evento de foco no campo de busca (mostra resultados anteriores)
    searchInput.addEventListener('focus', () => {
      if (this.searchResults.length > 0) {
        this.resultsContainer.classList.add('active');
      }
    });
    
    // Evento de clique fora da caixa de busca (colapsa a caixa)
    document.addEventListener('click', (e) => {
      // Verifica se o clique foi fora do container de busca
      if (!searchContainer.contains(e.target)) {
        // Só colapsa se não houver texto no input e não houver resultados ativos
        if (searchInput.value.trim() === '' && !this.resultsContainer.classList.contains('active')) {
          searchContainer.classList.add('collapsed');
        }
      }
    });
    
    // Evento de limpar o campo de busca (colapsa a caixa se não houver resultados)
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '' && !this.resultsContainer.classList.contains('active')) {
        // Não colapsa imediatamente para permitir que o usuário digite
      }
    });
  }

  /**
   * Normaliza uma string removendo acentos e convertendo para minúsculas
   */
  normalizeString(str) {
    if (!str) return '';
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, ' ')    // Substitui caracteres especiais por espaço
      .replace(/\s+/g, ' ')           // Remove espaços múltiplos
      .trim();
  }
  
  /**
   * Verifica se um texto contém todas as palavras da consulta
   * @param {string} text - O texto a ser verificado
   * @param {string} query - A consulta de busca
   * @return {boolean} - Verdadeiro se todas as palavras da consulta estão no texto
   */
  containsAllQueryWords(text, query) {
    if (!text || !query) return false;
    
    const textWords = text.split(' ');
    const queryWords = query.split(' ');
    
    return queryWords.every(queryWord => {
      // Verifica se alguma palavra do texto contém a palavra da consulta
      return textWords.some(textWord => textWord.includes(queryWord));
    });
  }
  
  /**
   * Calcula a pontuação de relevância para um resultado
   * @param {string} text - O texto onde a busca foi encontrada
   * @param {string} query - A consulta de busca
   * @param {string} type - O tipo de resultado (edificio ou logradouro)
   * @return {number} - Pontuação de relevância
   */
  calculateRelevance(text, query, type) {
    if (!text || !query) return 0;
    
    let score = 0;
    const normalizedText = this.normalizeString(text);
    const normalizedQuery = this.normalizeString(query);
    
    // Correspondência exata tem pontuação mais alta
    if (normalizedText === normalizedQuery) {
      score += 100;
    }
    
    // Texto começa com a consulta
    if (normalizedText.startsWith(normalizedQuery)) {
      score += 50;
    }
    
    // Pontuação por palavra da consulta encontrada
    const queryWords = normalizedQuery.split(' ');
    queryWords.forEach(word => {
      if (normalizedText.includes(word)) {
        score += 10;
      }
    });
    
    // Prioriza edifícios sobre logradouros (pode ser invertido se necessário)
    if (type === 'edificio') {
      score += 5;
    }
    
    return score;
  }

  /**
   * Realiza a busca
   */
  performSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    if (query === '') {
      this.clearResults();
      return;
    }
    
    this.searchResults = [];
    
    // Busca em edifícios históricos
    this.searchInEdificios(query);
    
    // Busca em logradouros
    this.searchInLogradouros(query);
    
    // Exibe resultados
    this.displayResults();
  }

  /**
   * Busca em edifícios históricos
   */
  searchInEdificios(query) {
    const features = this.edifLayer.getSource().getFeatures();
    const normalizedQuery = this.normalizeString(query);
    const queryWords = normalizedQuery.split(' ');
    
    features.forEach(feature => {
      const props = feature.getProperties();
      
      // Normaliza os textos para busca sem acentos e case insensitive
      const nomeNorm = props.Nome ? this.normalizeString(props.Nome) : '';
      const bairroNorm = props.Bairro ? this.normalizeString(props.Bairro) : '';
      const tipoNorm = props.Tipo ? this.normalizeString(props.Tipo) : '';
      const enderecoNorm = props.Endereço ? this.normalizeString(props.Endereço) : '';
      
      // Verifica se alguma propriedade relevante contém o termo de busca
      // ou se contém todas as palavras da consulta
      if (
        nomeNorm.includes(normalizedQuery) ||
        bairroNorm.includes(normalizedQuery) ||
        tipoNorm.includes(normalizedQuery) ||
        enderecoNorm.includes(normalizedQuery) ||
        this.containsAllQueryWords(nomeNorm, normalizedQuery) ||
        this.containsAllQueryWords(enderecoNorm, normalizedQuery)
      ) {
        // Calcula relevância para ordenar resultados
        const relevance = this.calculateRelevance(
          props.Nome || '', 
          query, 
          'edificio'
        );
        
        // Prepara informações adicionais para exibição
        let info = [];
        if (props.Bairro) info.push(props.Bairro);
        if (props.Endereço) info.push(props.Endereço);
        if (props.Tipo && !props.Nome) info.push(props.Tipo);
        
        this.searchResults.push({
          feature: feature,
          title: props.Nome || props.Tipo || 'Edifício Histórico',
          info: info.join(' - '),
          type: 'edificio',
          geometry: feature.getGeometry(),
          relevance: relevance
        });
      }
    });
  }

  /**
   * Busca em logradouros (ruas)
   */
  
  searchInLogradouros(query) {
    const features = this.logradourosLayer.getSource().getFeatures();
    const normalizedQuery = this.normalizeString(query);
    const queryWords = normalizedQuery.split(' ');
    
    features.forEach(feature => {
      const props = feature.getProperties();
      
      // Normaliza os textos para busca sem acentos e case insensitive
      const nomeComplNorm = props.nome_compl ? this.normalizeString(props.nome_compl) : '';
      const nomePopNorm = props.nome_pop ? this.normalizeString(props.nome_pop) : '';
      const noAntNorm = props.no_ant ? this.normalizeString(props.no_ant) : '';
      const bairroEsqNorm = props.bairro_esq ? this.normalizeString(props.bairro_esq) : '';
      const tipoLogradouro = props.tipo ? this.normalizeString(props.tipo) : '';
      
      // Combina nome com tipo de logradouro para busca mais eficiente
      const fullNameNorm = `${tipoLogradouro} ${nomeComplNorm}`.trim();
      
      // Verifica se alguma propriedade relevante contém o termo de busca
      // ou se contém todas as palavras da consulta
      if (
        nomeComplNorm.includes(normalizedQuery) ||
        nomePopNorm.includes(normalizedQuery) ||
        noAntNorm.includes(normalizedQuery) ||
        bairroEsqNorm.includes(normalizedQuery) ||
        fullNameNorm.includes(normalizedQuery) ||
        this.containsAllQueryWords(nomeComplNorm, normalizedQuery) ||
        this.containsAllQueryWords(nomePopNorm, normalizedQuery) ||
        this.containsAllQueryWords(fullNameNorm, normalizedQuery)
      ) {
        // Calcula relevância para ordenar resultados
        const relevance = this.calculateRelevance(
          props.nome_compl || props.nome_pop || '', 
          query, 
          'logradouro'
        );
        
        // Prepara informações adicionais para exibição
        let title = props.nome_compl || props.nome_pop || 'Logradouro';
        if (props.tipo_logra && !title.toLowerCase().includes(props.tipo_logra.toLowerCase())) {
          title = `${props.tipo_logra} ${title}`;
        }
        
        let info = [];
        if (props.bairro_esq) info.push(props.bairro_esq);
        if (props.no_ant && props.no_ant !== props.nome_compl && props.no_ant !== props.nome_pop) {
          info.push(`Antigo: ${props.no_ant}`);
        }
        
        this.searchResults.push({
          feature: feature,
          title: title,
          info: info.join(' - '),
          type: 'logradouro',
          geometry: feature.getGeometry(),
          relevance: relevance
        });
      }
    });
  }

  /**
   * Exibe os resultados da busca
   */
displayResults() {
  this.resultsContainer.innerHTML = '';                // limpa só o DOM
  this.resultsContainer.classList.add('active');

  if (this.searchResults.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'search-no-results';
    noResults.textContent = 'Nenhum resultado encontrado';
    this.resultsContainer.appendChild(noResults);
    return;
  }
    
    // Ordena resultados por relevância
    this.searchResults.sort((a, b) => {
      // Se a relevância for igual, mantém a ordem original (edifícios primeiro)
      if (b.relevance === a.relevance) {
        if (a.type === 'edificio' && b.type !== 'edificio') return -1;
        if (a.type !== 'edificio' && b.type === 'edificio') return 1;
        return a.title.localeCompare(b.title);
      }
      return b.relevance - a.relevance;
    });
    
    // Cria lista de resultados
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-results-list';
    
    // Adiciona contador de resultados
    const resultsCount = document.createElement('div');
    resultsCount.className = 'search-results-count';
    resultsCount.textContent = `${this.searchResults.length} resultado(s) encontrado(s)`;
    this.resultsContainer.appendChild(resultsCount);
    
    this.searchResults.forEach((result, index) => {
      const resultItem = document.createElement('li');
      resultItem.className = 'search-result-item';
      resultItem.setAttribute('data-index', index);
      
      const resultTitle = document.createElement('div');
      resultTitle.className = 'search-result-title';
      resultTitle.textContent = result.title;
      
      const resultInfo = document.createElement('div');
      resultInfo.className = 'search-result-info';
      resultInfo.textContent = result.info || '';
      
      const resultType = document.createElement('div');
      resultType.className = 'search-result-type';
      resultType.textContent = result.type === 'edificio' ? 'Edifício' : 'Logradouro';
      
      resultItem.appendChild(resultTitle);
      if (result.info) resultItem.appendChild(resultInfo);
      resultItem.appendChild(resultType);
      
      resultItem.addEventListener('click', () => this.navigateToResult(index));
      
      resultsList.appendChild(resultItem);
    });
    
    this.resultsContainer.appendChild(resultsList);
  }

  /**
   * Navega até um resultado específico
   */
  navigateToResult(index) {
    const result = this.searchResults[index];
    if (!result) return;
    
    // Obtém a geometria e centraliza o mapa
    const geometry = result.geometry;
    const extent = geometry.getExtent();
    
    // Anima o zoom para o resultado
    this.map.getView().fit(extent, {
      duration: 1000,
      padding: [50, 50, 50, 50],
      maxZoom: 18
    });
    
    // Simula um clique no mapa para mostrar o popup
    setTimeout(() => {
      const center = ol.extent.getCenter(extent);
      const pixel = this.map.getPixelFromCoordinate(center);
      
      // Dispara um evento de clique simulado
      const clickEvent = new CustomEvent('click', {
        bubbles: true,
        cancelable: true
      });
      
      // Adiciona propriedades do evento de clique do OpenLayers
      clickEvent.pixel = pixel;
      clickEvent.coordinate = center;
      
      // Dispara o evento no mapa
      this.map.dispatchEvent(clickEvent);
    }, 1100);
  }

  /**
   * Limpa os resultados da busca
   */
clearResults() {
  this.searchResults = [];
  this.resultsContainer.innerHTML = '';
  this.resultsContainer.classList.remove('active');   // <-- ADICIONAR ESTA LINHA
}
}

// Exporta a classe para uso global
window.SearchManager = SearchManager;