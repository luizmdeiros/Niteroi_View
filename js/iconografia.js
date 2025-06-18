/**
 * Iconografia.js
 * Script para gerenciar a funcionalidade da página de Iconografia do projeto Niterói View
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const filtroButtons = document.querySelectorAll('.filtro-btn');
    const itensGaleria = document.querySelectorAll('.item-galeria');
    const modal = document.querySelector('.modal-iconografia');
    const modalImg = document.getElementById('img-ampliada');
    const modalLegenda = document.querySelector('.modal-legenda');
    const fecharModal = document.querySelector('.fechar-modal');
    const zoomIcons = document.querySelectorAll('.zoom-icon');
    
    // Filtrar itens da galeria por período
    filtroButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filtroButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Obter o período selecionado
            const periodoSelecionado = this.getAttribute('data-periodo');
            
            // Filtrar os itens da galeria
            itensGaleria.forEach(item => {
                if (periodoSelecionado === 'todos' || item.getAttribute('data-periodo') === periodoSelecionado) {
                    item.style.display = 'block';
                    // Adicionar animação de fade-in
                    item.style.opacity = 0;
                    setTimeout(() => {
                        item.style.opacity = 1;
                        item.style.transition = 'opacity 0.5s ease';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Abrir modal ao clicar em uma imagem
    zoomIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const itemGaleria = this.closest('.item-galeria');
            const img = itemGaleria.querySelector('img');
            const legenda = itemGaleria.querySelector('.legenda').innerHTML;
            
            // Definir a imagem e legenda no modal
            modalImg.src = img.src;
            modalLegenda.innerHTML = legenda;
            
            // Exibir o modal com animação
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.opacity = 1;
                modal.style.transition = 'opacity 0.3s ease';
            }, 50);
        });
    });
    
    // Fechar modal ao clicar no botão de fechar
    fecharModal.addEventListener('click', function() {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // Fechar modal ao clicar fora da imagem
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.opacity = 0;
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // Criar diretório para imagens se não existir
    function verificarDiretorioImagens() {
        // Esta função seria implementada no backend
        console.log('Verificando diretório de imagens...');
    }
    
    // Função para carregar mais imagens (implementação futura)
    function carregarMaisImagens() {
        // Implementação futura para carregar mais imagens via AJAX
        console.log('Função para carregar mais imagens via AJAX');
    }
    
    // Inicialização
    verificarDiretorioImagens();
});
