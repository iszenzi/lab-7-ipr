# Отчет о выполнении лабораторной работы №6

## Тема: Kustomize и Helm, разделение приложения и инфраструктуры

В ходе лабораторной работы была проведена реорганизация процесса развертывания приложения. Основной упор был сделан на разделение жизненных циклов инфраструктуры (БД) и самого приложения, а также на использование современных инструментов управления манифестами — Kustomize и Helm.

### Выполненные задачи:

1.  **Разделение ответственности**:
    *   Манифесты базы данных PostgreSQL вынесены в отдельный контур **Infrastructure** (`infra/`).
    *   Манифесты приложения (Backend, Frontend, Ingress) выделены в контур **Application** (`app/`).
2.  **Stateful-инфраструктура**:
    *   База данных PostgreSQL развернута через `StatefulSet`.
    *   Настроен `Headless Service` для обеспечения стабильных сетевых идентификаторов подов.
    *   Использованы `volumeClaimTemplates` для надежного хранения данных.
3.  **Освоение Kustomize**:
    *   Реализована структура `base` (общие ресурсы) и `overlays` (специфичные настройки для окружений, например `dev`).
    *   Все окружения избавлены от дублирования кода за счет использования патчей и генераторов секретов.
4.  **Разработка Helm-чарта**:
    *   Создан полноценный чарт `findyourpet` для управления релизом приложения.
    *   Параметризованы все ключевые поля: теги образов, количество реплик, параметры Ingress и строки подключения к БД.
    *   Подготовлены файлы `values.yaml` и `values-prod.yaml` для гибкого деплоя.
5.  **Контрактное взаимодействие**:
    *   Приложение подключается к БД по FQDN-имени, определенному в инфраструктурном слое: `database-service.infra-dev.svc.cluster.local`.
---

## Инструкция по запуску

### 1. Подготовка инфраструктуры (БД)
```powershell
# Создание пространства имен
kubectl create namespace infra-dev

# Развертывание PostgreSQL
kubectl apply -k infra/k8s/kustomization/overlays/dev
```

### 2. Развертывание приложения (Kustomize)
```powershell
# Создание пространства имен
kubectl create namespace app-dev

# Развертывание через Kustomize
kubectl apply -k app/k8s/kustomization/overlays/dev
```

### 3. Развертывание приложения (Helm)
Если требуется развернуть вторую копию или управлять релизом через Helm:
```powershell
helm upgrade --install my-app app/k8s/helm/findyourpet -n app-dev `
  --set ingress.host=findyourpet-helm.local `
  --set image.frontend=shuler7/find-your-pet-frontend:1.8
```

### 4. Проверка доступности
Добавьте домены в `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 findyourpet.local
127.0.0.1 findyourpet-helm.local
```

### 5. Полезные ссылки
*   **Сайт (Kustomize):** [http://findyourpet.local](http://findyourpet.local)
*   **Сайт (Helm):** [http://findyourpet-helm.local](http://findyourpet-helm.local)
*   **Health Check API:** [http://findyourpet.local/api/server/stats](http://findyourpet.local/api/server/stats)

---

## Результат
Приложение успешно разделено на независимые слои. База данных сохраняет данные между перезапусками, а приложение гибко настраивается под разные окружения через параметры Helm или слои Kustomize. Все выявленные баги фронтенда и сетевой связности устранены.
