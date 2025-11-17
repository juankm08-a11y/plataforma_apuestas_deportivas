import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.base}/matches`);
  }

  postOdds(matchId: string, payload: { newOdds: number }): Observable<any> {
    return this.http.post(`${this.base}/matches/${matchId}/odds`, payload);
  }

  postAlert(alert: Alert): Observable<any> {
    return this.http.post(`${this.base}/alerts`, alert);
  }
}
