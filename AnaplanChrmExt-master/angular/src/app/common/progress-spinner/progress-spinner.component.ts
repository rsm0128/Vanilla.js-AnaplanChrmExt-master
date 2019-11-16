import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  template: `
    <mat-spinner diameter="100"></mat-spinner>
  `,
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
