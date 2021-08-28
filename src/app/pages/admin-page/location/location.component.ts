import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {LocationDialogComponent} from "./location-dialog/location-dialog.component";
import {LocationService} from "../../../shared/service/location.service";
export interface LocationProps {
  _id: string;
  name: string;
  startDescription: string;
  location: string;
  finishPoint: number;
  finishTime: number;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  displayedColumns: string[] = [
    // 'add Game',
    'name',
    'startDescription',
    'finishPoint',
    'finishTime',
    'actions'
  ];
  editData: LocationProps = {} as LocationProps;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  locationsData: LocationProps[] = [];
  dataSource = new MatTableDataSource(this.locationsData);
  editing: boolean = false;

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
    if (location._id) {
      this.locationService.editLocation(location).subscribe(data => {
        if (data) {
          this.locationsData.unshift(location)
          this.dataSource = new MatTableDataSource(this.locationsData);
          this.snackBar.open(`created ${location.name}`, 'ok', {
            duration: 1000,
          })
        }
      })
    } else {
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
            this.snackBar.open(`updated ${location.name}`, 'ok', {
              duration: 1000,
            })
          }
        })
      }
    });
  }
  openLocation(location: LocationProps) {
    location.location && this.locationService.openLocationInMap(location.location)
  }

  editLocation(element: LocationProps) {
    this.editData = element;
    this.locationsData = this.locationsData.filter(({_id}) => _id !== element._id );
    this.dataSource = new MatTableDataSource(this.locationsData);
    this.editing = true;
  }

  cancelEditing($event: any) {
    this.editing = false;

    this.locationsData.unshift(this.editData)
    this.dataSource = new MatTableDataSource(this.locationsData);

    this.editData = {} as LocationProps;
  }
}
