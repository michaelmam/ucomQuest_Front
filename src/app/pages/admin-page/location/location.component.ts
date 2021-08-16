import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {LocationDialogComponent} from "./location-dialog/location-dialog.component";
import {LocationService} from "../../../shared/service/location.service";
import { GameProps } from '../game/game.component';
export interface LocationProps {
  _id: string;
  games: string[];
  locationGames: GameProps[];
  name: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  displayedColumns: string[] = [
    'add Game',
    'name',
    'Game count',
    'actions'
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  locationsData: LocationProps[] = [];
  dataSource = new MatTableDataSource(this.locationsData);

  constructor(private locationService: LocationService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLocations()
  }

  getLocations() {
    this.locationService.getLocations().subscribe(data => {
      if (data) {
        this.locationsData = data
        this.dataSource = new MatTableDataSource(this.locationsData);
      }
    })
  }

  addLocation(location: LocationProps) {
    this.locationService.newLocation(location).subscribe(data => {
      if (data) {
        this.locationsData.unshift(data)
        this.dataSource = new MatTableDataSource(this.locationsData);
        this.snackBar.open(`created ${location.name}`, 'ok', {
          duration: 1000,
        })
      }
    })
  }

  delete(location: LocationProps) {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '250px',
      data: {
        action: 'delete',
        elem: location
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.locationService.removeLocation(location._id).subscribe(data => {
          if(data) {
            this.locationsData = this.locationsData.filter(({_id}) => _id !== location._id );
            this.dataSource = new MatTableDataSource(this.locationsData);
            this.snackBar.open(`removed ${location.name}`, 'ok', {
              duration: 1000,
            })
          }
        })
      }
    });
  }

  addGame(location: LocationProps) {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      data: {
        width: '800px',
        action: 'add',
        elem: location
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.locationService.addGameToLocation(result).subscribe(data => {
          if(data) {
            this.locationsData = this.locationsData.map((elem) => {
              if (elem._id === result._id) {
                return result
              }
              return elem
            })
            this.dataSource = new MatTableDataSource(this.locationsData);
          }
        })
      }
    });
  }
}
