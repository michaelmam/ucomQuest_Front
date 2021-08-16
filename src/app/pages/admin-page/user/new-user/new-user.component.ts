import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocationProps} from "../../location/location.component";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Output() newUser = new EventEmitter();
  form = new FormGroup({
    code: new FormControl("", Validators.required),
    role: new FormControl("player", Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.newUser.emit(this.form.value as LocationProps)
    this.form.controls.code.reset()
  }
}
