# Infrastructure Repository (PostgreSQL)

Этот каталог содержит манифесты для развертывания базы данных PostgreSQL.

## Контракт для подключения (Dev)

- **Host:** `database-0.database-service.infra-dev.svc.cluster.local` (или `database-service` внутри того же namespace)
- **Port:** `5432`
- **Database:** `findyourpet`
- **User:** `petuser`
- **Password:** `petpassword` (хранится в Secret `db-secret`)

## Развертывание (Kustomize)

```bash
kubectl apply -k infra/k8s/kustomization/overlays/dev
```
