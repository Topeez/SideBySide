export type CyclePhase = "menstruation" | "follicular" | "ovulation" | "luteal" | "pms";

export function getCyclePhase(
  today: Date,
  lastPeriodStart: Date,
  cycleLength: number,
  periodLength: number,
): CyclePhase {
  const diffDays = Math.floor((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayIndex = ((diffDays % cycleLength) + cycleLength) % cycleLength;

  if(dayIndex < periodLength) return "menstruation";

  const ovulationDay = cycleLength - 14;

  if(Math.abs(dayIndex - ovulationDay) <= 1) return "ovulation";

  if(dayIndex >= ovulationDay) {
    if(cycleLength - dayIndex <= 5) return "pms";
    return "luteal"
  }

  return "follicular";
}