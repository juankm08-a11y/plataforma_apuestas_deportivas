import { map, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { MatchMapper } from '../mappers/match.mapper';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchController {
  constructor(private api: ApiService) {}

  getMatches(): Observable<Match[]> {
    return this.api
      .getMatches()
      .pipe(
        map((rawArray) => rawArray.map((item) => MatchMapper.fromApi(item)))
      );
  }
}
