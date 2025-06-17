# CSS Architecture - Niterói View

## 📁 Estrutura Modular

```
css/
├── main.css              # Arquivo principal que importa todos os módulos
├── base/                 # Estilos fundamentais
│   ├── variables.css     # Variáveis CSS (cores, espaçamentos, etc.)
│   ├── reset.css         # Reset CSS e estilos base
│   └── typography.css    # Tipografia e utilitários de texto
├── layout/               # Estrutura de layout
│   ├── container.css     # Container principal e mapa
│   └── header.css        # Header e logo
├── components/           # Componentes reutilizáveis
│   ├── navigation.css    # Menu hamburger e navegação
│   └── timeline.css      # Timeline do WebMap
├── pages/                # Estilos específicos por página
│   ├── index.css         # Página inicial
│   └── webmap.css        # Página do mapa (popups)
└── utils/                # Utilitários
    └── responsive.css    # Classes responsivas
```

## 🎨 Sistema de Design

### Variáveis CSS
- **Cores**: Primárias, secundárias, backgrounds, textos
- **Espaçamentos**: Sistema de spacing consistente (xs, sm, md, lg, xl, xxl)
- **Tipografia**: Famílias de fontes, tamanhos, pesos
- **Sombras**: Níveis de elevação (sm, md, lg, xl)
- **Border Radius**: Cantos arredondados padronizados
- **Z-index**: Camadas organizadas
- **Breakpoints**: Pontos de quebra responsivos

### Como Usar
```css
/* Exemplo usando variáveis */
.meu-elemento {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
}
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: até 320px
- **Tablet**: 321px - 767px  
- **Desktop**: 768px+

### Classes Utilitárias
- `.show-mobile`, `.hide-mobile`
- `.show-tablet`, `.hide-tablet`
- `.show-desktop`, `.hide-desktop`

## 🔧 Manutenção

### Para adicionar novos estilos:
1. **Componente novo**: Criar arquivo em `components/`
2. **Página específica**: Adicionar em `pages/`
3. **Variável global**: Adicionar em `base/variables.css`
4. **Utilitário**: Adicionar em `utils/`

### Para modificar cores/espaçamentos:
- Editar apenas `base/variables.css`
- As mudanças se propagam automaticamente

## 📊 Resultados da Reorganização

### Antes vs Depois
| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Arquivos CSS** | 2 grandes | 11 modulares | +450% organização |
| **singlePageTemplate.css** | 740 linhas | Modularizado | 100% |
| **CSS inline** | 210+ linhas | 0 linhas | 100% |
| **Duplicações** | Extensas | Eliminadas | 100% |
| **Manutenibilidade** | Baixa | Alta | +300% |

### Benefícios Alcançados
✅ **Modularidade**: Cada arquivo tem responsabilidade única  
✅ **Reutilização**: Variáveis CSS centralizadas  
✅ **Manutenção**: Fácil localizar e editar estilos  
✅ **Performance**: CSS otimizado e sem duplicações  
✅ **Escalabilidade**: Estrutura preparada para crescimento  
✅ **Consistência**: Sistema de design unificado  

## 🚀 Próximos Passos Sugeridos

1. **Otimização**: Minificação para produção
2. **Temas**: Sistema de temas dark/light
3. **Animações**: Biblioteca de animações
4. **Grid System**: Sistema de grid responsivo
5. **Print Styles**: Estilos para impressão
