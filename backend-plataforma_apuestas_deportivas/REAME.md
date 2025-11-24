# BetLive Colombia – Sistema de Apuestas Deportivas en Tiempo Real
### Proyecto Final – Sistemas Distribuidos  
**Nombre:** Juan Carlos Pabón Muñoz  
**Universidad Cooperativa de Colombia**

## Objetivo del Proyecto

Implementar un sistema distribuido de apuestas deportivas en tiempo real utilizando tecnologías de mensajería asíncrona (Apache Kafka y RabbitMQ), comunicación en tiempo real mediante WebSocket y envío de notificaciones por correo electrónico.

El sistema simula el ciclo completo de una apuesta: creación de partidos, recepción de apuestas, procesamiento de resultados y notificación automática al usuario.

## Arquitectura del Sistema

El proyecto sigue una arquitectura de microservicios comunicados mediante colas de mensajes:


match_generator → Kafka (match_events) → results_engine
↓
RabbitMQ (exchange: notifications)
↓
┌─────────────────────┴─────────────────────┐
│                                           │
dashboard_backend (WebSocket)                email_worker
↓                                           ↓
Frontend (8080)                        Correo Gmail
text


## Tecnologías Utilizadas

| Tecnología           | Uso                                           |
|----------------------|------------------------------------------------|
| Node.js              | Implementación de todos los microservicios     |
| Apache Kafka         | Eventos de creación de partidos y apuestas     |
| RabbitMQ             | Notificaciones al dashboard y envío de emails  |
| WebSocket            | Actualización en tiempo real del frontend      |
| Nodemailer + Gmail   | Envío de correos electrónicos reales          |
| Docker & Compose     | Contenerización y orquestación de servicios    |
| HTML/CSS/JavaScript  | Interfaz web de usuario                        |

## Microservicios Incluidos

| Servicio              | Puerto | Responsabilidad                                      |
|-----------------------|--------|-------------------------------------------------------|
| `match_generator`     | —      | Genera partidos cada 10 segundos y los publica en Kafka |
| `betting_api`         | 3000   | API REST para registrar apuestas                      |
| `results_engine`      | —      | Consume eventos de Kafka, determina ganadores y publica resultados |
| `dashboard_backend`   | 3001   | Servidor WebSocket que retransmite actualizaciones al frontend |
| `email_worker`        | —      | Consume mensajes de RabbitMQ y envía correos con los resultados |
| `frontend`            | 8080   | Interfaz web para visualizar partidos y realizar apuestas |

## Funcionalidades Implementadas

- Generación automática de partidos
- Registro de apuestas en tiempo real ($500 fijos por apuesta)
- Cálculo automático de ganancias (odds 1.90)
- Actualización instantánea del dashboard mediante WebSocket
- Envío de correo electrónico real al usuario al finalizar cada partido (victoria o derrota)
- Comunicación completamente asíncrona entre componentes
- Tolerancia a fallos gracias al uso de colas persistentes

## Ejecución del Proyecto

```bash
# Clonar y entrar al directorio
git clone <repositorio>
cd betlive-colombia

# Construir y levantar todos los contenedores
docker compose up -d --build

# Acceder al sistema
http://localhost:8080