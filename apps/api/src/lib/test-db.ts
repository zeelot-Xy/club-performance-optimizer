// Phase 11 keeps database-backed tests optional.
// Most backend tests in this project mock Prisma so recommendation
// and service behavior stay deterministic and fast.
export const testDb = {
  strategy: "mocked-prisma",
};
