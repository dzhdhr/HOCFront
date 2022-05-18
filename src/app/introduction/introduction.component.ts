import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as $ from 'src/assets/lib/jquery';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['../../assets/nicepage.css', './introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  @Output()
  changePage: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
  ngOnInit(): void {
  }

   changeEvent(num: number): void {
    // console.log("change");
    this.changePage.emit(num);

  }
}
