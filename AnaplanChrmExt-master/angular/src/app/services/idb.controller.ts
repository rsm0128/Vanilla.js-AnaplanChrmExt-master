import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AnaWorkspace } from '../models/anaplanmodel';
const ANADBName = 'anaplandb';
const ANASTORENAME = 'anastore';

interface AnaDB extends DBSchema {
  anastore: {
    key: string,
    value: {
      workspaceid: string,
      modelid: string,
      snapshotid: string,
      workspace: AnaWorkspace
    },
    indexes: {
      workspaceid: string,
      modelid: string,
      snapshotid: string
    }
  };
}

export class IdbController {


  private myDB: IDBPDatabase<AnaDB>;
  constructor() {
    this.opendb();
  }

  public async opendb(dbname: string = ANADBName) {
    if (this.myDB) {
      return;
    }
    this.myDB = await openDB<AnaDB>(dbname, 1, {
      upgrade(db) {
        const workspace = db.createObjectStore(ANASTORENAME, {
          keyPath: 'id',
          autoIncrement: true
        });
        workspace.createIndex('snapshotid', 'snapshotid', { unique: true });
        workspace.createIndex('workspaceid', 'workspaceid', { unique: false });
        workspace.createIndex('modelid', 'modelid', { unique: false });
      }
    });
  }

  private async getObjectStore(mode: IDBTransactionMode, storeName: any = ANASTORENAME) {
    console.log('--- getObjectStore ---------');
    try {
      await this.opendb();
      return this.myDB.transaction(storeName, mode).objectStore(storeName);
    } catch (error) {
      throw new Error('getObjectStore Error');
    }
  }
  private getCurrentUTCTimeStamp() {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  }
  private consoleLog(rlt: any, type: 'info' | 'error' = 'info') {
    console.log('----Ana DB Info---');
    console.log(rlt);
    if (type === 'error') {
      // throw new Error('AnaDBError');
    }
  }

  private async get(key) {
    console.log('--- get ---------', key);
    try {
      console.log(key);
      await this.opendb();
      return await this.myDB.get(ANASTORENAME, key);
    } catch (err) {
      // this.consoleLog(err);
      throw err;
    }
  }

  private async delete(key: any) {
    console.log('--- delete ---------');
    try {
      await this.opendb();
      return await this.myDB.delete(ANASTORENAME, key);
    } catch (err) {
      console.log(err);
      throw new Error('can\'t delete key name');
    }
  }

  private async clear() {
    console.log('--- clear ---------');
    try {
      await this.opendb();
      return await this.myDB.clear(ANASTORENAME);
    } catch (err) {
      console.log(err);
      throw new Error('can\'t delete key name');
    }
  }

  private async saveData(wsData: AnaWorkspace) {
    console.log('--- saveData ---------');
    const mdKeys = await this.getAllKeysIdx(wsData.model.code, 'modelid');


    const wsid = wsData.code;
    const mdid = wsData.model.code;
    const snid = this.getCurrentUTCTimeStamp();
    wsData.snapshoId = snid;
    wsData.snapshotVersion = mdKeys.length + 1;

    const store = await this.getObjectStore('readwrite');
    try {
      console.log('--------- MyDB Key: -------');
      return await store.put({
        workspaceid: wsid,
        modelid: mdid,
        snapshotid: snid,
        workspace: wsData
      });
    } catch (err) {
      console.log(err);
      throw new Error('can\'t put key name');
    }
  }
  ////// ===================== application ================= ////////////////
  private async getAllKeysIdx(query: string, type: 'modelid' | 'workspaceid') {
    console.log('--- getAllKeysIdx ---------');
    console.log(query);
    await this.opendb();
    return await this.myDB.getAllKeysFromIndex(ANASTORENAME, type, IDBKeyRange.only(query));
  }

  private async getsnapshotIdFromModelAndIndex(modelID: string, idx: number = -1) {
    console.log('--- getsnapshotIdFromModelAndIndex ---------');
    console.log(modelID);
    const keys = await this.getAllKeysIdx(modelID, 'modelid');
    if (idx < 0 || idx >= keys.length) {
      return keys[keys.length - 1];
    }
    return keys[idx];
  }
  public async getLastSchemaVersion() {
    try {
      await this.opendb();
      const keys = await this.myDB.getAllKeys(ANASTORENAME);
      console.log('----------keys-----');
      console.log(keys);
      const lastSnapshot = await this.get(keys[keys.length - 1]);

      return {
        wsId: lastSnapshot.workspaceid,
        modelId: lastSnapshot.modelid,
        snapshotId: lastSnapshot.snapshotid,
      };
    } catch (err) {
      this.consoleLog(err, 'error');
    }
  }
  //// =================== application ================
  public async  getWorkspaceFromKey(curModelID: string, cursnapshotIdx: number = -1) {
    console.log(' -------- getWorkspaceFromKey ---- key');
    console.log(curModelID);
    const key = await this.getsnapshotIdFromModelAndIndex(curModelID, cursnapshotIdx);
    return await this.get(key);

  }
  public async  getSnapshotHistory(curmodelid: string) {
    const keys = await this.getAllKeysIdx(curmodelid, 'modelid');
    return await Promise.all(keys.map((async (key) => {
      const ws = await this.myDB.get(ANASTORENAME, key);
      return {
        time: +ws.workspace.model.modelData.version.savedtime,
        ws: {
          size: ws.workspace.currentWorkspaceSize,
        },
        model: {
          size: ws.workspace.model.modelsize
        }
      };
    })));
  }
  public async  getAllModelVersion(curWSID: string) {
    console.log('------ getAllModelVersion -------');
    console.log(curWSID);
    const keys = await this.getAllKeysIdx(curWSID, 'workspaceid');
    const rlt = {};
    await Promise.all((keys).map(async (key) => {
      const curObj = await this.get(key);
      if (!rlt[curObj.workspace.model.code]) {
        rlt[curObj.workspace.model.code] = {
          name: curObj.workspace.model.name,
          code: curObj.workspace.model.code,
          snapshots: [],
        };
      }
      rlt[curObj.workspace.model.code].snapshots.push(curObj.snapshotid);
    }));
    console.log(rlt);
    return Object.keys(rlt).map((key) => {
      return rlt[key];
    });

  }
  public async getAllWorkspaceKeys() {
    const store = await this.getObjectStore('readonly');
    const wsIdxs = store.index('workspaceid');
    let cursor = await wsIdxs.openCursor(null, 'nextunique');
    const keys = [];
    while (cursor) {
      keys.push(cursor.primaryKey);
      cursor = await cursor.continue();
    }
    const res = await Promise.all(keys.map(async (key) => {
      const data = await this.get(key);
      return {
        code: data.workspace.code,
        name: data.workspace.name
      };
    }));
    return res;
  }

  public async saveWorkspaceData(wsData: AnaWorkspace) {
    const key = await this.saveData(wsData);
    const rlt = await this.get(key);
    console.log('-----------getWorkspaceFromKey ----key-- ');
    console.log(wsData);
    console.log(rlt.workspace);
    return rlt.workspace;
  }
  public async checkEmptyRepo() {
    await this.opendb();
    const keys = await this.myDB.getAllKeys(ANASTORENAME);
    return keys.length > 0;

  }
}
