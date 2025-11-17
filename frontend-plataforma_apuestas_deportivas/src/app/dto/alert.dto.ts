export interface AlertDTO {
  id?: string;
  type: string;
  matchId: string;
  oldOdds?: number;
  newOdds?: number;
  change?: string | number;
  timestamp: number;
}
