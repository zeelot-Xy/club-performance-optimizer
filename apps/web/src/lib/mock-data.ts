import type {
  DashboardStat,
  MatchWeekRecord,
  PlayerRecord,
  RecommendationRecord,
} from "../types/ui";

export const dashboardStats: DashboardStat[] = [
  { label: "Squad Size", value: "23", trend: "1 academy promotion this month" },
  { label: "Eligible Starters", value: "17", trend: "4 players monitored for load", tone: "success" },
  { label: "Injury / Recovery", value: "3", trend: "2 defenders nearing return", tone: "warning" },
  { label: "Recommendation Confidence", value: "84%", trend: "Rule engine stable for Week 7" },
];

export const readinessByUnit = [
  { unit: "Goalkeepers", readiness: 87 },
  { unit: "Defenders", readiness: 79 },
  { unit: "Midfielders", readiness: 84 },
  { unit: "Forwards", readiness: 81 },
];

export const weeklyTrend = [
  { week: "W4", readiness: 76 },
  { week: "W5", readiness: 80 },
  { week: "W6", readiness: 82 },
  { week: "W7", readiness: 84 },
];

export const players: PlayerRecord[] = [
  { id: "p1", squadNumber: 1, fullName: "Daniel Okafor", primaryPosition: "GK", positionGroup: "GOALKEEPER", preferredFoot: "RIGHT", age: 28, status: "ACTIVE", readiness: 88 },
  { id: "p2", squadNumber: 13, fullName: "Ayo Sule", primaryPosition: "GK", positionGroup: "GOALKEEPER", preferredFoot: "LEFT", age: 23, status: "ACTIVE", readiness: 76 },
  { id: "p3", squadNumber: 2, fullName: "Tunde Adebayo", primaryPosition: "RB", secondaryPosition: "RWB", positionGroup: "DEFENDER", preferredFoot: "RIGHT", age: 25, status: "ACTIVE", readiness: 83 },
  { id: "p4", squadNumber: 3, fullName: "Emeka Nwosu", primaryPosition: "LB", secondaryPosition: "LWB", positionGroup: "DEFENDER", preferredFoot: "LEFT", age: 24, status: "ACTIVE", readiness: 85 },
  { id: "p5", squadNumber: 4, fullName: "Samuel Ibe", primaryPosition: "CB", positionGroup: "DEFENDER", preferredFoot: "RIGHT", age: 29, status: "ACTIVE", readiness: 81 },
  { id: "p6", squadNumber: 5, fullName: "Ibrahim Yusuf", primaryPosition: "CB", positionGroup: "DEFENDER", preferredFoot: "RIGHT", age: 27, status: "RECOVERY", readiness: 68 },
  { id: "p7", squadNumber: 12, fullName: "Kehinde Balogun", primaryPosition: "CB", secondaryPosition: "RB", positionGroup: "DEFENDER", preferredFoot: "RIGHT", age: 22, status: "ACTIVE", readiness: 78 },
  { id: "p8", squadNumber: 14, fullName: "Leon Chukwu", primaryPosition: "LB", positionGroup: "DEFENDER", preferredFoot: "LEFT", age: 26, status: "INJURED", readiness: 44 },
  { id: "p9", squadNumber: 17, fullName: "Paul Eze", primaryPosition: "RB", positionGroup: "DEFENDER", preferredFoot: "RIGHT", age: 21, status: "ACTIVE", readiness: 74 },
  { id: "p10", squadNumber: 6, fullName: "Moses Lawal", primaryPosition: "DM", secondaryPosition: "CM", positionGroup: "MIDFIELDER", preferredFoot: "RIGHT", age: 28, status: "ACTIVE", readiness: 86 },
  { id: "p11", squadNumber: 8, fullName: "Victor Udo", primaryPosition: "CM", positionGroup: "MIDFIELDER", preferredFoot: "RIGHT", age: 26, status: "ACTIVE", readiness: 84 },
  { id: "p12", squadNumber: 10, fullName: "Nathaniel Obi", primaryPosition: "AM", secondaryPosition: "CM", positionGroup: "MIDFIELDER", preferredFoot: "LEFT", age: 24, status: "ACTIVE", readiness: 89 },
  { id: "p13", squadNumber: 15, fullName: "Chisom Ahaneku", primaryPosition: "CM", secondaryPosition: "DM", positionGroup: "MIDFIELDER", preferredFoot: "RIGHT", age: 22, status: "ACTIVE", readiness: 75 },
  { id: "p14", squadNumber: 16, fullName: "John Akinola", primaryPosition: "LW", secondaryPosition: "AM", positionGroup: "MIDFIELDER", preferredFoot: "LEFT", age: 23, status: "UNAVAILABLE", readiness: 59 },
  { id: "p15", squadNumber: 18, fullName: "Sodiq Ganiyu", primaryPosition: "RM", secondaryPosition: "RW", positionGroup: "MIDFIELDER", preferredFoot: "RIGHT", age: 25, status: "ACTIVE", readiness: 80 },
  { id: "p16", squadNumber: 7, fullName: "Tariq Hassan", primaryPosition: "RW", secondaryPosition: "ST", positionGroup: "FORWARD", preferredFoot: "LEFT", age: 24, status: "ACTIVE", readiness: 87 },
  { id: "p17", squadNumber: 9, fullName: "Michael Etim", primaryPosition: "ST", positionGroup: "FORWARD", preferredFoot: "RIGHT", age: 29, status: "ACTIVE", readiness: 90 },
  { id: "p18", squadNumber: 11, fullName: "Elijah Omoregie", primaryPosition: "LW", secondaryPosition: "RW", positionGroup: "FORWARD", preferredFoot: "RIGHT", age: 23, status: "ACTIVE", readiness: 82 },
  { id: "p19", squadNumber: 19, fullName: "Kelvin Bassey", primaryPosition: "ST", secondaryPosition: "LW", positionGroup: "FORWARD", preferredFoot: "RIGHT", age: 21, status: "RECOVERY", readiness: 66 },
  { id: "p20", squadNumber: 20, fullName: "Femi Adeniran", primaryPosition: "RW", secondaryPosition: "AM", positionGroup: "FORWARD", preferredFoot: "LEFT", age: 20, status: "ACTIVE", readiness: 77 },
  { id: "p21", squadNumber: 21, fullName: "Uche Nnamdi", primaryPosition: "CM", secondaryPosition: "AM", positionGroup: "MIDFIELDER", preferredFoot: "RIGHT", age: 20, status: "ACTIVE", readiness: 71 },
  { id: "p22", squadNumber: 22, fullName: "David Afolabi", primaryPosition: "CB", positionGroup: "DEFENDER", preferredFoot: "LEFT", age: 24, status: "ACTIVE", readiness: 73 },
  { id: "p23", squadNumber: 23, fullName: "Ridwan Azeez", primaryPosition: "LW", secondaryPosition: "ST", positionGroup: "FORWARD", preferredFoot: "RIGHT", age: 22, status: "ACTIVE", readiness: 74 },
];

export const matchWeeks: MatchWeekRecord[] = [
  {
    id: "mw1",
    label: "Week 7",
    opponentName: "Lagos Mariners",
    matchDate: "2026-04-27",
    status: "READY",
    notes: "Opponent presses high in the first phase. Protect central progression and attack their full-back spaces early.",
    completion: 92,
  },
  {
    id: "mw2",
    label: "Week 8",
    opponentName: "Benin Atlas",
    matchDate: "2026-05-04",
    status: "PLANNING",
    notes: "Need fresh midfield availability data before tactical shaping is locked.",
    completion: 48,
  },
  {
    id: "mw3",
    label: "Week 6",
    opponentName: "Rivergate United",
    matchDate: "2026-04-19",
    status: "COMPLETED",
    notes: "Recommendation aligned with final XI in 9 of 11 slots.",
    completion: 100,
  },
];

export const recommendation: RecommendationRecord = {
  id: "rec-7",
  matchWeekLabel: "Week 7",
  opponentName: "Lagos Mariners",
  formation: "4-3-3",
  status: "READY",
  summary:
    "The recommended 4-3-3 protects midfield control while keeping two wide forwards available to attack the opponent’s advanced full-backs.",
  ruleScoreSummary:
    "Rule-based scoring prioritized current training rating, fitness, morale, and reduced fatigue. The midfield triangle produced the highest balanced unit score.",
  mlSupportSummary:
    "Random Forest support is available for selected players and remains advisory only. The strongest support scores were Michael Etim, Nathaniel Obi, and Tariq Hassan.",
  explanationHighlights: [
    "Daniel Okafor remains the safest goalkeeper choice because his availability, fitness, and recent training scores are all strong.",
    "Nathaniel Obi is favored as the advanced midfielder because he combines high morale with the best recent training form in the squad.",
    "Michael Etim leads the line because he provides the highest forward readiness and lowest tactical risk among eligible strikers.",
  ],
  lineup: [
    { id: "p1", squadNumber: 1, fullName: "Daniel Okafor", positionGroup: "GOALKEEPER", positionLabel: "GK", startingPosition: "goalkeeper-1", readinessScore: 88, reason: "Reliable shot-stopping baseline and strong availability." },
    { id: "p3", squadNumber: 2, fullName: "Tunde Adebayo", positionGroup: "DEFENDER", positionLabel: "RB", startingPosition: "defender-1", readinessScore: 83, reason: "Best right-sided defender for overlap and recovery runs." },
    { id: "p5", squadNumber: 4, fullName: "Samuel Ibe", positionGroup: "DEFENDER", positionLabel: "RCB", startingPosition: "defender-2", readinessScore: 81, reason: "Strong central duel profile and stable availability." },
    { id: "p22", squadNumber: 22, fullName: "David Afolabi", positionGroup: "DEFENDER", positionLabel: "LCB", startingPosition: "defender-3", readinessScore: 73, reason: "Left-footed balance improves build-out shape." },
    { id: "p4", squadNumber: 3, fullName: "Emeka Nwosu", positionGroup: "DEFENDER", positionLabel: "LB", startingPosition: "defender-4", readinessScore: 85, reason: "High readiness and consistent width support on the left." },
    { id: "p10", squadNumber: 6, fullName: "Moses Lawal", positionGroup: "MIDFIELDER", positionLabel: "DM", startingPosition: "midfielder-1", readinessScore: 86, reason: "Anchors the block and protects central transitions." },
    { id: "p11", squadNumber: 8, fullName: "Victor Udo", positionGroup: "MIDFIELDER", positionLabel: "CM", startingPosition: "midfielder-2", readinessScore: 84, reason: "Links defensive recovery with progressive circulation." },
    { id: "p12", squadNumber: 10, fullName: "Nathaniel Obi", positionGroup: "MIDFIELDER", positionLabel: "AM", startingPosition: "midfielder-3", readinessScore: 89, reason: "Best creative option for the half-spaces this week." },
    { id: "p18", squadNumber: 11, fullName: "Elijah Omoregie", positionGroup: "FORWARD", positionLabel: "LW", startingPosition: "forward-1", readinessScore: 82, reason: "Direct left-sided runner with controlled fatigue." },
    { id: "p17", squadNumber: 9, fullName: "Michael Etim", positionGroup: "FORWARD", positionLabel: "ST", startingPosition: "forward-2", readinessScore: 90, reason: "Highest overall attacking readiness in the squad." },
    { id: "p16", squadNumber: 7, fullName: "Tariq Hassan", positionGroup: "FORWARD", positionLabel: "RW", startingPosition: "forward-3", readinessScore: 87, reason: "Strong one-versus-one output and transition threat." },
  ],
  excludedPlayers: [
    { id: "p6", fullName: "Ibrahim Yusuf", squadNumber: 5, status: "RECOVERY", reason: "Not excluded permanently, but recovery load makes a start risky this week." },
    { id: "p8", fullName: "Leon Chukwu", squadNumber: 14, status: "INJURED", reason: "Unavailable due to injury status." },
    { id: "p14", fullName: "John Akinola", squadNumber: 16, status: "UNAVAILABLE", reason: "Unavailable for selection this week." },
    { id: "p19", fullName: "Kelvin Bassey", squadNumber: 19, status: "RECOVERY", reason: "Forward depth option only while return-to-play minutes are managed." },
  ],
};
