import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { GameService } from 'src/app/shared/service/game.service';

@Component({
  selector: 'app-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.css']
})
export class GameDialogComponent implements OnInit {
  loading = true
  file = {
    type: '',
    file: ''
  };
  constructor(
    public dialogRef: MatDialogRef<GameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService,
  ) {}

  ngOnInit(): void {
    if (this.data.file) {
      this.gameService.getGameFile(this.data.fileName).subscribe(el => {
        const encode = new Uint8Array(el.fileData.data);
        const blob = new Blob([encode], {type: el.fileType.mime});
        this.file.type = el.fileType.mime;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            this.file.file = reader.result;
            this.loading = false
          }
        }
      })
    }
  }

}
