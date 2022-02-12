import {Component, EventEmitter, OnInit, Output} from '@angular/core';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  @Output()
  changeFile: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
  tiles: Tile[] = [
    {text: 'one', cols: 6, rows: 1, color: 'lightblue'},
    {text: 'One', cols: 3, rows: 1, color: 'lightpink'},
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'One', cols: 3, rows: 1, color: 'lightpink'},
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'One', cols: 3, rows: 1, color: 'lightpink'},
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
  ];
  ngOnInit(): void {
  }

   changeEvent(num: number): void {
    this.changeFile.emit(num);

  }
}
