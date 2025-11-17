import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-match-card',
  imports: [],
  templateUrl: './match-card.component.html',
  styleUrl: './match-card.component.scss',
})
export class MatchCardComponent {
  @Input() match!: Match;
}
