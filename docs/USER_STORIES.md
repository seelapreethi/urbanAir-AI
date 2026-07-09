# UrbanAir AI – User Stories

Version: 1.0

---

# Purpose

This document defines every user type and the features available to them.

---

# User Roles

## 1. City Administrator

Primary User

### Goals

- Monitor city AQI
- Identify pollution hotspots
- Forecast pollution
- Plan interventions
- Generate reports

### User Stories

- As a City Administrator, I want to see today's AQI so that I can monitor city pollution.
- As a City Administrator, I want to identify pollution hotspots on a map.
- As a City Administrator, I want AI recommendations to reduce pollution.
- As a City Administrator, I want to compare AQI across cities.
- As a City Administrator, I want to export reports.
- As a City Administrator, I want to ask questions to the AI assistant.
- As a City Administrator, I want to simulate different intervention scenarios.

---

## 2. Pollution Control Officer

### Goals

- Find inspection targets
- Prioritize enforcement
- View industrial emissions
- Track violations

### User Stories

- View enforcement priority list.
- View pollution source attribution.
- Download inspection reports.
- Review AI-generated recommendations.
- Compare historical AQI.

---

## 3. Health Department Officer

### Goals

- Protect vulnerable populations.

### User Stories

- View ward-level health risk.
- Identify hospitals in high-risk zones.
- Generate citizen advisories.
- Download health reports.

---

## 4. Citizen

### Goals

- Understand local air quality.
- Receive health advice.

### User Stories

- View AQI near me.
- Receive health recommendations.
- View pollution forecast.
- Ask AI questions.
- Compare today's AQI with yesterday.

---

## 5. System Administrator

### Goals

- Manage users.
- Configure system.

### User Stories

- Manage user accounts.
- Configure AI models.
- Manage datasets.
- View logs.
- Monitor API health.

---

# Permissions Matrix

| Feature | Admin | PCB | Health | Citizen | System Admin |
|----------|------|-----|---------|----------|--------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forecast | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ✅ | ❌ | ✅ |
| AI Chat | ✅ | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ | Limited | ✅ |
| User Management | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# Success Criteria

Every user should complete their primary workflow within three clicks wherever possible.
