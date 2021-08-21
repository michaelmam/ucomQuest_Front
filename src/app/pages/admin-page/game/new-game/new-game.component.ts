import {Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameProps} from "../game.component";
import {MatTableDataSource} from "@angular/material/table";
import {LocationService} from "../../../../shared/service/location.service";
import {LocationProps} from "../../location/location.component";
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit, OnChanges {
  @Output() newGame = new EventEmitter();
  @Input() editing: boolean = false;
  @Output() cancelEditing = new EventEmitter();
  @Input() editData: GameProps = {} as GameProps;
  form = new FormGroup({
    _id: new FormControl(""),
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    gameType: new FormControl("standardGame", Validators.required),
    gameCode: new FormControl("", Validators.required),
    fullDescription: new FormControl("", Validators.required),
    point: new FormControl(0, Validators.required),
    locationId: new FormControl("", Validators.required),
    location: new FormControl(""),
    gamePlayTime: new FormControl("", Validators.required),
    maxPlayerCount: new FormControl("", Validators.required),
  });
  locationsData: LocationProps[] = []

  constructor(private locationService: LocationService,) { }

  ngOnInit(): void {
    this.getLocations()
  }
  getLocations() {
    this.locationService.getLocations().subscribe(data => {
      if (data) {
        this.locationsData = data
      }
    })
  }
  ngOnChanges() {
    if (this.editData._id) {

      const {
        gameCode,
        _id,
        description,
        fullDescription,
        gameType,
        name,
        point,
        locationId,
        location,
        gamePlayTime,
        maxPlayerCount,
      } = this.editData as GameProps
      this.form.setValue({
        _id,
        gameCode,
        description,
        fullDescription,
        gameType,
        name,
        point,
        locationId,
        location,
        gamePlayTime,
        maxPlayerCount,
      } as GameProps)
    }
    if (!this.editData._id) {
      this.form.reset({
        onlySelf: true
      })
    }
  }

  onSubmit() {
    this.newGame.emit(this.form.value as GameProps)
    this.form.reset({
      onlySelf: true
    })
  }

  cancelEditingFunction() {
    this.cancelEditing.emit()
  }
}
