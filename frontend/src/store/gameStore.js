import { create } from "zustand";

export const useGameStore = create((set) => ({
  playerId: new URLSearchParams(window.location.search).get("player") ? parseInt(new URLSearchParams(window.location.search).get("player")) : 1,
  playerTurn: 1,
  isBotGame: false,
  botDifficulty: "medium", // "easy" | "medium" | "hard"

  setPlayer: (id) => set({ playerId: id }),
  setBotGame: (val) => set({ isBotGame: val }),
  setBotDifficulty: (level) => set({ botDifficulty: level }),

  score: {
    player1: 0,
    player2: 0,
  },

  setTurn: (turn) => set({ playerTurn: turn }),

  switchTurn: () =>
    set((state) => ({
      playerTurn: state.playerTurn === 1 ? 2 : 1,
    })),

  addScore: (player, value) =>
    set((state) => ({
      score: {
        ...state.score,
        [player]: state.score[player] + value,
      },
    })),
    
  resetGame: () => set({
    playerTurn: 1,
    score: { player1: 0, player2: 0 }
  })
}));
