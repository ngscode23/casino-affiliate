# 1) Переименуем файлы по регистру, принудительно через git (чтобы зафиксировалось и на Windows)
$map = @{
  "Button.tsx"  = "button.tsx";
  "Section.tsx" = "section.tsx";
  "Card.tsx"    = "card.tsx";
  "Table.tsx"   = "table.tsx";
  "Rating.tsx"  = "rating.tsx";
  "Chip.tsx"    = "chip.tsx";
}
foreach ($from in $map.Keys) {
  $src = "src/components/ui/$from"
  $dst = "src/components/ui/$($map[$from])"
  if (Test-Path $src) { git mv -f $src $dst }
}

# 2) Массово починим импорты на единый вид "@/components/ui/<lowercase>"
Get-ChildItem -Recurse -Path src -Include *.ts,*.tsx | ForEach-Object {
  $t = Get-Content $_.FullName -Raw
  # старые относительные и алиас без components
  $t = $t -replace 'from\s+["'']@\/ui\/',               "from ""@/components/ui/"
  $t = $t -replace 'from\s+["'']\.\.\/ui\/',            "from ""@/components/ui/"
  $t = $t -replace 'from\s+["'']\.\/ui\/',              "from ""@/components/ui/"
  $t = $t -replace 'from\s+["'']\.\.\/components\/ui\/',"from ""@/components/ui/"
  $t = $t -replace 'from\s+["'']\.\/components\/ui\/',  "from ""@/components/ui/"
  # PascalCase сегменты -> lowercase
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Button',  'from "@/components/ui/button'
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Section', 'from "@/components/ui/section'
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Card',    'from "@/components/ui/card'
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Table',   'from "@/components/ui/table'
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Rating',  'from "@/components/ui/rating'
  $t = $t -replace 'from\s+["'']@\/components\/ui\/Chip',    'from "@/components/ui/chip'
  # смешанные кавычки в import ... from '...";  и  "...';
  $t = $t -replace "from\s+'([^']+)""\s*;", "from '$1';"
  $t = $t -replace 'from\s+"([^"]+)''\s*;', 'from "$1";'
  Set-Content $_.FullName $t
}

# 3) Найдём и выведем любые импорты с пустым путём (from "" или from '')
Select-String -Path src\**\*.ts* -Pattern 'from\s+["'']{2}' | Select-Object Path, LineNumber, Line