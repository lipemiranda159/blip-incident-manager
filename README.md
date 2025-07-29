💥 Desafio Técnico — Staff Software Engineer | Blip

Este repositório contém a implementação do desafio técnico para a posição de **Staff Software Engineer na Blip**, com foco em um sistema completo de gerenciamento de incidentes.

O projeto contempla as partes de **back-end** (API RESTful) e **front-end** (interface responsiva), utilizando o **Blip Design System**.

---

## 🧭 Sumário

- [Objetivo do Projeto](#objetivo-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Design System Utilizado](#design-system-utilizado)
- [Próximos Passos / Melhorias](#próximos-passos--melhorias)
- [Sobre a Apresentação Final](#sobre-a-apresentação-final)

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação fullstack para gerenciamento de incidentes, atendendo aos requisitos funcionais e técnicos propostos no desafio:

### Backend:
- API RESTful para controle de incidentes
- Registro, atualização, filtragem e comentários
- Filtros por status, prioridade e período

### Frontend:
- Interface web responsiva
- Consumo da API de incidentes
- Utilização do Blip DS para construção da UI

---

## ⚙️ Tecnologias Utilizadas

### 🖥️ Frontend
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router DOM](https://reactrouter.com/)
- [@takenet/blip-ds-react](https://design.blip.ai/d/UbKsV1JhXTK4/instalacao#/blip-ds-no-react/react-ts) (Blip Design System)


### 🔧 Backend
- [.NET 9](https://dotnet.microsoft.com/)
- [C#](https://learn.microsoft.com/dotnet/csharp/)


---

## ✅ Funcionalidades Implementadas

### API
- [x] Registro de incidente (status, título, descrição, prioridade)
- [x] Atualização de status (Aberto, Em andamento, Resolvido, Cancelado)
- [x] Filtro de incidentes por status, prioridade e período
- [x] Inserção de comentários

### Frontend
- [x] Listagem de incidentes com paginação ou scroll infinito
- [x] Filtros por status e prioridade
- [x] Visualização detalhada do incidente
- [x] Criação de novos incidentes
- [x] Atualização do status de incidentes existentes
- [x] Inserção de comentários
- [x] Interface responsiva para diferentes tamanhos de tela
- [x] Utilização do **Blip DS** como biblioteca de componentes
