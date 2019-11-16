import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkspaceSettingDlgData } from 'src/app/models/workspacesetting';
import { FormControl, Validators } from '@angular/forms';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';

@Component({
  selector: 'app-setting-workspace-dlg',
  templateUrl: './setting-workspace.component.html',
  styles: [
    `.mat-form-field {
      width: 100%;
    }
    `
  ]
})
export class SettingWorkspaceDlgComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<SettingWorkspaceDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkspaceSettingDlgData,
    private anaService: AnaplanLoadService) { }

  workspaceid = new FormControl(this.data.workspaceId, [Validators.required]);
  modelid = new FormControl(this.data.modelId, [Validators.required]);
  snapshotid = new FormControl(this.data.snapshotId, [Validators.required]);
  wsInfos = [];
  public modelInfos = [];

  // email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.workspaceid.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.modelid.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.snapshotid.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.anaService.getWorkspaceList().then((res) => {
      this.wsInfos = res;
      console.log('===== getWorkspaceList =====');
      console.log(res);
      if (!res || !res.length || res.length === 0) {
        return;
      }
      this.selectedWorkspace();
    });
  }
  selectedWorkspace() {
    this.anaService.getModelVersionListByWorkspace(this.workspaceid.value).then((res) => {
      console.log('------ getModelVersionListByWorkspace ---------');
      console.log(res);
      this.modelInfos = res.map((model) => {
        return {
          name: model.name,
          code: model.code,
          snapshots: model.snapshots
        };
      });
      if (this.modelInfos && this.modelInfos.length > 0) {
        this.modelid.setValue(this.modelInfos[0].code);
        this.selectedModel();
      }
      console.log(this.modelInfos);

    });
  }
  selectedModel() {
    this.modelInfos.map((modelInfo) => {
      if (modelInfo.code === this.data.modelId) {
        this.snapshotid.setValue(modelInfo.child);
      }
    });
  }
  getEmptyArray(count) {
    return Array.from(Array(count).keys());
  }
  getModelCount(modelId) {
    if (!this.modelInfos || this.modelInfos.length === 0) {
      return 0;
      }
    const snapshots = this.modelInfos.find((model) => {
      return model.code === modelId;
    }).snapshots;

    if (!snapshots) {
    return 0;
    }
    return snapshots.length;
  }
}
