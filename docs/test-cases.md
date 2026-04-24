# Test Cases

## Automated Cases

### TC-API-01 Login Success
- Input: valid seeded admin credentials
- Expected: token returned and user profile included

### TC-API-02 Login Failure
- Input: valid email with invalid password
- Expected: unauthorized error with readable message

### TC-API-03 Player Lookup Failure
- Input: unknown player id
- Expected: `Player not found.`

### TC-API-04 Match Week Lookup Failure
- Input: unknown match week id
- Expected: `Match week not found.`

### TC-REC-01 Recommendation Generation Success
- Input: 11+ eligible players across required formation groups
- Expected: final recommendation, valid formation, 11 selected players

### TC-REC-02 Insufficient Eligible Players
- Input: fewer than 11 eligible players
- Expected: generation rejected with readable error

### TC-REC-03 Injured Player Exclusion
- Input: high-scoring player marked injured
- Expected: player excluded with injury reason

### TC-REC-04 Completed Match Week Rejection
- Input: completed match week status
- Expected: recommendation generation blocked

### TC-WEB-01 Recommendation Formatter Mapping
- Input: backend recommendation payload
- Expected: UI-ready formation, lineup, exclusion, and explanation data

### TC-WEB-02 Recommendation Empty State
- Input: selected match week with no stored recommendation
- Expected: empty-state message and generation action visible

### TC-WEB-03 Recommendation Loaded State
- Input: stored backend recommendation
- Expected: formation, player, and summary details render correctly

## Manual Cases

### TC-MAN-01 Login Flow
- Steps: open login page, sign in with seeded admin
- Expected: redirect into protected dashboard

### TC-MAN-02 Player View
- Steps: open players page
- Expected: live backend player records visible

### TC-MAN-03 Match Week View
- Steps: open match weeks page
- Expected: live backend match week records visible

### TC-MAN-04 Recommendation Generation from UI
- Steps: choose ready week, click generate
- Expected: backend recommendation created and rendered in page

### TC-MAN-05 Logout
- Steps: click logout in topbar
- Expected: token cleared and redirect to login
