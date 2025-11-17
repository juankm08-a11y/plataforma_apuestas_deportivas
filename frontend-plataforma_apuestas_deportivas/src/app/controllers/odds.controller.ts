import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { OddsMapper } from '../mappers/odds.mapper';
import { Odds } from '../models/odds_model';

export class OddsController {
  constructor(private api: ApiService) {}

  updateOdds(matchId: string, newOdds: number): Observable<any> {
    const model: Odds = { matchId, newOdds };
    const dto = OddsMapper.toDTO(model);

    return this.api.postOdds(matchId, dto);
  }
}
