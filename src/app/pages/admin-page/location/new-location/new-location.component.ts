import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocationProps} from "../location.component";

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.css']
})
export class NewLocationComponent implements OnInit, OnChanges {
  @Input() editing = false;
  @Input() editData = {} as LocationProps;
  @Output() newLocation = new EventEmitter();
  @Output() cancelEditing = new EventEmitter();
  form = new FormGroup({
    _id: new FormControl(""),
    name: new FormControl("", Validators.required),
    startDescription: new FormControl("", Validators.required),
    location: new FormControl("", Validators.required),
    finishPoint: new FormControl("", Validators.required),
    finishTime: new FormControl("", Validators.required),
  });

  constructor() { }

  ngOnChanges() {
    if (this.editing) {
      const {
        _id,
        name,
        startDescription,
        location,
        finishPoint,
        finishTime,
      } = this.editData;
      this.form.setValue({
        _id,
        name,
        startDescription,
        location,
        finishPoint,
        finishTime,
      })
    }

  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.newLocation.emit(this.form.value as LocationProps)
    this.form.reset({
      onlySelf: true
    })
  }

  cancelEditingFunction() {
    this.cancelEditing.emit()
    this.form.reset()
  }
}
