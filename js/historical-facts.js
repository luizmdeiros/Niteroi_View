/**
 * Sistema de Fatos Históricos para Niterói View
 * Exibe eventos históricos relevantes conforme o ano selecionado
 * Inclui navegação para locais históricos no mapa
 */
class HistoricalFactsManager {
  constructor(timelineElement, mapInstance) {
    this.timeline = timelineElement;
    this.map = mapInstance; // Referência ao mapa OpenLayers
    this.factsButton = document.getElementById('facts-button');
    this.factsPanel = document.getElementById('timeline-facts-panel');
    this.factsContainer = document.getElementById('facts-container');
    this.expanded = false;
    this.currentYear = parseInt(this.timeline.value);
    this.facts = this.loadHistoricalFacts();
    this.locationMarker = null; // Marcador para destacar localização
    this.activeFilters = []; // Filtros ativos (vazio = mostrar todos)
    this.categories = [
      { id: 'politica', name: 'Política', color: '#e74c3c' },
      { id: 'urbanismo', name: 'Urbanismo', color: '#3498db' },
      { id: 'cultura', name: 'Cultura', color: '#9b59b6' },
      { id: 'transporte', name: 'Transporte', color: '#2ecc71' },
      { id: 'social', name: 'Social', color: '#f39c12' }
    ];
    
    this.initEventListeners();
    this.createFilterButtons();
    this.updateFactsForYear(this.currentYear);
  }
  
  initEventListeners() {
    // Toggle para expandir/recolher o painel
    this.factsButton.addEventListener('click', () => this.toggleFactsPanel());
    
    // Atualizar fatos quando o ano mudar
    this.timeline.addEventListener('input', () => {
      this.currentYear = parseInt(this.timeline.value);
      this.updateFactsForYear(this.currentYear);
    });
  }
  
  createFilterButtons() {
    // Criar container para os filtros se não existir
    if (!document.getElementById('facts-filters')) {
      const filtersContainer = document.createElement('div');
      filtersContainer.id = 'facts-filters';
      filtersContainer.className = 'facts-filters';
      
      // Botão "Todos" para limpar filtros
      const allButton = document.createElement('button');
      allButton.className = 'filter-button active';
      allButton.textContent = 'Todos';
      allButton.addEventListener('click', () => {
        this.activeFilters = [];
        
        // Atualizar estado visual dos botões
        document.querySelectorAll('.filter-button').forEach(btn => {
          btn.classList.remove('active');
        });
        allButton.classList.add('active');
        
        this.updateFactsForYear(this.currentYear);
      });
      filtersContainer.appendChild(allButton);
      
      // Criar um botão para cada categoria
      this.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.dataset.category = category.id;
        button.style.borderColor = category.color;
        
        // Criar indicador de cor
        const colorDot = document.createElement('span');
        colorDot.className = 'category-dot';
        colorDot.style.backgroundColor = category.color;
        button.appendChild(colorDot);
        
        // Adicionar nome da categoria
        const text = document.createTextNode(category.name);
        button.appendChild(text);
        
        // Adicionar evento de clique para filtrar
        button.addEventListener('click', () => {
          // Se já estiver ativo, remover do filtro
          const index = this.activeFilters.indexOf(category.id);
          if (index > -1) {
            this.activeFilters.splice(index, 1);
            button.classList.remove('active');
          } else {
            // Adicionar ao filtro
            this.activeFilters.push(category.id);
            button.classList.add('active');
          }
          
          // Se não houver filtros ativos, ativar o botão "Todos"
          if (this.activeFilters.length === 0) {
            allButton.classList.add('active');
          } else {
            allButton.classList.remove('active');
          }
          
          this.updateFactsForYear(this.currentYear);
        });
        
        filtersContainer.appendChild(button);
      });
      
      // Inserir antes do container de fatos
      this.factsPanel.insertBefore(filtersContainer, this.factsContainer);
    }
  }
  
  toggleFactsPanel() {
    this.expanded = !this.expanded;
    
    if (this.expanded) {
      this.factsButton.classList.add('expanded');
      this.factsPanel.classList.add('expanded');
    } else {
      this.factsButton.classList.remove('expanded');
      this.factsPanel.classList.remove('expanded');
    }
  }
  
  updateFactsForYear(year) {
    // Limpar container
    this.factsContainer.innerHTML = '';
    
    // Filtrar fatos relevantes (do ano atual e até 10 anos antes)
    let relevantFacts = this.facts.filter(fact => 
      fact.year <= year && fact.year >= year - 10
    );
    
    // Aplicar filtro por categoria, se houver filtros ativos
    if (this.activeFilters.length > 0) {
      relevantFacts = relevantFacts.filter(fact => 
        this.activeFilters.includes(fact.category)
      );
    }
    
    // Ordenar do mais recente para o mais antigo
    relevantFacts.sort((a, b) => b.year - a.year);
    
    if (relevantFacts.length === 0) {
      this.factsContainer.innerHTML = `
        <div class="no-facts">
          <p>Nenhum fato histórico registrado para este período${this.activeFilters.length > 0 ? ' com os filtros selecionados' : ''}.</p>
          <p>${this.activeFilters.length > 0 ? 'Tente selecionar outras categorias ou ' : ''}Tente mover o controle deslizante para outro ano.</p>
        </div>
      `;
      return;
    }
    
    // Criar cards para cada fato
    relevantFacts.forEach(fact => {
      const card = document.createElement('div');
      card.className = 'fact-card';
      
      // Adicionar borda colorida baseada na categoria
      if (fact.category) {
        const categoryData = this.categories.find(c => c.id === fact.category);
        if (categoryData) {
          card.style.borderLeft = `4px solid ${categoryData.color}`;
        }
      }
      
      // Botão de navegação para o mapa (apenas se tiver coordenadas)
      let locationButton = '';
      if (fact.location) {
        locationButton = `
          <button class="location-button" title="Ver no mapa">
            <svg viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"></path></svg>
            Ver no mapa
          </button>
        `;
      }
      
      // Badge de categoria
      let categoryBadge = '';
      if (fact.category) {
        const categoryData = this.categories.find(c => c.id === fact.category);
        if (categoryData) {
          categoryBadge = `
            <span class="category-badge" style="background-color: ${categoryData.color}">
              ${categoryData.name}
            </span>
          `;
        }
      }
      
      card.innerHTML = `
        <div class="fact-header">
          <div class="fact-year">${fact.year}</div>
          ${categoryBadge}
        </div>
        <div class="fact-title">${fact.title}</div>
        <div class="fact-description">${fact.description}</div>
        ${locationButton}
      `;
      
      this.factsContainer.appendChild(card);
      
      // Adicionar evento de clique ao botão se existir
      if (fact.location) {
        const button = card.querySelector('.location-button');
        button.addEventListener('click', () => this.navigateToLocation(fact));
      }
    });
  }
  
  // Método para navegar até o local do evento histórico
  navigateToLocation(fact) {
    // Remover marcador anterior se existir
    this.removeLocationMarker();
    
    // Converter coordenadas de EPSG:4326 (lon/lat) para EPSG:3857 (projeção do mapa)
    const coordinates = ol.proj.fromLonLat([fact.location.lon, fact.location.lat]);
    
    // Animar o mapa para a localização
    this.map.getView().animate({
      center: coordinates,
      zoom: fact.location.zoom || 16,
      duration: 1000
    });
    
    // Criar um marcador temporário
    this.createLocationMarker(coordinates, fact);
    
    // Fechar o painel de fatos para melhor visualização do mapa
    if (this.expanded) {
      this.toggleFactsPanel();
    }
  }
  
  // Criar marcador temporário para destacar o local
  createLocationMarker(coordinates, fact) {
    // Criar feature para o marcador
    const markerFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates),
      name: fact.title,
      description: fact.description,
      year: fact.year
    });
    
    // Estilo do marcador
    const markerStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({ color: 'rgba(255, 107, 107, 0.8)' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
      }),
      // Adicionar texto ao marcador
      text: new ol.style.Text({
        text: fact.title,
        font: 'bold 14px Arial',
        fill: new ol.style.Fill({ color: '#333' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 3 }),
        offsetY: -20,
        textAlign: 'center'
      })
    });
    
    markerFeature.setStyle(markerStyle);
    
    // Criar source e layer para o marcador
    const markerSource = new ol.source.Vector({
      features: [markerFeature]
    });
    
    this.locationMarker = new ol.layer.Vector({
      source: markerSource,
      zIndex: 1000 // Garantir que fique acima de outras camadas
    });
    
    // Adicionar ao mapa
    this.map.addLayer(this.locationMarker);
    
    // Adicionar efeito de pulsação (opcional)
    this.addPulseEffect(markerFeature);
  }
  
  // Adicionar efeito de pulsação ao marcador
  addPulseEffect(markerFeature) {
    let start = new Date().getTime();
    const duration = 2000; // 2 segundos por pulsação
    const originalStyle = markerFeature.getStyle();
    
    const animate = () => {
      const elapsed = (new Date().getTime() - start) % duration;
      const ratio = elapsed / duration;
      
      // Calcular tamanho do círculo baseado no tempo
      const radius = 10 + (ratio < 0.5 ? ratio * 10 : (1 - ratio) * 10);
      const opacity = 1 - (ratio * 0.6);
      
      const pulseStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          fill: new ol.style.Fill({ 
            color: `rgba(255, 107, 107, ${opacity})` 
          }),
          stroke: new ol.style.Stroke({ 
            color: `rgba(255, 255, 255, ${opacity})`, 
            width: 2 
          })
        }),
        text: originalStyle.getText()
      });
      
      markerFeature.setStyle(pulseStyle);
      
      // Continuar animação
      this.pulseAnimationId = window.requestAnimationFrame(animate);
    };
    
    // Iniciar animação
    this.pulseAnimationId = window.requestAnimationFrame(animate);
    
    // Parar animação após 10 segundos
    setTimeout(() => {
      if (this.pulseAnimationId) {
        window.cancelAnimationFrame(this.pulseAnimationId);
        this.pulseAnimationId = null;
        markerFeature.setStyle(originalStyle);
      }
    }, 10000);
  }
  
  // Remover marcador do mapa
  removeLocationMarker() {
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
      this.locationMarker = null;
    }
    
    if (this.pulseAnimationId) {
      window.cancelAnimationFrame(this.pulseAnimationId);
      this.pulseAnimationId = null;
    }
  }
  
  loadHistoricalFacts() {
    // Dados estáticos de exemplo - podem ser carregados de um JSON externo no futuro
    return [
      {
        year: 1819,
        title: "Elevação à Vila",
        description: "A Vila Real da Praia Grande foi criada em 10 de maio de 1819, separando-se da cidade do Rio de Janeiro.",
        category: "politica",
        location: {
          lat: -22.8932,
          lon: -43.1245,
          zoom: 15
        }
      },
      {
        year: 1834,
        title: "Capital da Província",
        description: "A Vila Real da Praia Grande tornou-se a capital da província do Rio de Janeiro em 1834.",
        category: "politica",
        location: {
          lat: -22.8932,
          lon: -43.1245,
          zoom: 15
        }
      },
      {
        year: 1835,
        title: "Elevação à Cidade",
        description: "Em 22 de novembro de 1835, a Vila Real da Praia Grande foi elevada à categoria de cidade, recebendo o nome de Niterói.",
        category: "politica",
        location: {
          lat: -22.8932,
          lon: -43.1245,
          zoom: 15
        }
      },
      {
        year: 1841,
        title: "Visita Imperial",
        description: "O Imperador Dom Pedro II fez sua primeira visita oficial à cidade de Niterói.",
        category: "politica",
        location: {
          lat: -22.8865,
          lon: -43.1205,
          zoom: 16
        }
      },
      {
        year: 1854,
        title: "Primeira Linha de Barcos a Vapor",
        description: "Inauguração da primeira linha regular de barcos a vapor entre Niterói e Rio de Janeiro.",
        category: "transporte",
        location: {
          lat: -22.8962,
          lon: -43.1230,
          zoom: 16
        }
      },
      {
        year: 1862,
        title: "Iluminação a Gás",
        description: "Niterói recebe iluminação pública a gás, modernizando a cidade.",
        category: "urbanismo"
      },
      {
        year: 1872,
        title: "Primeira Linha de Bondes",
        description: "Inauguração da primeira linha de bondes puxados por burros em Niterói.",
        category: "transporte",
        location: {
          lat: -22.8880,
          lon: -43.1170,
          zoom: 16
        }
      },
      {
        year: 1883,
        title: "Fundação da Biblioteca Pública",
        description: "Criação da Biblioteca Pública de Niterói, importante centro cultural da cidade.",
        category: "cultura",
        location: {
          lat: -22.8905,
          lon: -43.1175,
          zoom: 17
        }
      },
      {
        year: 1893,
        title: "Revolta da Armada",
        description: "Durante a Revolta da Armada, Niterói foi bombardeada por navios rebeldes, causando grande destruição.",
        category: "politica",
        location: {
          lat: -22.8962,
          lon: -43.1230,
          zoom: 15
        }
      },
      {
        year: 1903,
        title: "Bondes Elétricos",
        description: "Inauguração dos bondes elétricos em Niterói, substituindo os bondes puxados por tração animal.",
        category: "transporte",
        location: {
          lat: -22.8880,
          lon: -43.1170,
          zoom: 16
        }
      },
      {
        year: 1908,
        title: "Reforma Urbana",
        description: "Início da grande reforma urbana de Niterói, com abertura de avenidas e modernização da infraestrutura.",
        category: "urbanismo",
        location: {
          lat: -22.8900,
          lon: -43.1190,
          zoom: 15
        }
      }
    ];
  }
}
