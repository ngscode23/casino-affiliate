# fix-folders.ps1
$outer = "casino-affiliate"
$inner = Join-Path $outer "casino-affiliate"

if (Test-Path $inner) {
    Write-Host "Найдена вложенная папка: $inner"
    Write-Host "Переношу файлы наверх..."

    Move-Item -Path "$inner\*" -Destination $outer -Force

    Write-Host "Удаляю пустую папку..."
    Remove-Item -Recurse -Force $inner

    Write-Host "✅ Готово. Теперь проект в одной папке."
} else {
    Write-Host "⚠ Вложенной папки не найдено. Ничего не делаю."
}