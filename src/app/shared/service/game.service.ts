import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {GameProps} from "../../pages/admin-page/game/game.component";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private apiService: ApiService) { }

  newGame(game: GameProps) {
    return this.apiService.postFile('game', game)
  }
  editGame(game: GameProps) {
    return this.apiService.putOnlyFile('game', game)
  }
  getGames() {
    return this.apiService.get('game')
  }

  removeGame(id: string) {
    return this.apiService.delete('game', id)
  }
}
