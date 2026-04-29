# Отчет о выполнении лабораторной работы №5

## Тема: Развертывание приложения в Kubernetes (k8s)

В ходе лабораторной работы было выполнено развертывание полнофункционального веб-приложения (Frontend на React, Backend на FastAPI, БД PostgreSQL) в локальном кластере Kubernetes (Docker Desktop).

### Выполненные задачи:

1.  **Контейнеризация**: Собраны Docker-образы для фронтенда и бэкенда.
2.  **Инфраструктура как код**: Подготовлены YAML-манифесты для всех ресурсов (Deployment, Service, StatefulSet, Ingress, Secret, ConfigMap).
3.  **База данных**: Развернут PostgreSQL через `StatefulSet` с использованием `PersistentVolumeClaim` для сохранения данных.
4.  **Сетевое взаимодействие**:
    *   Создан `Ingress` (через Nginx Ingress Controller) для маршрутизации трафика на домен `findyourpet.local`.
    *   Настроены внутренние `Service` для связи фронтенда с бэкендом и бэкенда с БД.
5.  **Конфигурация и секреты**:
    *   Все настройки (URL БД, параметры SMTP) вынесены в `ConfigMap` и `Secret`.
    *   Настроена реальная отправка писем для подтверждения регистрации через Gmail SMTP.
6.  **Исправления и доработки**:
    *   Исправлен роутинг фронтенда для поддержки страницы активации аккаунта (`/verify`).
    *   Настроен префикс API в бэкенде для корректной маршрутизации через Ingress.
    *   Добавлена обработка ошибок 500 во фронтенде для стабильности UI.

---

## Инструкция по запуску приложения

### 1. Подготовка окружения
*   Убедитесь, что в Docker Desktop включен **Kubernetes**.
*   Установите Ingress Controller (если еще не установлен):
    ```powershell
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
    ```
*   Добавьте домен в файл `C:\Windows\System32\drivers\etc\hosts`:
    ```
    127.0.0.1 findyourpet.local
    ```

### 2. Применение манифестов
Выполните команды из корня проекта:
```powershell
# Создание пространства имен
kubectl create namespace lab5

# Применение всех манифестов (секреты, конфиги, БД, приложения, ингресс)
kubectl apply -f k8s/
```

### 3. Сборка и обновление образов (если вносились изменения)
```powershell
# Сборка бэкенда
docker build -t shuler7/find-your-pet-backend:1.3 ./backend
# Сборка фронтенда
docker build -t shuler7/find-your-pet-frontend:1.5 ./frontend

# После сборки перезапустите поды для обновления
kubectl rollout restart deployment backend-deployment -n lab5
kubectl rollout restart deployment frontend-deployment -n lab5
```

### 4. Проверка статуса
```powershell
kubectl get pods -n lab5
```
Все поды должны иметь статус `Running`.

### 5. Доступ к приложению
Приложение будет доступно по адресу: [http://findyourpet.local](http://findyourpet.local)
