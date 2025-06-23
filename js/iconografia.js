/**
 * Iconografia.js
 * Script para gerenciar a funcionalidade da página de Iconografia do projeto Niterói View
 * Versão atualizada para trabalhar com miniaturas e imagens completas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar elementos do DOM
    const filtros = document.querySelectorAll('.filtro-btn');
    const galeriaContainer = document.querySelector('.galeria-container');
    const modal = document.getElementById('imagem-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalLegenda = document.getElementById('modal-legenda');
    const fecharModal = document.querySelector('.fechar-modal');
    
    // Carregar dados do JSON
    carregarImagensDoJSON();
    
    // Função para carregar imagens do arquivo JSON
    function carregarImagensDoJSON() {
        fetch('data/iconografia.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o arquivo JSON: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Limpar a galeria existente
                galeriaContainer.innerHTML = '';
                
                // Adicionar cada imagem à galeria
                data.imagens.forEach(imagem => {
                    adicionarImagemNaGaleria(imagem);
                });
                
                // Adicionar eventos de clique às imagens após carregá-las
                adicionarEventosClique();
            })
            .catch(error => {
                console.error('Erro ao carregar as imagens:', error);
                galeriaContainer.innerHTML = `
                    <div class="erro-carregamento">
                        <p>Não foi possível carregar as imagens. Por favor, tente novamente mais tarde.</p>
                        <p>Erro: ${error.message}</p>
                    </div>
                `;
            });
    }
    
    // Função para adicionar uma imagem na galeria
    function adicionarImagemNaGaleria(imagem) {
        const imagemElement = document.createElement('div');
        imagemElement.className = 'galeria-item';
        imagemElement.setAttribute('data-periodo', imagem.periodo);
        imagemElement.setAttribute('data-id', imagem.id);
        
        // Verificar se estamos usando o novo formato com arquivos separados para thumb e full
        const thumbSrc = imagem.arquivos ? 
            `images/iconografia/${imagem.arquivos.thumb}` : 
            `images/iconografia/${imagem.arquivo}`;
            
        const fullSrc = imagem.arquivos ? 
            `images/iconografia/${imagem.arquivos.full}` : 
            `images/iconografia/${imagem.arquivo}`;
        
        // Criar o HTML da imagem com seus metadados
        const legenda = `
            <p><strong>Título:</strong> ${imagem.titulo}</p>
            <p><strong>Ano:</strong> ${imagem.ano}</p>
            <p><strong>Autor:</strong> ${imagem.autor}</p>
            <p><strong>Fonte:</strong> ${imagem.fonte}</p>
            <p>${imagem.descricao}</p>
        `;
        
        imagemElement.innerHTML = `
            <img src="${thumbSrc}" 
                 alt="${imagem.titulo}" 
                 data-full="${fullSrc}"
                 data-legenda="${legenda}" 
                 loading="lazy">
            <div class="galeria-info">
                <h3>${imagem.titulo}</h3>
                <p>${imagem.ano}</p>
            </div>
        `;
        
        galeriaContainer.appendChild(imagemElement);
    }
    
    // Adicionar evento de clique aos botões de filtro
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            // Remover classe ativa de todos os filtros
            filtros.forEach(f => f.classList.remove('ativo'));
            
            // Adicionar classe ativa ao filtro clicado
            this.classList.add('ativo');
            
            // Obter o valor do filtro
            const filtroValor = this.getAttribute('data-filtro');
            
            // Filtrar as imagens
            filtrarImagens(filtroValor);
        });
    });
    
    // Função para filtrar imagens
    function filtrarImagens(filtro) {
        const imagens = document.querySelectorAll('.galeria-item');
        
        imagens.forEach(imagem => {
            if (filtro === 'todos' || imagem.getAttribute('data-periodo') === filtro) {
                imagem.style.display = 'block';
            } else {
                imagem.style.display = 'none';
            }
        });
    }
    
    // Função para adicionar eventos de clique às imagens
    function adicionarEventosClique() {
        const galeriaItens = document.querySelectorAll('.galeria-item img');
        
        galeriaItens.forEach(img => {
            img.addEventListener('click', function() {
                const legenda = this.getAttribute('data-legenda');
                const fullImageSrc = this.getAttribute('data-full');
                
                // Mostrar indicador de carregamento no modal
                modalImg.src = '';
                modalLegenda.innerHTML = '<div class="loading-indicator">Carregando imagem completa...</div>';
                
                // Exibir o modal com animação
                modal.style.display = 'block';
                setTimeout(() => {
                    modal.style.opacity = 1;
                    modal.style.transition = 'opacity 0.3s ease';
                }, 50);
                
                // Carregar a imagem completa
                const fullImage = new Image();
                fullImage.onload = function() {
                    // Atualizar o conteúdo do modal com a imagem completa
                    modalImg.src = fullImageSrc;
                    modalTitulo.textContent = img.alt;
                    modalLegenda.innerHTML = legenda;
                };
                fullImage.onerror = function() {
                    modalLegenda.innerHTML = `${legenda}<p class="erro">Erro ao carregar a imagem completa.</p>`;
                    modalImg.src = img.src; // Usa a miniatura como fallback
                };
                fullImage.src = fullImageSrc;
            });
        });
    }
    
    // Fechar modal ao clicar no botão de fechar
    fecharModal.addEventListener('click', function() {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // Função para adicionar novas imagens (para uso futuro)
    function adicionarNovaImagem(imagemData) {
        // Esta função poderia ser usada para adicionar novas imagens dinamicamente
        // sem precisar recarregar a página
        adicionarImagemNaGaleria(imagemData);
        adicionarEventosClique();
    }
});
