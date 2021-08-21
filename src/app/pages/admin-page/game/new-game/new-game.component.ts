import {Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameProps} from "../game.component";
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit, OnChanges {
  @Output() newGame = new EventEmitter();
  @Input() editing: boolean = false;
  @Output() cancelEditing = new EventEmitter();
  @Input() editData: GameProps = {
    gameCode: "",
    _id: "",
    description: 0,
    fullDescription: 0,
    gameType: "",
    name: "",
    point: 0};
  form = new FormGroup({
    _id: new FormControl(""),
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    gameType: new FormControl("standardGame", Validators.required),
    gameCode: new FormControl("", Validators.required),
    fullDescription: new FormControl("", Validators.required),
    point: new FormControl(0, Validators.required),
  });

  constructor() { }

  ngOnInit(): void {

  }
  ngOnChanges() {
    const {
      gameCode,
      _id,
      description,
      fullDescription,
      gameType,
      name,
      point
    } = this.editData
    this.form.setValue({
      gameCode,
      _id,
      description,
      fullDescription,
      gameType,
      name,
      point
    } as GameProps)
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
