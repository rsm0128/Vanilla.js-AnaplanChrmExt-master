import { Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'filter-cell',
  template: `
        <div class="container">
          <input #input (ngModelChange)="onChange($event)" [ngModel]="text" class="form-control">
        </div>
    `, styles: [
    `
      .container {
        /*
        border: 2px solid #22ff22;
        background-color: #bbffbb;
        height: 50px;
        */
        border-radius: 5px;
        width: 200px;
        padding: 0;
      }

      input {
        height: 20px
      }
      `
  ]
})
export class LineItemCatPartialMatchFilter implements IFilterAngularComp {
  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  public text = '';

  @ViewChild('input', { static: true }) input;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return this.text !== null && this.text !== undefined && this.text !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.text.toLowerCase()
      .split(' ')
      .every((filterWord) => {
        return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
  }

  getModel(): any {
    return { value: this.text };
  }

  setModel(model: any): void {
    this.text = model ? model.value : '';
  }

  ngAfterViewInit(params: IAfterGuiAttachedParams): void {
    window.setTimeout(() => {
      this.input.nativeElement.focus();
    });
  }

  formatSearchFilter(format: string): void {
    this.onChange(format);
  }

  onChange(newValue): void {
    if (this.text !== newValue) {
      this.text = newValue;
      this.params.filterChangedCallback();
    }
  }
}
