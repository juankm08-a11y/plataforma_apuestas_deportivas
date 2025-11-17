export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startAt: string;
  odds?: Record<string, number>;
}
