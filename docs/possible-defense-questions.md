# Possible Defense Questions

## Problem and Scope

### Why did you choose only one club?
Because the project was designed to be realistic and finishable within a final-year timeline. A single-club scope keeps the system technically coherent and academically defensible.

### Why weekly recommendations only?
Because weekly decision support is a clear and manageable planning unit. It avoids the complexity of live match analytics while still solving a meaningful football management problem.

### Why did you exclude live tracking, video analysis, and GPS?
Those features introduce hardware, streaming, computer vision, and validation complexity beyond the intended scope of an undergraduate full-stack software project.

## AI and Recommendation Logic

### Why do you call this AI if it is rule-based first?
Because the system still performs intelligent decision support using structured evaluation logic. The academic AI contribution is strengthened further by the optional ML support layer, but the rule engine remains primary for explainability.

### Why is rule-based logic the primary engine?
Because the project prioritizes explainability and auditability. A coach should be able to understand why each player was selected or excluded.

### Why did you use Random Forest?
Because the project uses structured tabular inputs, and Random Forest is a practical and defendable model for that type of data. It adds academic value without unnecessary complexity.

### Why is the ML layer secondary?
Because the project’s main requirement is explainable decision support. The ML layer is supplementary evidence, not the core decision authority.

## Data and Realism

### Is the dataset fully real?
No. The project uses a hybrid dataset strategy. Public football statistics provide structural realism, while weekly player-condition data such as fatigue and morale is synthetically generated.

### Why use synthetic data?
Because weekly readiness variables are rarely available in clean public datasets. Synthetic generation is an acceptable academic simulation method for a controlled prototype.

## Software Engineering

### Why did you choose a monorepo?
Because the project has closely related frontend, backend, and AI service components that benefit from shared documentation and coordinated versioning.

### Why separate the AI service from the backend?
Because it isolates experimentation from the core transactional and explainable system logic, which improves maintainability.

### Why use TanStack Query on the frontend?
Because it provides a clear and reliable pattern for server-state management, caching, mutation handling, and UI synchronization.

## Testing and Validation

### How did you validate the system?
Through automated backend and frontend tests, plus manual end-to-end verification of login, player management, match-week handling, and recommendation generation.

### What are the main limitations of the project?
- one club only
- weekly recommendation scope only
- partially synthetic weekly data
- supplementary rather than production-grade ML
- no live operational football analytics features
