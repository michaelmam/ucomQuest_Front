import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {GameProps} from "../../pages/admin-page/game/game.component";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) { }

  getFiles() {
    return this.apiService.get('file')
  }
}
