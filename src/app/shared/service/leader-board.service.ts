import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardService {

  constructor(private apiService: ApiService) { }
  getLeaderBoardData() {
    return this.apiService.get('leaderboard')
  }
}
