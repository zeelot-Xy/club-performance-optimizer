# Naming Conventions

## Overview
This document defines naming conventions to reduce ambiguity before implementation begins.

## General Folder and File Naming
- Use lowercase kebab-case for folders and most file names.
- Keep names short, descriptive, and domain-relevant.
- Avoid vague names such as `utils`, `helpers`, or `misc` unless the scope is genuinely narrow and clear.

## TypeScript Naming
- Use PascalCase for types, interfaces, classes, and React components.
- Use camelCase for variables, functions, and object properties.
- Use UPPER_SNAKE_CASE for true constants only.

## React Naming
- Use PascalCase for component files and component names.
- Use route and feature names that reflect the football domain clearly.

## API Module Naming
- Use clear domain-oriented names such as `players`, `weekly-performance`, `recommendations`, and `formations`.
- Avoid names that hide intent or bundle unrelated concerns.

## Database and Prisma Naming
- Use singular PascalCase for Prisma models later.
- Use clear domain nouns for model names.
- Keep football role terminology consistent across models and API code.

## Python Naming
- Use snake_case for Python files, functions, and variables.
- Keep ML-related module names explicit, such as `prediction_service.py` or `model_loader.py`.

## Domain Consistency Rule
- Use the same naming language for positions, match weeks, and recommendation concepts across docs, database design, backend services, and frontend labels where practical.
