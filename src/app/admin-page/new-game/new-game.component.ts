import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  a = [1,2,3]
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    fullDescription: new FormControl("", Validators.required),
    point: new FormControl("", Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
    console.log(this.form);
    for (const [key, value] of Object.entries(this.form.controls)) {
      console.log(`${key}: ${value}`);
    }

  }

  onSubmit() {
    console.log("reactive form submitted");
    console.log(this.form);
  }
}
