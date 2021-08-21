import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { UserService } from 'src/app/shared/service/user.service';
import {LocationProps} from "../../location/location.component";
import { UserProps } from '../user.component';
import {LocationService} from "../../../../shared/service/location.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, OnChanges {
  userPlayingLocations: LocationProps[] = [];
  @Input() editUserData: UserProps = {} as UserProps
  @Input() editing: boolean = false;
  @Output() newUser = new EventEmitter();
  @Output() cancelEditing = new EventEmitter();
  admins: UserProps[] = [];
  locations: LocationProps[] = []
  locationsData: LocationProps[] = []
  form = new FormGroup({
    code: new FormControl("", Validators.required),
    verificationCode: new FormControl("", Validators.required),
    role: new FormControl("player", Validators.required),
    admin: new FormControl(),
  });

  constructor(private userService: UserService,
              private locationService: LocationService,) { }

  ngOnChanges() {
    if (this.editUserData._id) {
      const {
        code,
        verificationCode,
        role,
        adminId,
        playingLocationSteps
      } = this.editUserData
      this.userPlayingLocations = this.locationsData.filter(({_id}) => playingLocationSteps.includes(_id))
      this.locations = this.locationsData.filter(({_id}) => !playingLocationSteps.includes(_id))
      const admin = this.admins.filter(({_id}) => _id === adminId)[0] || {}
      this.form.setValue({code,
        verificationCode,
        role,
        admin,
      })
    }
  }

  ngOnInit(): void {
    this.userService.getAdminUsers().subscribe(data => {
      if (data) {
        this.admins = data
      }
    })
    this.locationService.getLocations().subscribe((data: LocationProps[]) => {
      if (data) {
        this.locations = data;
        this.locationsData = data;
      }
    })
  }
  drop(event: CdkDragDrop<LocationProps[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  onSubmit() {
    const playingLocationSteps = this.userPlayingLocations.map(({_id}) => _id)
    const playingLocationStepsNames = this.userPlayingLocations.map(({name}) => name)
    this.newUser.emit({
      ...this.form.value,
      playingLocationStepsNames,
      playingLocationSteps,
      playingLocationId: playingLocationSteps[0] || null})
    this.form.controls.code.reset()
    this.form.controls.verificationCode.reset()
  }

  cancelEditingFunction() {
    this.form.controls.code.reset()
    this.form.controls.verificationCode.reset()
    this.cancelEditing.emit()
  }
}
