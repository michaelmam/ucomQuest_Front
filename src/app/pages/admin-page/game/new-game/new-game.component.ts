import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameProps} from "../game.component";
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  @Output() newGame = new EventEmitter();
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    fullDescription: new FormControl("", Validators.required),
    point: new FormControl(0, Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.newGame.emit(this.form.value as GameProps)
    this.form.reset({
      onlySelf: true
    })
  }
}
