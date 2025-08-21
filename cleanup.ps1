# cleanup.ps1
$ErrorActionPreference = "Stop"

$root = Get-Location
$backup = Join-Path $root ("backup_before_cleanup_" + (Get-Date -Format "yyyyMMdd_HHmmss"))
New-Item -ItemType Directory -Force $backup | Out-Null

# 1) Бэкап ключевых папок/файлов
$toBackup = @("src","public","package.json","tsconfig.json","vite.config.ts","postcss.config.*","tailwind.config.*")
foreach ($item in $toBackup) { if (Test-Path $item) { Copy-Item $item $backup -Recurse -Force } }

# 2) Гарантируем структуру
$dirs = @(
  "src/assets","src/components","src/pages","src/hooks","src/lib",
  "src/data","src/styles","src/features/offers/components","src/features/offers/api"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force $d | Out-Null }

# 3) Перенос casinos.json -> src/data/casinos.json (если он не уже там)
$dest = Join-Path $PWD 'src\data\casinos.json'
$files = Get-ChildItem -Recurse -File -Filter 'casinos.json'

if ($files.Count -gt 0) {
  $primary = $files | Select-Object -First 1
  $srcPath = (Resolve-Path $primary.FullName).Path
  if (Test-Path $dest) {
    $destPath = (Resolve-Path $dest).Path
  } else {
    New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
    $destPath = $dest
  }

  if ($srcPath -ne $destPath) {
    Copy-Item $srcPath $dest -Force
    Write-Host "copied $srcPath -> $dest"
  } else {
    Write-Host "casinos.json уже в src/data, пропускаю"
  }
} else {
  Write-Host "casinos.json не найден, пропускаю"
}

# 4) Удаление старых тем/дубликатов
$oldThemes = @(
  "src/styles/neon-theme.css",
  "src/styles/theme_old.css",
  "src/styles/old-theme.css"
)
$oldThemes | ForEach-Object { if (Test-Path $_) { Remove-Item $_ -Force } }

# 5) index.css: гарантируем @import и порядок
$indexCss = "src/styles/index.css"
if (!(Test-Path $indexCss)) {
  New-Item -ItemType File $indexCss | Out-Null
}
$css = Get-Content $indexCss -Raw

# убираем дубли import theme.css
$css = $css -replace '(?m)^\s*@import\s+["'']\.\/theme\.css["''];\s*$', ''
$css = $css -replace '(?m)^\s*@import\s+["'']\.\/styles\/theme\.css["''];\s*$', ''

# Tailwind директивы (если нет — добавим)
if ($css -notmatch '@tailwind\s+base;')       { $css = $css + "`n@tailwind base;" }
if ($css -notmatch '@tailwind\s+components;') { $css = $css + "`n@tailwind components;" }
if ($css -notmatch '@tailwind\s+utilities;')  { $css = $css + "`n@tailwind utilities;" }

# Вставляем @import в САМЫЙ верх (PostCSS требование)
$css = "@import ""./theme.css"";`n" + $css.Trim()

Set-Content $indexCss $css -NoNewline

# 6) Создаём theme.css если его нет (обёрнут в @layer)
$themeCss = "src/styles/theme.css"
if (!(Test-Path $themeCss)) {
@'
@layer base {
  :root {
    --bg-950:#080b10; --bg-900:#0b0f14; --bg-850:#0f141b;
    --text-100:#eef2f6; --text-300:#c8d0da; --text-500:#93a1b2;
    --muted-700:#1a2230; --muted-600:#1f2937; --card-800:#121826;
    --accent:#d4af37; --accent-2:#8b5cf6; --success:#22c55e; --danger:#ef4444;
    --radius-xl:16px; --radius-2xl:20px;
    --shadow-soft:0 10px 30px rgba(0,0,0,.35);
    --shadow-ring:0 0 0 1px rgba(255,255,255,.06) inset;
  }
  html,body{
    background: radial-gradient(1200px 700px at 20% -10%, rgba(139,92,246,.08), transparent 60%),
                radial-gradient(900px 600px at 100% 0%, rgba(212,175,55,.10), transparent 50%),
                var(--bg-900);
    color: var(--text-100);
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }
  .container, .neon-container { max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
}
@layer components {
  .card { background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0)), var(--card-800);
          border-radius: 20px; box-shadow: var(--shadow-soft), var(--shadow-ring);
          border: 1px solid rgba(255,255,255,.06); }
  .neon-hero { position:relative; padding:64px 0 32px;
    background: linear-gradient(140deg, rgba(212,175,55,.10), rgba(139,92,246,.12) 40%, transparent 80%);
    border-bottom: 1px solid rgba(255,255,255,.06); }
  .neon-hero h1, .neon-hero .title { font-size: clamp(28px,5vw,46px); line-height:1.05; letter-spacing:-.02em; margin:8px 0 14px; }
  .neon-hero p { color: var(--text-300); max-width: 800px; margin:0; }
  .neon-chip { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px;
    border:1px solid rgba(255,255,255,.10);
    background: linear-gradient(180deg, rgba(139,92,246,.18), rgba(139,92,246,.10) 70%, rgba(255,255,255,.02));
    box-shadow: 0 6px 16px rgba(139,92,246,.20); color:#fff; font-weight:600; font-size:13px; letter-spacing:.25px; }
  .neon-chip[data-glow] { box-shadow: 0 0 0 2px rgba(212,175,55,.15), 0 8px 24px rgba(212,175,55,.20);
    background: linear-gradient(180deg, rgba(212,175,55,.22), rgba(212,175,55,.10)); }
  .btn { display:inline-flex; align-items:center; gap:10px; height:44px; padding:0 18px; border-radius:12px;
    border:1px solid rgba(255,255,255,.12);
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,0)),
               linear-gradient(180deg, rgba(212,175,55,.25), rgba(212,175,55,.15));
    color:#111; font-weight:700; letter-spacing:.2px; cursor:pointer;
    transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
    box-shadow: 0 10px 20px rgba(212,175,55,.20); }
  .btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
  .btn:active { transform: translateY(0); filter: brightness(.98); }
  .btn.secondary { background: linear-gradient(180deg, rgba(139,92,246,.25), rgba(139,92,246,.15)); color:#fff;
    box-shadow: 0 10px 20px rgba(139,92,246,.20); }
  .table { width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border-radius:14px;
    background: var(--card-800); box-shadow: var(--shadow-soft), var(--shadow-ring); }
  .table th, .table td { padding:14px 16px; border-bottom:1px solid rgba(255,255,255,.06); }
  .table th { text-align:left; color:var(--text-500); font-weight:600; font-size:13px; text-transform:uppercase; letter-spacing:.4px; }
  .table tr:hover td { background: rgba(255,255,255,.02); }
  .badge { display:inline-block; padding:5px 10px; border-radius:999px; font-weight:700; font-size:12px; letter-spacing:.3px; color:#111;
    background: linear-gradient(180deg, rgba(212,175,55,.9), rgba(212,175,55,.75)); }
  .site-footer { margin-top:48px; padding:32px 0; color:var(--text-500);
    border-top:1px solid rgba(255,255,255,.06);
    background: linear-gradient(0deg, rgba(255,255,255,.02), rgba(255,255,255,0)); }
}
'@ | Set-Content $themeCss -NoNewline
}

# 7) .gitignore / .editorconfig / .env.example (если нет)
if (!(Test-Path ".gitignore")) {
@'
node_modules
dist
build
.next
.turbo
coverage
.env*
!.env.example
.DS_Store
Thumbs.db
'@ | Set-Content ".gitignore" -NoNewline
}
if (!(Test-Path ".editorconfig")) {
@'
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
'@ | Set-Content ".editorconfig" -NoNewline
}
if (!(Test-Path ".env.example")) {
@'
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
'@ | Set-Content ".env.example" -NoNewline
}

Write-Host "Готово. Бэкап: $backup" -ForegroundColor Green
