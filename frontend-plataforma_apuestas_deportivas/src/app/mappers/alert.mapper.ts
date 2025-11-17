import { Alert } from '../models/alert.model';

export class AlertMapper {
  static fromApi(raw: any): Alert {
    return {
      id: raw.id,
      type: raw.type,
      matchId: raw.matchId || raw.match_id,
      oldOdds: raw.oldOdds || raw.old_odds,
      newOdds: raw.newOdds || raw.new_odds,
      change: raw.change,
      timestamp: raw.timestamp || Date.now(),
    } as Alert;
  }

  static toApi(model: Alert) {
    return model;
  }
}
