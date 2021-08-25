import {Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameProps} from "../game.component";
import {MatTableDataSource} from "@angular/material/table";
import {LocationService} from "../../../../shared/service/location.service";
import {LocationProps} from "../../location/location.component";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
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
    // file: new FormControl(),
  });
  locationsData: LocationProps[] = []

  @Input()
  requiredFileType: string | undefined;

  fileName = '';
  file: any;
  constructor(private locationService: LocationService,
              private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getLocations()
  }
  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {

      this.fileName = file.name;

      // const formData = new FormData();

      // formData.append("uploads", file, 'file.name');
      this.file = file
    }
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
        // file,
      } = this.editData as GameProps
      // this.file = file;
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
    this.newGame.emit({
      ...this.form.value,
      file: this.file,
    } as GameProps)
    this.form.reset({
      onlySelf: true
    })
    this.file = null;
  }

  cancelEditingFunction() {
    this.cancelEditing.emit()
  }
}
