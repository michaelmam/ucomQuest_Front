import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocationProps} from "../location.component";

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.css']
})
export class NewLocationComponent implements OnInit {

  @Output() newGame = new EventEmitter();
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    startDescription: new FormControl("", Validators.required),
    location: new FormControl("", Validators.required),
    finishPoint: new FormControl("", Validators.required),
    finishTime: new FormControl("", Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.newGame.emit(this.form.value as LocationProps)
    this.form.reset({
      onlySelf: true
    })
  }
}
