import { Injectable, OnInit } from '@angular/core';
import { AnaWorkspace, AnaList, AnaModule, AnaModelData } from '../models/anaplanmodel';
import { AnaplanLoadController } from './anaplanload.controller';
import { IdbService } from './idb.service';
import { WorkspaceSettingDlgData } from '../models/workspacesetting';
import { ListSearchResult, ListFreqLinePageFlt } from '../models/TableData';
import ANAPLAN_CONST from '../services/varconstant';
const logPrefix = 'jts:';

@Injectable({
  providedIn: 'root'
})
export class AnaplanLoadService extends AnaplanLoadController {

  constructor(private idbService: IdbService) {
    super();
  }

  public curWorkspaceID = localStorage.getItem(this.localWSIDName) || '';
  public curModelID = localStorage.getItem(this.localModelIDName) || '';
  public curSnapshotID = +localStorage.getItem(this.localSnapVerName) || -1;
  public curTimeRangeIdx = 0;
  public curWS: AnaWorkspace;


  getAutocompleteFunctionList() {
    return [
      'ABS(', 'ADDMONTHS(',
      'ADDYEARS(', 'AGENTS(',
      'AGENTSB(', 'AND(',
      'ALL(', 'ANY(',
      'ANSWERTIME(', 'ARRIVALRATE(',
      'AVGDURATION(', 'AVGWAIT(',
      'BLANK(', 'CODE(',
      'CODE(ITEM(', 'COLLECT(',
      'COMPARE(', 'COUPDAYS(',
      'COUPDAYSBS(', 'COUPDAYSNC(',
      'COUPNCD(', 'COUPNUM(',
      'COUPPCD(', 'CUMIPMT(',
      'CUMPRINC(', 'CUMULATE(',
      'CURRENTPERIODEND(', 'CURRENTPERIODSTART(',
      'CURRENTVERSION(', 'DATE(',
      'DAY(', 'DAYS(',
      'DAYSINMONTH(', 'DAYSINYEAR(',
      'DECUMULATE(', 'DIVIDE(',
      'DURATION(', 'END(',
      'ERLANGB(', 'ERLANGC(',
      'EXP(', 'FINDITEM(',
      'FIND(', 'FIRSTNONBLANK(',
      'FIRSTNONZERO(', 'FV(',
      'HALFYEARTODATE(', 'INPERIOD(',
      'IPMT(', 'IRR(',
      'ISACTUALVERSION(', 'ISANCESTOR(',
      'ISBLANK(', 'ISCURRENTVERSION(',
      'ISFIRSTOCCURRENCE(', 'ISNOTBLANK(',
      'ITEM(', 'LAG(',
      'LASTNONBLANK(', 'LEAD(',
      'LEFT(', 'LEN(',
      'LENGTH(', 'LN(',
      'LOOKUP(', 'LOG(',
      'LOWER(', 'MAILTO(',
      'MAKELINK(', 'MAX(',
      'MDURATION(', 'MID(',
      'MIN(', 'MOD(',
      'MONTH(', 'MONTHTODATE(',
      'MONTHVALUE(', 'MOVINGSUM(',
      'MROUND(', 'NAME(',
      'NEXT(', 'NEXTVERSION(',
      'NOT(', 'NPER(',
      'NPV(', 'OFFSET(',
      'OR(', 'PARENT(',
      'PARENT(ITEM(', 'PARENT(PARENT(',
      'PERIOD(', 'PMT(',
      'POST(', 'POWER(',
      'PPMT(', 'PREVIOUS(',
      'PREVIOUSVERSION(', 'PRICE(',
      'PROFILE(', 'PV(',
      'QUARTERTODATE(', 'QUARTERVALUE(',
      'RANK(', 'RANKCUMULATE(',
      'RATE(', 'RIGHT(',
      'ROUND(', 'SELECT(',
      'SIGN(', 'SLA(',
      'SPREAD(', 'SQRT(',
      'START(', 'SUM(',
      'SUBSTITUTE(', 'TEXT(',
      'TEXTLIST(', 'TIMESUM(',
      'TRIM(', 'UPPER(',
      'VALUE(', 'WEEKDAY(',
      'WEEKTODATE(', 'WEEKVALUE(',
      'YEAR(', 'YEARFRAC(',
      'YEARTODATE(', 'YEARVALUE(',
      'YIELD(',
    ];
  }

  private getLastLocalstorageItem() {
    const last = this.restoreWsInfoFromLocalStorage();
    if (last) {
      const res = JSON.parse(last);
      try {
        if (res.workspace && res.model && res.snapshot) {
          console.log(res);
          return {
            wsId: res.workspace,
            modelId: res.model,
            snapshotId: res.snapshot || -1
          };
        }
      } catch (error) {
      }
    }
    return null;

  }
  private async currentWSIDandModelID() {
    try {
      let res = await this.getLastLocalstorageItem();
      if (res) {
        this.curWorkspaceID = res.wsId;
        this.curModelID = res.modelId;
        this.curSnapshotID = res.snapshotId;
      } else {
        res = await this.idbService.getLastSchemaVersion();
        this.curWorkspaceID = res.wsId;
        this.curModelID = res.modelId;
        this.curSnapshotID = res.snapshotId;
        this.saveWSInfoToLocalStorage(this.curWorkspaceID, this.curModelID, this.curSnapshotID);
      }
      console.log(this.curWorkspaceID + ':' + this.curModelID);
    } catch (err) {
      console.log(err);
    }
  }

  public async loadCurrentWorkspace(wsid = this.curWorkspaceID, mdId = this.curModelID) {
    if (!wsid || !mdId) {
      await this.currentWSIDandModelID();
    }
    return await this.idbService.getWorkspaceFromKey(this.curModelID, this.curSnapshotID);
  }

  public async loadSpecificWorkspace(wsid, mdId, snapId) {
    if (!wsid || !mdId) {
      return;
    }
    const res = await this.idbService.getWorkspaceFromKey(mdId, snapId);
    this.curWS = res.workspace;
    return this.curWS;
  }

  public async getCurrentWS(): Promise<AnaWorkspace> {
    if (!this.curWS) {
      const res = await this.loadCurrentWorkspace();
      this.curWS = res.workspace;
    }
    return await this.curWS;
  }
  public async getSnaphistory(mdId = this.curModelID): Promise<any[]> {

    if (!mdId) {
      await this.currentWSIDandModelID();
    }
    const res = await this.idbService.getSnapshotHistory(this.curModelID);
    // this.removeWsInfoFromLocalStorage();
    return res;
  }
  public getCurTimeRangeIdx() {
    return this.curTimeRangeIdx;
  }

  public setCurTimeRangeIdx(index) {
    this.curTimeRangeIdx = index;
  }

  public changeWorkspaceData(wsdlgData: WorkspaceSettingDlgData) {
    if (this.curWorkspaceID === wsdlgData.workspaceId &&
      this.curModelID === wsdlgData.modelId &&
      this.curSnapshotID === +wsdlgData.snapshotId) {
      return;
    }
    this.curWS = null;
    this.saveWSInfoToLocalStorage(wsdlgData.workspaceId, this.curModelID = wsdlgData.modelId, wsdlgData.snapshotId);
    window.location.reload();
  }

  public async getModelVersionListByWorkspace(curWSID = this.curWorkspaceID) {

    if (!curWSID) {
      await this.currentWSIDandModelID();
      curWSID = this.curWorkspaceID;
    }
    console.log(curWSID);

    return await this.idbService.getAllModelVersion(curWSID);
  }

  public getNameFromListById(aList: AnaList, curId: number): ListSearchResult {
    if (curId >= 0) {
      const idx = aList.code.indexOf(curId);
      if (idx >= 0) {
        // console.log('jts' + id + ' ' + idx);
        const name = '' + curId;
        if (name.substr(0, 3) === '109') {
          for (const subset of aList.subsets) {
            if (subset.entityLongId === curId) {
              return {
                type: 'subset',
                name: '',
                id: subset.topLevelMainHierarchyEntityLongId
              };
            }
          }
        }
        return {
          type: 'list',
          name: aList.name[idx],
          id: curId
        };
      }
    }
    return {
      type: 'none',
      name: '',
      id: curId,
    };
  }
  public getLineItemsCount(ws: AnaWorkspace) {
    if (!ws) {
      return 0;
    }
    if (!ws.model) {
      return 0;
    }
    if (!ws.model.modelData) {
      return 0;
    }
    if (!ws.model.modelData.module) {
      return 0;
    }
    if (!ws.model.modelData.module.lineItems) {
      return 0;
    }
    if (!ws.model.modelData.module.lineItems.length) {
      return 0;
    }

    let count = 0;
    for (const item of ws.model.modelData.module.lineItems) {
      count += item.lineItemInfos.length;
    }
    return count;
  }

  public async getWorkspaceList() {
    return await this.idbService.getAllWorkspaceKeys();
  }
  getCaculateListFrequency(snapShot: AnaModelData): ListFreqLinePageFlt[] {
    const modules = snapShot.module;
    const lists = snapShot.list;
    const lineItems = modules.lineItems;
    const functions = {};
    for (const line of lineItems) {
      for (const lineInfo of line.lineItemInfos) {
        for (const lst of lineInfo.fullAppliesTo) {

          if (lst in functions) {
            functions[lst]++;
          } else {
            functions[lst] = 1;
          }
        }
      }
    }
    const res = {};
    const funcKeys = Object.keys(functions);
    for (const key of funcKeys) {
      const nameStr: ListSearchResult = this.getNameFromListById(lists, Number(key));
      if (nameStr.type === 'none') {
        continue;
      }
      if (key in res) {
        res[key].count += functions[nameStr.id];
      } else {
        res[key] = {
          count: functions[nameStr.id],
          name: nameStr.name
        };
      }
    }
    return Object.keys(res).map((key): ListFreqLinePageFlt => {
      return {
        name: res[key].name, key: +key, count: res[key].count
      };
    }).sort((a, b) => {
      return b.count - a.count;
    });

  }
}
