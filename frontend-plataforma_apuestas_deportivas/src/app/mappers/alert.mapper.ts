import { AlertDTO } from '../dto/alert.dto';
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

  static toDTO(model: Alert): AlertDTO {
    return {
      id: model.id,
      type: model.type,
      matchId: model.matchId,
      oldOdds: model.oldOdds,
      newOdds: model.newOdds,
      change: model.change,
      timestamp: model.timestamp,
    };
  }
}
