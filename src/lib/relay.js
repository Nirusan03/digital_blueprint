const S = Math.SQRT1_2;
export const MISSIONS = [
  {
    title: "Flip the signal.",
    description: "The receiver expects |1⟩. You’re starting at |0⟩.",
    initial: [1, 0],
    target: [0, 1],
    label: "|1⟩",
    budget: 1,
  },
  {
    title: "Two possibilities.",
    description: "Prepare an equal, positive superposition from |0⟩.",
    initial: [1, 0],
    target: [S, S],
    label: "|+⟩ = (|0⟩ + |1⟩) / √2",
    budget: 1,
  },
  {
    title: "Change the phase.",
    description:
      "Your signal is in |+⟩. Change it to |−⟩ without changing the probabilities.",
    initial: [S, S],
    target: [S, -S],
    label: "|−⟩ = (|0⟩ − |1⟩) / √2",
    budget: 1,
  },
  {
    title: "Make interference work.",
    description: "Start in |+⟩ and route the signal to |1⟩ in two gates.",
    initial: [S, S],
    target: [0, 1],
    label: "|1⟩",
    budget: 2,
  },
  {
    title: "Bring it home.",
    description: "The signal starts in |−⟩. Return it to |0⟩ using two gates.",
    initial: [S, -S],
    target: [1, 0],
    label: "|0⟩",
    budget: 2,
  },
];
export function fidelity(a, b) {
  return Math.min(1, Math.max(0, (a[0] * b[0] + a[1] * b[1]) ** 2));
}
