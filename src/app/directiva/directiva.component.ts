import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styles: [
  ]
})
export class DirectivaComponent implements OnInit {

  listaCurso: string[] = ['Typescript', 'JavaScript'];

  constructor() { }

  ngOnInit(): void {
  }

}
