import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {GameService} from "../../../shared/service/game.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {GameDialogComponent} from "./game-dialog/game-dialog.component";

export interface GameProps {
  _id: string;
  name: string;
  gameType: string;
  description: number;
  fullDescription: number;
  gameCode: string;
  point: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  displayedColumns: string[] = [
    // 'index',
    'gameCode',
    'gameType',
    'name',
    'description',
    'fullDescription',
    'point',
    // 'location',
    'actions'
  ];
  editGame: GameProps = {gameCode: "", _id: "", description: 0, fullDescription: 0, gameType: "", name: "", point: 0};
  columnsToDisplay: string[] = this.displayedColumns.slice();
  gamesData: GameProps[] = [];
  editing = false;
  dataSource = new MatTableDataSource(this.gamesData);

  constructor(private gameService: GameService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getGames()
  }

  getGames() {
    this.gameService.getGames().subscribe(data => {
      if (data) {
        this.gamesData = data
        this.dataSource = new MatTableDataSource(this.gamesData);
      }
    })
  }

  addGame(game: GameProps) {
    if (this.editing) {
      this.gameService.editGame(game).subscribe(data => {
        if (data) {
          this.gamesData.unshift(game)
          this.dataSource = new MatTableDataSource(this.gamesData);
          this.snackBar.open(`edited ${game.name}`, 'ok', {
            duration: 1000,
          })
        }
      })
    } else {
      this.gameService.newGame(game).subscribe(data => {
        if (data) {
          this.gamesData.unshift(data)
          this.dataSource = new MatTableDataSource(this.gamesData);
          this.snackBar.open(`created ${game.name}`, 'ok', {
            duration: 1000,
          })
        }
      })
    }
  }

  delete(game: GameProps) {
    const dialogRef = this.dialog.open(GameDialogComponent, {
      width: '250px',
      data: game
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.gameService.removeGame(game._id).subscribe(data => {
          if(data) {
            this.gamesData = this.gamesData.filter(({_id}) => _id !== game._id );
            this.dataSource = new MatTableDataSource(this.gamesData);
            this.snackBar.open(`removed ${game.name}`, 'ok', {
              duration: 1000,
            })
          }
        })
      }
    });
  }

  edit(game: GameProps) {
    if (this.editing) {
      this.gamesData.unshift(this.editGame)
      this.dataSource = new MatTableDataSource(this.gamesData);
    }
    this.editing = true;
    this.gamesData = this.gamesData.filter(({_id}) => _id !== game._id);
    this.dataSource = new MatTableDataSource(this.gamesData);
    this.editGame = game;
  }

  cancelEditing() {
    this.gamesData.unshift(this.editGame)
    this.dataSource = new MatTableDataSource(this.gamesData);
    this.editing = false;
    this.editGame = {gameCode: "", _id: "", description: 0, fullDescription: 0, gameType: "", name: "", point: 0}
  }

  copy(game: GameProps) {
    this.editGame = game;
  }
}
