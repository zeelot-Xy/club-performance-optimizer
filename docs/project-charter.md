# Project Charter

## Project Title
AI-Based Football Club Player Performance Analysis and Explainable Weekly Lineup Recommendation System

## Project Type
Final-year undergraduate software engineering project

## Project Goal
To design and implement a web-based intelligent decision-support system that analyzes player performance for one selected club at a time and recommends an explainable weekly formation and starting lineup.

## Target User
Coach/Admin

## Business Context
Football coaches often rely on subjective judgment when selecting weekly lineups. This project provides structured, data-driven support while preserving explainability, promoting fairer selection, protecting player welfare, and improving tactical preparation.

## Primary Objectives
- Import, activate, and manage one club workspace at a time
- Record weekly performance-related indicators
- Compute explainable player scores
- Recommend a formation and starting lineup
- Present reasons behind each recommendation
- Optionally improve prediction with a simple ML model

## Success Criteria
- Coach can log in securely
- Coach can manage up to 25 players
- Coach can enter or view weekly player metrics
- System can generate weekly formation and lineup recommendations
- System explains recommendations clearly
- System runs locally using Docker Compose

## Constraints
- One active club workspace at a time
- No real-time analytics
- No video or sensor data
- Explainability is mandatory
- Must be technically defendable in an academic setting
