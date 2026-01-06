# fintech-tracker

Proyecto académico y personal para la gestión, análisis y visualización de finanzas personales e inversiones.

El objetivo del proyecto es diseñar una aplicación full-stack que permita:
- Registrar usuarios y sus cuentas financieras de manera segura.
- LLevar un control detallado de ingresos, gastos y operaciones de inversión.
- Analizar el patrimonio total (efectivo + inversiones)
- Visualizar la asignación de activos
- Evaluar la evolución temporal de la cartera

---

## 🧱 Arquitectura general

- **Backend**: FastAPI + PostgreSQL
- **Base de datos**: Modelo relacional propio, orientado a análisis financiero
- **Frontend**: React (pendiente)
- **Datos de mercado**: price_history (actualmente manual, automatizable)
- **Despliegue**: Docker / CI-CD (pendiente)

---

## 📊 Modelo de datos

El modelo contempla las siguientes entidades principales:

- **users**: usuarios del sistema
- **accounts**: cuentas financieras asociadas a un usuario
- **transactions**: ingresos y gastos (impactan en el efectivo)
- **assets**: activos financieros (acciones, ETFs, fondos, etc.)
- **operations**: operaciones de compra/venta de activos
- **price_history**: histórico de precios de mercado por activo

El diseño separa explícitamente:
- Operaciones del usuario
- Evolución del mercado

permitiendo cálculos correctos de rendimiento temporal.

---

## ⚙️ Backend (estado actual)

### Funcionalidades implementadas

- [x] Diseño y refactor del modelo de datos
- [x] Conexión FastAPI + PostgreSQL
- [x] Cálculo de balances por cuenta (efectivo, invertido, total)
- [x] Asignación de activos:
  - Por cuenta
  - Global (todas las cuentas)
  - Agrupable por:
    - activo
    - tipo
    - temática
- [x] Uso de SQL optimizado y consultas agregadas
- [x] Schemas Pydantic para contratos de la API

### Funcionalidades pendientes

- [ ] Histórico temporal de rendimiento de cartera
- [ ] Registro y consulta de trade logs
- [ ] Automatización de `price_history` mediante API de mercado (TradingView, Alpha Vantage, Yahoo Finance, etc.)
- [ ] Autenticación (JWT)
- [ ] Control de usuarios (endpoints `/me`)

---

## 🖥️ Frontend (pendiente)

El frontend se desarrollará en React y consumirá la API existente para:

- Visualización de balances
- Gráficas circulares de asignación
- Gráficas temporales de evolución
- Interfaz de análisis de cartera

---

## 🚀 CI/CD y despliegue (pendiente)

- Dockerización del backend
- Pipeline CI/CD (GitHub Actions)
- Despliegue en entorno cloud gratuito
- Kubernetes (opcional)

---

## 📌 Estado del proyecto

- [x] Diseño del modelo de datos
- [x] Backend (núcleo funcional)
- [ ] Backend avanzado (performance, market data)
- [ ] Frontend
- [ ] CI/CD y despliegue

---

## 🎓 Contexto académico

Este proyecto se desarrolla como:
- proyecto personal de aprendizaje de tecnologías full-stack
- uso diario para gestión financiera personal

priorizando:
- diseño correcto del modelo
- claridad arquitectónica
- decisiones justificables
