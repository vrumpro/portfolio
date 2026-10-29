# GitHub Pages

Репозиторий: https://github.com/vrumpro/portfolio
Адрес после успешной публикации: https://vrumpro.github.io/portfolio/

В Settings → Pages → Build and deployment выберите Source: GitHub Actions.
Workflow .github/workflows/pages.yml собирает проект на Node 24 через npm ci и npm run build.
Публикуется только dist. Ручной повтор: Actions → Publish portfolio → Run workflow.
Ссылки на ресурсы относительные (Vite base: './'), поэтому сайт работает в /portfolio/.
Страницы index.html, sokolov.html, wikkeo.html и indriver.html доступны напрямую.

Обновление после изменения сайта:
1. npm run build
2. git add .
3. git commit -m "Update portfolio"
4. git push origin main
5. Дождаться зелёного workflow в Actions.

GitHub Pages предоставляет HTTPS на адресе github.io.
В публичный Git включаются действующие кейсы и их ресурсы.
Локальные отчёты, исходники исключённых проектов и неиспользуемые изображения остаются вне Git.
