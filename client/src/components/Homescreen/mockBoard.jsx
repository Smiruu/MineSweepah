// mockBoard.js
export const mockBoard = [
  [
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
    { mine: true, revealed: false, flagged: false, adjacent: 0 },
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
  ],
  [
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
    { mine: true, revealed: false, flagged: false, adjacent: 0 },
  ],
  [
    { mine: false, revealed: false, flagged: false, adjacent: 0 },
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
    { mine: false, revealed: false, flagged: false, adjacent: 1 },
  ],
];
