import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {GameService} from "../../../shared/service/game.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {GameDialogComponent} from "./game-dialog/game-dialog.component";
import {MatSort} from "@angular/material/sort";
import {LocationProps} from "../location/location.component";
import { LocationService } from 'src/app/shared/service/location.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
export interface GameProps {
  _id?: string;
  name: string;
  fileName?: string,
  gameType: string;
  description: number;
  fullDescription: number;
  gameCode: string;
  point: number;
  location: string;
  locationId: string;
  maxPlayerCount: number;
  gamePlayTime: number;
  file?: any;
}
const displayedColumns: string[] = [
  // 'index',
  'gameCode',
  'gameType',
  'name',
  'description',
  'fullDescription',
  'point',
  'maxPlayerCount',
  'gamePlayTime',
  'locationName',
  'actions'
];
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GameComponent implements OnInit, AfterViewInit {
  displayedColumns = displayedColumns
  editGame: GameProps = {} as GameProps;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  gamesData: GameProps[] = [];
  editing = false;
  dataSource = new MatTableDataSource(this.gamesData);
  expandedElement: GameProps | null | undefined;
  @ViewChild(MatSort) sort = {} as MatSort;
  constructor(private gameService: GameService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private locationService: LocationService) { }

  ngOnInit(): void {
    this.getGames()
  }
  compare(a: GameProps, b: GameProps, props: keyof GameProps, value: number) {
    if ( a[props] < b[props] ){
      return -value;
    }
    if ( a[props] > b[props] ){
      return value;
    }
    return 0;
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe((e) => {
      this.gamesData.sort((a,b) => this.compare(a, b, e.active as keyof GameProps, e.direction === 'asc' ? 1 : -1));
      this.dataSource = new MatTableDataSource(this.gamesData);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
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
    console.log(game);
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
      if(result && game?._id) {
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
    this.editGame = {} as GameProps
  }

  copy(game: GameProps) {
    this.editGame = game;
  }

  openLocation(location: LocationProps) {
    location.location && this.locationService.openLocationInMap(location.location)
  }
}
