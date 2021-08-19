import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { UserService } from 'src/app/shared/service/user.service';
import {LocationProps} from "../../location/location.component";
import { UserProps } from '../user.component';
import {LocationService} from "../../../../shared/service/location.service";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Output() newUser = new EventEmitter();
  admins: UserProps[] = [];
  locations: LocationProps[] = []
  form = new FormGroup({
    code: new FormControl("", Validators.required),
    verificationCode: new FormControl("", Validators.required),
    role: new FormControl("player", Validators.required),
    admin: new FormControl(),
    playingLocationId: new FormControl(),
  });

  constructor(private userService: UserService,
              private locationService: LocationService,) { }

  ngOnInit(): void {
    this.userService.getAdminUsers().subscribe(data => {
      if (data) {
        this.admins = data
      }
    })
    this.locationService.getLocations().subscribe(data => {
      if (data) {
        this.locations = data
      }
    })
  }

  onSubmit() {
    this.newUser.emit(this.form.value)
    this.form.controls.code.reset()
  }
}
