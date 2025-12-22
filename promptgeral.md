# 🧩 World Autistic Web - Contexto Geral do Projeto

## 📌 Objetivo Principal

Recriar a aplicação **World Autistic** (originalmente em React Native na pasta `world-autistic-main`) em uma versão web usando **HTML puro** na pasta `world-autistic-web`.

## 🎯 Metodologia

1. **Mapear todas as telas** do app original (`world-autistic-main`)
2. **Recriar cada tela em HTML puro** mantendo fidelidade visual e funcional
3. **Respeitar a hierarquia de navegação** - telas pais e telas filhas
4. **Usar os mesmos assets** (imagens, ícones, cores, fontes) do projeto original

## 🎨 Diretrizes de Design

### Estilo Visual
- **Sempre usar o mesmo estilo visual** do `world-autistic-main`
- **Cores, bordas, sombras e espaçamentos** devem ser idênticos ao original
- **Imagens e ícones** devem vir da pasta `public/images/` (copiados do original)
- **Fontes**: usar system fonts como no original (-apple-system, BlinkMacSystemFont, etc.)

### Layout Padrão
- **Background**: Imagem de fundo azul (`background.png`) fixo
- **Navegação inferior**: Menu fixo com 2 itens (Home e Settings)
- **Padding inferior**: 8rem para evitar que o menu corte o conteúdo
- **Cards**: Bordas arredondadas (20px), sombras, cores específicas por categoria

## 📂 Estrutura de Navegação Hierárquica Completa

### 🔐 Nível 1: Autenticação
```
├─ login.html ✅
└─ register.html ✅
```

---

### 🏠 Nível 2: Home Principal
```
home.html ✅
  ├─ Atividades → activities.html
  ├─ Comandos de Voz → commands.html
  ├─ Frequências Sonoras → frequenciesCategorySelection.html
  └─ Jogos → games.html
```

---

### 📚 Nível 3A: Activities (Atividades)
```
activities.html ✅
  │
  ├─ Números (Numbers)
  │   └─ numberLevelSelection.html
  │       ├─ Nível 1 → activity.html?category=math&level=1
  │       ├─ Nível 2 → activity.html?category=math&level=2
  │       └─ Nível 3 → activity.html?category=math&level=3
  │
  ├─ Letras (Letters)
  │   └─ activity.html?category=lang&level=1
  │
  ├─ Animais (Animals)
  │   └─ animals.html (grid 2 colunas, 48 itens)
  │
  ├─ Comida (Food)
  │   └─ food.html (grid 2 colunas)
  │
  ├─ Objetos (Objects)
  │   └─ objects.html (grid 2 colunas)
  │
  └─ Cores (Colors)
      └─ colors.html (grid 2 colunas)
```

**Características das telas de grid (animals, food, objects, colors):**
- Grid 2 colunas responsivas
- Cards coloridos com imagem + título
- Ao clicar: reproduz áudio do nome do item
- Scroll vertical
- Botão de voltar no topo
- Dados vêm de JSON (`assets/data/[categoria].json`)

---

### 🎤 Nível 3B: Commands (Comandos de Voz)
```
commands.html
  └─ Grid 2 colunas com comandos de voz
     (mesma estrutura de animals.html)
```

**Características:**
- Grid com comandos como "Sim", "Não", "Ajuda", etc.
- Cada card reproduz áudio do comando
- Dados vêm de `commands.json`

---

### 🎵 Nível 3C: Frequencies (Frequências Sonoras)
```
frequenciesCategorySelection.html
  └─ Lista de categorias (botões verticais)
      └─ frequencies.html?category=[nome-categoria]
          └─ Lista de frequências sonoras da categoria
```

**Características:**
- **Tela 1 (frequenciesCategorySelection)**: Botões verticais para escolher categoria
- **Tela 2 (frequencies)**: Cards de frequências com play/pause
- Dados vêm de API/hook (useFrequencies)

---

### 🎮 Nível 3D: Games (Jogos)
```
games.html
  ├─ Jogo da Memória → memoryGame.html
  ├─ Jogo 2 (desabilitado)
  ├─ Jogo 3 (desabilitado)
  └─ Jogo 4 (desabilitado)
```

**Características:**
- Grid 2x2 com 4 cards de jogos
- Apenas "Jogo da Memória" está ativo
- Os outros 3 estão desabilitados (isDisabled)

---

### 🎯 Nível 4: Atividades Interativas
```
activity.html?category=[math|lang]&level=[1|2|3]
  └─ Atividade interativa baseada em categoria e nível
```

**Características:**
- Atividades de matemática (math) ou linguagem (lang)
- Diferentes níveis de dificuldade (1, 2, 3)
- Interface interativa com perguntas/respostas

---

### ⚙️ Settings (Configurações)
```
settings.html
  └─ Tela de configurações (idioma, som, etc.)
```

---

## 📊 Mapeamento Visual Completo

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN / REGISTER                        │
│                           ✅ ✅                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                         HOME ✅                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Activities │  │ Commands   │  │ Frequencies│            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│  ┌────────────┐        │                │                    │
│  │   Games    │        │                │                    │
│  └─────┬──────┘        │                │                    │
└────────┼───────────────┼────────────────┼────────────────────┘
         │               │                │
         ▼               ▼                ▼
    ┌─────────┐    ┌──────────┐   ┌──────────────────┐
    │Activities│    │ commands │   │frequenciesCategory│
    │   ✅    │    │   .html  │   │  Selection.html   │
    └────┬────┘    └────┬─────┘   └────┬─────────────┘
         │              │               │
         ▼              ▼               ▼
    ┌─────────────────────────┐   ┌──────────┐
    │ 6 categorias:           │   │frequencies│
    │ • numbers → selection   │   │  .html   │
    │ • letters → activity    │   └──────────┘
    │ • animals → grid        │
    │ • food → grid           │        ┌──────────┐
    │ • objects → grid        │        │  games   │
    │ • colors → grid         │        │  .html   │
    └─────────────────────────┘        └────┬─────┘
                                            │
                                            ▼
                                       ┌──────────┐
                                       │memoryGame│
                                       │  .html   │
                                       └──────────┘
```

## 📋 Dados e Assets

### Localização dos Dados
- **JSON files**: `world-autistic-main/assets/data/`
  - `animals.json` (48 animais)
  - `food.json`
  - `objects.json`
  - `colors.json`

### Localização das Imagens
- **Original**: `world-autistic-main/assets/images/`
- **Web**: `world-autistic-web/public/images/`

### Localização dos Áudios
- **Original**: `world-autistic-main/assets/audio/`
  - Subpastas: `pt/`, `en/`, `es/`
- **Web**: `world-autistic-web/public/audio/`

## 🔄 Padrão de Navegação

### Botão Voltar
Todas as telas filhas devem ter um **botão de voltar** no topo:
```html
<a href="[tela-pai].html" class="back-button">
  <svg><!-- ícone de seta --></svg>
</a>
```

### Menu Inferior Fixo
Todas as telas (exceto login/register) têm navegação fixa:
- **Home**: ícone de casa (ativo na home.html)
- **Settings**: ícone de engrenagem

## ✅ Status Atual

### Concluído
- ✅ `login.html`
- ✅ `register.html`
- ✅ `home.html`
- ✅ `activities.html`

### Próximos Passos
- [ ] `animals.html` (grid com 48 animais + áudio)
- [ ] `food.html`
- [ ] `objects.html`
- [ ] `colors.html`
- [ ] `numberLevelSelection.html` (3 botões de nível)
- [ ] `activity.html` (atividades interativas math/lang)
- [ ] `commands.html`
- [ ] `frequencies.html`
- [ ] `games.html`
- [ ] `settings.html`

## 🎵 Funcionalidade de Áudio

Para as telas de grid (animals, food, objects, colors):
- Cada card deve reproduzir áudio ao ser clicado
- Usar Web Audio API ou `<audio>` tag
- Arquivos de áudio em: `public/audio/pt/[item-name].mp3`
- Suportar múltiplos idiomas (PT, EN, ES)

## 📱 Responsividade

- **Max-width**: 400px para conteúdo principal
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Touch-friendly**: Botões e cards grandes para fácil interação

## 🔑 Regras Importantes

1. **SEMPRE** verificar a tela original em `world-autistic-main` antes de criar
2. **SEMPRE** usar as mesmas cores, bordas e espaçamentos
3. **SEMPRE** copiar imagens da pasta original para `public/images/`
4. **SEMPRE** considerar a hierarquia de navegação (pai → filho)
5. **SEMPRE** adicionar `padding-bottom: 8rem` para não cortar conteúdo
6. **SEMPRE** incluir botão de voltar em telas filhas
7. **SEMPRE** manter menu fixo inferior (exceto login/register)

## 📖 Referências Rápidas

### Cores Principais
- Background azul: `#60A5FA`
- Menu gradiente: `linear-gradient(to bottom, #2563EB, #1E40AF)`

### Cards de Atividades (activities.html)
- Números: `#AAD3E9` / borda `#56A9D4`
- Letras: `#F98EB0` / borda `#F6467f`
- Animais: `#8ECF99` / borda `#4E9F62`
- Comida: `#E07A5F` / borda `#9D3C27`
- Objetos: `#6A4C93` / borda `#432C64`
- Cores: `#D9F99D` / borda `#A3E635`

### Cards da Home (home.html)
- Atividades: `#FEED56` / borda `#F1B812`
- Comandos: `#EB4335` / borda `#B22418`
- Frequências: `#F67C41` / borda `#D76900`
- Jogos: `#34A853` / borda `#2B753F`

---

**Última atualização**: 2025-12-07
