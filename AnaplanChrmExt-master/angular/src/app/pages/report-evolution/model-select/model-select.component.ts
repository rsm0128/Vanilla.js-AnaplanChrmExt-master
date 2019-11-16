import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelSnapshotFilter } from 'src/app/models/modelsnapshotfilter';
import { AnaWorkspace } from 'src/app/models/anaplanmodel';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';

@Component({
  selector: 'app-model-select',
  templateUrl: './model-select.component.html',
  styleUrls: ['./model-select.component.scss']
})
export class ModelSelectComponent implements OnInit {

  @Input() curWSInfoIdx: number;
  @Input() modelList: ModelSnapshotFilter[];
  @Input() snapshotId: string;
  @Input() modelId: string;
  @Input() title = '';
  @Output() calcDifference = new EventEmitter();

  constructor(private anaSvc: AnaplanLoadService) { }
  curVersionList = [];

  ngOnInit() { }


  modelChanged() {
    const curModel: ModelSnapshotFilter = this.modelList.find((model) => {
      return model.code === this.modelId;
    });
    if (curModel) {
      console.log('--------- modelChanged ---------');
      this.curVersionList = [];
      if (curModel.snapshots && curModel.snapshots.length > 0) {
        this.snapshotId = curModel.snapshots[curModel.snapshots.length - 1];
        curModel.snapshots.forEach((item, index) => {
          this.curVersionList.push({
            label: String(index + 1),
            id: String(item)
          });
        });
      }
      console.log(this.curVersionList);
      console.log(this.snapshotId);
      this.snapshotChanged();
    }
  }
  snapshotChanged() {
    // console.log('---------snapshotChanged------');
    console.log(this.anaSvc.curWorkspaceID + ' : ' + this.modelId + ':' + this.snapshotId);

    this.anaSvc.loadSpecificWorkspace(this.anaSvc.curWorkspaceID,
      this.modelId,
      this.snapshotId).then((res) => {
        this.calcDifference.emit({
          idx: this.curWSInfoIdx,
          data: res
        });
      });
  }
  getVersionList() {
    if (this.curVersionList && this.curVersionList.length > 0) {
      return this.curVersionList;
    }
    if (this.modelList && this.modelList.length > 0) {
      this.modelChanged();
    }

    return this.curVersionList;
  }

}
