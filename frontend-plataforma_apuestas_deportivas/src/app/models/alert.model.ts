export interface Alert {
  id?: string;
  type: string;
  matchId: string;
  oldOdds?: number;
  newOdds?: number;
  change?: number | string;
  timestamp: number;
}
