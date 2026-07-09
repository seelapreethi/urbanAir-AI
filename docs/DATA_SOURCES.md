# UrbanAir AI – Data Sources

Version: 1.0

Last Updated: July 2026

---

# Overview

UrbanAir AI integrates multiple open datasets and APIs to generate intelligent insights for city administrators.

This document defines every data source used by the platform.

Goals

✓ 100% Free

✓ Public APIs where possible

✓ Open Datasets

✓ Easy to reproduce

✓ Suitable for Hackathon MVP

✓ Scalable to Production

---

# Data Architecture

                   UrbanAir AI

                         │

 ┌───────────────────────┼─────────────────────────┐

 │                       │                         │

 AQI                  Weather                 Satellite

 │                       │                         │

 ├──────────────┐        │        ┌───────────────┤

 │              │        │        │

 Traffic     Land Use    Population    Government Data

 │              │             │              │

 └──────────────┴─────────────┴──────────────┘

                 Data Processing Layer

                         │

               AI Intelligence Layer

                         │

              Dashboard / Reports / APIs

---

# Data Sources

## 1. AQI Monitoring Data

Purpose

Current air quality.

Used By

AI Command Center

Forecast

Source Attribution

Dashboard

Reports

Provider

Central Pollution Control Board (CPCB)

Website

https://app.cpcbccr.com/

Data

PM2.5

PM10

NO₂

SO₂

CO

O₃

NH₃

AQI

Update Frequency

Near Real-Time

Free

Yes

Priority

Critical

---

## 2. OpenAQ

Purpose

Global AQI backup dataset.

Provider

OpenAQ

Website

https://openaq.org/

Used By

Historical Analysis

Forecast

Visualization

Update

Near Real-Time

Free

Yes

Priority

High

---

## 3. OpenWeatherMap

Purpose

Weather Forecast

Temperature

Humidity

Wind

Rain

Pressure

Clouds

Website

https://openweathermap.org/api

Used By

Forecast

Scenario Simulator

Dashboard

Forecast Interval

Hourly

Free Tier

Yes

Priority

Critical

---

## 4. IMD Weather

Purpose

Official Indian weather

Website

https://mausam.imd.gov.in/

Use

Model Validation

Forecast Comparison

Priority

Medium

---

## 5. Sentinel Satellite

Purpose

Satellite Imagery

Provider

ESA

Website

https://dataspace.copernicus.eu/

Data

Land Cover

Thermal Patterns

Vegetation

Urban Expansion

Use

Source Attribution

Forecast

Heat Islands

Priority

High

---

## 6. MODIS

Purpose

Thermal anomalies

Fire detection

Website

https://modis.gsfc.nasa.gov/

Use

Waste Burning

Forest Fires

Smoke Detection

Priority

Medium

---

## 7. OpenStreetMap

Purpose

Roads

Buildings

Hospitals

Schools

Landmarks

Provider

OpenStreetMap

Website

https://www.openstreetmap.org/

Use

Map

Routing

Ward Display

Priority

Critical

---

## 8. Government Ward Boundaries

Purpose

Ward Polygons

Zones

Provider

State Open Data Portals

Use

Map

Forecast

Source Attribution

Priority

High

---

## 9. Traffic Data

Preferred

TomTom

Alternative

Mock Dataset

Use

Source Attribution

Forecast

Scenario Simulator

Priority

Medium

---

## 10. Population Dataset

Provider

Indian Census

Website

https://censusindia.gov.in/

Use

Citizen Risk

Heat Maps

Priority

Medium

---

## 11. Hospital Locations

Provider

OpenStreetMap

Use

Citizen Advisory

Risk Assessment

Priority

Medium

---

## 12. School Locations

Provider

OpenStreetMap

Use

Citizen Alerts

Priority

Medium

---

## 13. Industrial Areas

Provider

OpenStreetMap

Government GIS

Use

Source Attribution

Enforcement

Priority

High

---

## 14. Construction Zones

Provider

Municipal Open Data

Alternative

Mock Dataset

Use

Source Attribution

Priority

Medium

---

## 15. Pollution Hotspots

Generated

Internal AI

Use

Heatmaps

Enforcement

Reports

Priority

Critical

---

# AI Datasets

Forecast Training

Input

AQI

Weather

Traffic

Season

Output

Future AQI

Algorithm

XGBoost

LightGBM

Prophet

Priority

Critical

---

# Embedding Dataset

Purpose

AI Chat

Recommendation

Reports

Data

AQI Guidelines

WHO Guidelines

CPCB Guidelines

Government Circulars

Urban Air Reports

Embeddings

Sentence Transformers

Vector Store

FAISS

Priority

High

---

# Mock Data

Purpose

Frontend Development

Files

cities.json

forecast.json

recommendations.json

aqi.json

alerts.json

reports.json

users.json

scenario.json

Use

Before Backend Completion

Priority

Critical

---

# Data Pipeline

External Sources

↓

Data Fetchers

↓

Validation

↓

Cleaning

↓

Transformation

↓

Database

↓

AI Models

↓

REST APIs

↓

Frontend

---

# Refresh Frequency

AQI

Every 15 Minutes

Weather

Every Hour

Forecast

Every 6 Hours

Reports

Daily

Satellite

Daily

Population

Static

Hospitals

Monthly

---

# Data Validation

Validate

Missing Values

Duplicate Records

Invalid AQI

Negative Values

Coordinate Errors

Timestamp Errors

---

# Data Storage

PostgreSQL

AQI

Cities

Weather

Forecast

Recommendations

Reports

Users

PostGIS

Coordinates

Ward Boundaries

Heatmaps

Redis

Cache

Session

Forecast Cache

---

# Free APIs

OpenAQ

Free

OpenWeather

Free Tier

OpenStreetMap

Free

OpenRouter

Free Models

Supabase

Free Tier

Render

Free Tier

Vercel

Free Tier

---

# APIs to Build

/api/aqi

/api/weather

/api/forecast

/api/recommendation

/api/source-attribution

/api/report

/api/chat

/api/scenario

/api/cities

/api/alerts

---

# Risks

Traffic APIs

Limited Free Tier

Mitigation

Use mock data initially.

---

Ward Boundaries

May differ across cities.

Mitigation

Use GeoJSON.

---

Satellite Data

Heavy Processing

Mitigation

Pre-download sample datasets.

---

Real-Time Streams

Complex

Mitigation

Scheduled updates.

---

# MVP Data Sources

Must Have

✓ CPCB AQI

✓ OpenWeather

✓ OpenStreetMap

✓ OpenAQ

✓ Mock Traffic

✓ Mock Construction

✓ Government AQI Guidelines

---

# Future Enhancements

IoT Sensors

Drone Monitoring

Live CCTV Analytics

Edge AI

Mobile Sensor Integration

Citizen Crowdsourcing

Smart Traffic Integration

Digital Twin

---

# Conclusion

UrbanAir AI is designed to be completely buildable using free and open data sources while remaining extensible for production deployment.

The MVP prioritizes reproducibility, accessibility, and ease of development without compromising the core intelligence required by the hackathon.