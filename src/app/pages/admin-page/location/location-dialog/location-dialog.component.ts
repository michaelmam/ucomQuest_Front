import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReplaySubject, Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { GameProps } from '../../game/game.component';
import {takeUntil} from "rxjs/operators";
import { GameService } from 'src/app/shared/service/game.service';
import {MatTableDataSource} from "@angular/material/table";
import {LocationProps} from "../location.component";
import { LocationService } from 'src/app/shared/service/location.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {
  protected games: GameProps[] = [];
  protected allGames: GameProps[] = [];
  public gameMultiFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filteredGamesMulti: ReplaySubject<GameProps[]> = new ReplaySubject<GameProps[]>(1);
  form = new FormGroup({
    game: new FormControl("", Validators.required),
    location: new FormControl(""),
  });
  displayedColumns: string[] = [
    'gameCode',
    'gameType',
    'name',
    'description',
    'fullDescription',
    'point',
    'game location',
    'actions'
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  location: LocationProps = {
    _id: '',
    games: [],
    locationGames: [],
    name: '',
    location: ''
  };
  gamesData: GameProps[] = [];
  dataSource = new MatTableDataSource(this.gamesData);

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService,
  private locationService: LocationService) {}

  ngOnInit(): void {
    if (this.data.action === 'add') {
      this.location = {...this.location, ...JSON.parse(JSON.stringify(this.data.elem))}
      this.gamesData = this.location.locationGames || []
      this.dataSource = new MatTableDataSource(this.gamesData);
      this.gameService.getGames().subscribe((data: GameProps[]) => {
        if(data) {
          this.allGames = data;
          this.gamesFilter()
        }
      })
      this.gameMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterGamesMulti();
        });
    }
  }
  gamesFilter() {
    this.games = this.allGames.filter(({_id}) => !this.location.games.find(({gameId}) => gameId === _id));
    this.filteredGamesMulti.next(this.games.slice());
  }
  protected filterGamesMulti() {
    if (!this.games) {
      return;
    }
    let search = this.gameMultiFilterCtrl.value.trim();
    if (!search) {
      this.filteredGamesMulti.next(this.games.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredGamesMulti.next(
      this.games.filter(game => game.name.toLowerCase().indexOf(search) > -1)
    );
  }

  add() {
    if (this.form.valid) {
      this.gamesData.unshift({...this.form.value.game, location: this.form.value.location})
      this.location.locationGames = this.gamesData;
      this.dataSource = new MatTableDataSource(this.gamesData);
      this.location.games.unshift({
        gameId: this.form.value.game._id,
        location: this.form.value.location});
      this.gamesFilter()
    }
  }

  delete(element: GameProps) {
    this.gamesData = this.gamesData.filter(({_id}) => _id !== element._id);
    this.location.games = this.location.games.filter(elem => elem.gameId !== element._id);
    this.location.locationGames = this.gamesData;
    this.dataSource = new MatTableDataSource(this.gamesData);
    this.gamesFilter()
  }

  openLocation(game: GameProps) {
    // game.location && this.locationService.openLocationInMap(game.location)
  }
}
