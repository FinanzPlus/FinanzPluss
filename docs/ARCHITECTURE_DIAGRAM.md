# 🏗️ Architecture FinanzPlus Austria - Plateforme Financière

## Diagramme d'Architecture Système

```mermaid
graph TB
    subgraph "Frontend - React"
        A[Pages] --> B[Components]
        B --> C[Services]
        C --> D[API Client]
        E[Context] --> B
        F[Hooks] --> B
    end
    
    subgraph "Backend - Node.js/Express"
        G[Routes] --> H[Controllers]
        H --> I[Models]
        H --> J[Services]
        J --> K[Utils]
    end
    
    subgraph "Base de Données"
        L[(PostgreSQL)]
    end
    
    subgraph "Services Externes"
        M[WhatsApp API]
        N[Email SMTP]
        O[Google Maps]
        P[PDF Generator]
    end
    
    D -->|HTTP/REST| G
    I -->|SQL| L
    J -->|API| M
    J -->|SMTP| N
    B -->|Embed| O
    J -->|Generate| P
    
    style A fill:#0A1628,color:#F8F6F1
    style G fill:#C9A84C,color:#0A1628
    style L fill:#10B981,color:#fff
    style M fill:#25D366,color:#fff