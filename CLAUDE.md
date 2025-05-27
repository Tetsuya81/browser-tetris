# CLAUDE.md - テトリスゲーム開発プロジェクト

このファイルは、ブラウザで動作するテトリスゲームの開発において、Claude Codeが効果的に作業するためのカスタム設定ファイルです。

## プロジェクト概要

### プロジェクト名
**Browser Tetris Game**

### 概要
モダンなHTML5 Canvas APIとJavaScriptを使用したブラウザベースのテトリスゲーム。レスポンシブデザイン、スコアシステム、複数レベル、タッチ操作対応を実装。

### 技術スタック
- **言語**: JavaScript (ES6+), HTML5, CSS3
- **描画**: HTML5 Canvas API
- **スタイリング**: CSS Grid, Flexbox, CSS Variables
- **ビルドツール**: Vite
- **テスト**: Jest
- **CI/CD**: GitHub Actions
- **デプロイ**: GitHub Pages
- **その他**: PWA対応, Local Storage

## GitHub連携設定

### GitHub CLI設定
```bash
# GitHub CLIの確認とセットアップ
gh auth status
gh repo view --web  # リポジトリをブラウザで開く
```

### リポジトリ情報
- **リポジトリURL**: https://github.com/[username]/browser-tetris
- **メインブランチ**: `main`
- **開発ブランチ**: `develop`
- **GitHub Pages**: `gh-pages` ブランチまたは `main/docs`

### GitHub Actions ワークフロー
```yaml
# .github/workflows/deploy.yml - 自動デプロイ設定
name: Deploy Tetris Game
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 開発環境セットアップ

### 必須コマンド
```bash
# プロジェクト初期化
npm init -y
npm install --save-dev vite jest @babel/preset-env babel-jest

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# テスト実行
npm test
npm run test:watch    # ウォッチモード
npm run test:coverage # カバレッジ付き

# ビルド（本番用）
npm run build
npm run preview  # ビルド結果のプレビュー

# ローカルHTTPサーバー（開発用）
python -m http.server 8000
# または
npx serve .
```

### package.json 設定例
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## プロジェクト構造

### ファイル構造
```
tetris/
├── index.html              # メインHTMLファイル
├── src/
│   ├── js/
│   │   ├── game.js         # メインゲームロジック
│   │   ├── tetris.js       # テトリス固有ロジック
│   │   ├── tetrominos.js   # テトロミノ（ピース）定義
│   │   ├── input.js        # キーボード・タッチ入力処理
│   │   ├── ui.js           # UI更新・描画
│   │   ├── sound.js        # サウンド効果（オプション）
│   │   └── utils.js        # ユーティリティ関数
│   ├── css/
│   │   ├── style.css       # メインスタイル
│   │   ├── responsive.css  # レスポンシブ対応
│   │   └── animations.css  # アニメーション効果
│   └── assets/
│       ├── sounds/         # サウンドファイル
│       └── images/         # 画像ファイル
├── tests/
│   ├── game.test.js        # ゲームロジックテスト
│   ├── tetrominos.test.js  # テトロミノテスト
│   └── utils.test.js       # ユーティリティテスト
├── docs/                   # GitHub Pages用
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml      # デプロイワークフロー
│   │   └── test.yml        # テストワークフロー
│   ├── ISSUE_TEMPLATE/     # イシューテンプレート
│   └── pull_request_template.md
├── .claude/
│   └── commands/           # カスタムコマンド
└── README.md
```

## ゲーム仕様

### 基本機能
1. **テトロミノ**: 標準的な7種類（I, O, T, S, Z, J, L）
2. **操作**: 左右移動、回転、高速落下、ハードドロップ
3. **ライン消去**: 1-4ライン同時消去対応
4. **レベルシステム**: スピード段階的増加
5. **スコアシステム**: ライン数・レベル・連続消去ボーナス
6. **次のピース表示**: 最低1個、理想的には3-5個

### 高度な機能
- **ホールド機能**: ピースの一時保存
- **ゴーストピース**: 落下予定位置表示
- **T-Spin検出**: 高度な回転システム
- **パーフェクトクリア**: 全ライン消去ボーナス
- **タッチ操作**: モバイル対応
- **PWA**: オフライン対応

### UI/UX要件
- **レスポンシブデザイン**: デスクトップ・タブレット・モバイル対応
- **アクセシビリティ**: キーボードナビゲーション、色覚対応
- **パフォーマンス**: 60FPS維持
- **視覚効果**: ライン消去アニメーション、パーティクル効果

## コーディング規約

### JavaScript規約
```javascript
// ファイル・クラス命名: PascalCase
class TetrisGame {}

// 関数命名: camelCase
function rotateTetromino() {}

// 定数: UPPER_SNAKE_CASE
const TETROMINO_TYPES = {
  I: 'I-piece',
  O: 'O-piece'
};

// プライベートメソッド: 先頭アンダースコア
_updateGameState() {}
```

### CSS規約
```css
/* BEM記法使用 */
.tetris {}
.tetris__board {}
.tetris__piece {}
.tetris__piece--active {}

/* CSS Variables活用 */
:root {
  --primary-color: #0084ff;
  --board-width: 300px;
  --cell-size: 30px;
}
```

### HTML構造
```html
<!-- セマンティックHTML使用 -->
<main class="tetris">
  <section class="tetris__game-area">
    <canvas class="tetris__board" aria-label="テトリスゲーム盤面"></canvas>
  </section>
  <aside class="tetris__sidebar">
    <div class="tetris__score" aria-live="polite"></div>
  </aside>
</main>
```

## Git ワークフロー

### ブランチ戦略
1. `main` - 安定版・デプロイ用
2. `develop` - 機能統合ブランチ  
3. `feature/game-logic` - ゲームロジック実装
4. `feature/ui-design` - UI/UX実装
5. `feature/mobile-support` - モバイル対応
6. `hotfix/bug-name` - 緊急修正

### コミットメッセージ規約
```
type(scope): description

feat(game): implement tetromino rotation logic
fix(ui): resolve canvas scaling issue on mobile
docs(readme): add game controls documentation
style(css): improve responsive grid layout
test(game): add unit tests for line clearing
perf(render): optimize canvas drawing performance
```

### プルリクエストチェックリスト
- [ ] ユニットテスト通過
- [ ] 手動テスト実行（各ブラウザ・デバイス）
- [ ] コードレビュー完了
- [ ] パフォーマンステスト（60FPS維持）
- [ ] アクセシビリティチェック
- [ ] モバイル動作確認

## テスト戦略

### テストカテゴリ
```javascript
// Jest設定例
describe('TetrisGame', () => {
  describe('Tetromino Movement', () => {
    test('should move tetromino left when valid', () => {
      // テストケース
    });
  });
  
  describe('Line Clearing', () => {
    test('should clear completed lines', () => {
      // テストケース  
    });
  });
});
```

### テスト実行コマンド
```bash
# 全テスト実行
npm test

# 特定ファイルテスト
npm test -- tetris.test.js

# ウォッチモード
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

## GitHub連携カスタムコマンド

### `.claude/commands/create-feature.md`
```markdown
# 新機能ブランチ作成
以下の手順で新機能開発を開始:

1. `git checkout develop`
2. `git pull origin develop`  
3. `git checkout -b feature/$ARGUMENTS`
4. GitHub上でドラフトPRを作成
5. 開発着手

使用例: `/project:create-feature mobile-controls`
```

### `.claude/commands/deploy-game.md`
```markdown
# ゲームデプロイ
以下の手順でゲームをGitHub Pagesにデプロイ:

1. テスト実行とビルド検証
2. `npm run build`でビルド作成
3. `npm run deploy`でGitHub Pagesに公開
4. デプロイ後の動作確認
5. リリースタグの作成

デプロイURL確認: `gh browse --settings`
```

### `.claude/commands/fix-issue.md`
```markdown
# GitHub Issue修正ワークフロー
GitHub Issue $ARGUMENTS の修正手順:

1. `gh issue view $ARGUMENTS`でイシュー詳細確認
2. 問題の原因調査と再現
3. 修正方針の決定
4. テストケース追加
5. 修正実装
6. 動作確認とテスト実行
7. プルリクエスト作成
8. `gh issue close $ARGUMENTS`で解決

使用例: `/project:fix-issue 123`
```

## MCP設定

### `.mcp.json`
```json
{
  "servers": {
    "github": {
      "command": "github-mcp-server",
      "args": ["--token", "$GITHUB_TOKEN"]
    },
    "web-dev": {
      "command": "web-dev-mcp-server", 
      "args": ["--port", "3000"]
    },
    "browser-testing": {
      "command": "playwright-mcp-server"
    }
  }
}
```

## パフォーマンス要件

### 目標指標
- **フレームレート**: 60FPS維持
- **入力遅延**: 16ms以下
- **メモリ使用量**: 50MB以下
- **初期読み込み**: 2秒以下
- **Canvas描画**: requestAnimationFrame使用

### 最適化ポイント
```javascript
// Canvas最適化例
const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');

// オフスクリーンCanvasでバッファリング
const offscreenCanvas = new OffscreenCanvas(300, 600);
const offscreenCtx = offscreenCanvas.getContext('2d');

// 効率的な描画更新
function render() {
  // 変更があった部分のみ再描画
  if (needsRedraw) {
    clearCanvas();
    drawBoard();
    drawActivePiece();
    needsRedraw = false;
  }
  requestAnimationFrame(render);
}
```

## デプロイとホスティング

### GitHub Pages設定
1. **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` / `main`
4. **Custom domain**: 任意

### 自動デプロイ確認
```bash
# デプロイ状況確認
gh run list --workflow=deploy.yml

# Pages URL確認  
gh browse

# デプロイログ確認
gh run view [run-id]
```

## トラブルシューティング

### よくある問題と解決法

#### Canvas描画問題
```javascript
// 高DPI対応
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}
```

#### モバイルタッチ対応
```javascript
// タッチイベント処理
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

function handleTouchStart(e) {
  e.preventDefault(); // スクロール防止
  // タッチ処理
}
```

#### GitHub Pages CORS問題
```javascript
// サービスワーカー登録時
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: '/browser-tetris/'  // リポジトリ名を含める
  });
}
```

## 開発フェーズ

### Phase 1: 基本実装（1-2週間）
- [ ] HTML/CSS基本構造
- [ ] Canvas描画システム
- [ ] テトロミノ定義と表示
- [ ] 基本的な移動・回転
- [ ] ライン消去ロジック

### Phase 2: ゲーム機能（1-2週間）
- [ ] スコアシステム
- [ ] レベル・スピード調整
- [ ] 次のピース表示
- [ ] ゲームオーバー処理
- [ ] ポーズ機能

### Phase 3: UI/UX向上（1週間）
- [ ] レスポンシブデザイン
- [ ] アニメーション効果
- [ ] サウンド効果
- [ ] タッチ操作対応

### Phase 4: 高度な機能（1週間）
- [ ] ホールド機能
- [ ] ゴーストピース
- [ ] T-Spin実装
- [ ] PWA対応
- [ ] パフォーマンス最適化

### Phase 5: テスト・デプロイ（1週間）
- [ ] ユニットテスト充実
- [ ] ブラウザ横断テスト
- [ ] アクセシビリティテスト
- [ ] GitHub Pages設定
- [ ] ドキュメント整備

## 参考リソース

### ゲーム開発
- **テトリスガイドライン**: 公式仕様書
- **HTML5 Canvas**: MDN Web Docs
- **ゲームループ**: requestAnimationFrame best practices

### GitHub連携
- **GitHub CLI**: `gh` コマンド使い方
- **GitHub Actions**: ワークフロー構文
- **GitHub Pages**: 静的サイトホスティング

---

このCLAUDE.mdファイルをプロジェクトルートに配置して、テトリスゲーム開発を開始してください。Claude Codeがこの情報を参照して、効率的な開発支援を提供します。

## 開始コマンド例
```bash
# プロジェクト初期化
claude "このCLAUDE.mdの設定に従って、テトリスゲームプロジェクトの初期セットアップを実行してください"

# GitHub連携確認
claude "GitHub CLIの設定を確認し、リポジトリを作成してください"

# 開発開始
claude "Phase 1の基本実装から開始し、HTML/CSS/JSの基本構造を作成してください"
```
