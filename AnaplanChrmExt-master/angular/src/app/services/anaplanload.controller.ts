import {
  AnaList,
  AnaModule,
  AnaImport,
  AnaUser,
  AnaWorkspace,
  AnaModel,
  AnaModelData,
  AnaVersion,
  AnaTimeInfo,
  AnaTimescales,
  AnaTimePeriod,
  AnaLineItemSubset,
  AnaDashboard,
  AnaView,
  AnaFunctionalAreas
} from '../models/anaplanmodel';
import ANAPLAN_CONST from './varconstant';



const logPrefix = 'jts:';
export class AnaplanLoadController {

  public readonly localWSIDName = 'anawsid';
  public readonly localModelIDName = 'anamodelid';
  public readonly localSnapVerName = 'anasnapver';

  public checkUserRole(anaRoot): boolean {
    try {
      const userinfo = anaRoot.data.ModelContentCache._userInfo || anaRoot.common.SelectiveAccess._userInfo._userInfo || null;
      console.log(userinfo);
      if (!userinfo.loggedInUserCurrentModelRole
        || userinfo.loggedInUserCurrentModelRole !== 'FULL_ACCESS'
        || !userinfo.loggedInUserWorkspaceRole
        || userinfo.loggedInUserWorkspaceRole !== 'ADMIN') {
        return false;
      }
    } catch (error) {
      throw new Error(' user info exception - ' + error);
    }
    return true;
  }
  private loadWorkspace(anaData): AnaWorkspace {
    let anaWorkspace: AnaWorkspace = null;
    try {
      if (!anaData) {
        throw new Error('anaplan data load error');
      }
      if (!anaData.ModelContentCache) {
        throw new Error('anaplan ModelContentCache load error');
      }
      if (!anaData.ModelContentCache._workspaceInfo) {
        throw new Error('anaplan ModelContentCache._workspaceInfo load error');
      }
      const workspace = anaData.ModelContentCache._workspaceInfo;
      anaWorkspace = {
        name: workspace.workspaceName,
        code: workspace.workspaceId,
        workspaceSizeAllowance: anaData.ModelContentCache._workspaceInfo.workspaceSizeAllowance,
        currentWorkspaceSize: anaData.ModelContentCache._workspaceInfo.currentWorkspaceSize,
        modelIds: anaData.ModelContentCache._workspaceInfo.modelIds,
        modelNames: anaData.ModelContentCache._workspaceInfo.modelNames,
        modelSummaries: anaData.ModelContentCache._workspaceInfo.modelSummaries,
        model: null,
        snapshotVersion: 0,
        snapshoId: 0,
      };

    } catch (error) {
      throw new Error(error);
    }
    return anaWorkspace;
  }

  private loadUserInformation(anaRoot): AnaUser {
    let anaUser: AnaUser = new AnaUser();
    try {
      const user = anaRoot.data.ModelContentCache._userInfo || anaRoot.common.SelectiveAccess._userInfo._userInfo || null;
      anaUser = {
        firstName: user.loggedInUserFirstName,
        lastName: user.loggedInUserLastName,
        email: user.loggedInUserEmailAddress,
        modelRole: user.loggedInUserCurrentModelRole,
        wsRole: user.loggedInUserWorkspaceRole,
      };
    } catch (error) {
      throw new Error(error);
    }
    return anaUser;
  }

  private getCurrentMillisecond() {
    return new Date().getTime();
  }

  private loadModelInformation(modelContentCache, nxtWsInfo: AnaWorkspace, nxtUserInfo, selectedModelId): AnaModel {
    let model: AnaModel;
    try {
      const prvWsInfo = modelContentCache._workspaceInfo;
      const prvMDInfo = modelContentCache._modelInfo;
      const modelNames = prvWsInfo.modelNames;
      const modelIds = prvWsInfo.modelIds;
      if (modelNames.length !== modelIds.length) {
        throw new Error('mismatching data');
      }
      const idx = modelIds.indexOf(selectedModelId);
      if (idx >= 0) {
        // anaplan.data.ModelContentCache._modelInfo.memory
        model = {
          name: modelNames[idx],
          code: modelIds[idx],
          ws: nxtWsInfo.code,
          user: nxtUserInfo,
          modelData: null,
          modelsize: prvMDInfo.memory,
          cellCount: prvMDInfo.cellCount,
          modelVersion: prvMDInfo.versionsLabelPage.count
        };
      } else {
        throw new Error('model is no found');
      }
    } catch (error) {
      throw new Error(error);
    }
    nxtWsInfo.model = model;
    return model;
  }


  private attachedVersionToSnapshot(prvMDInfo, nxtModel: AnaModel): AnaModelData {
    let snapshot: AnaModelData = nxtModel.modelData;
    if (!snapshot) {
      snapshot = new AnaModelData();
      nxtModel.modelData = snapshot;
    }
    console.log('jtsTest');
    console.log(prvMDInfo.versionsLabelPage.entityLongIds[0]);
    console.log(prvMDInfo.versionsLabelPage.labels[0]);

    const version: AnaVersion = {
      code: prvMDInfo.versionsLabelPage.entityLongIds[0],
      name: prvMDInfo.versionsLabelPage.labels[0],

      savedtime: '' + this.getCurrentMillisecond(),
      snapshotVersion: '1.0',
      snapshotName: 0
    };
    snapshot.version = version;
    return snapshot;
  }

  private getPropertiesByListId(modelCache, id) {
    try {
      return {
        parent: modelCache._customHierarchiesLabelPage.parentEntityLongIds[0][id],
        name: modelCache._customHierarchiesLabelPage.labels[0][id],
        code: modelCache._customHierarchiesLabelPage.entityLongIds[0][id],
        // format: modelCache.getHierarchyInfo(id).propertiesInfo[0].format,
        // formula: modelCache.getHierarchyInfo(id).propertiesInfo[0].formula,
        // formulaScope: modelCache.getHierarchyInfo(id).propertiesInfo[0].formulaScope,
      };
    } catch (err) {
      throw new Error('In getPropertiesByListId : ' + err);
      return {};
    }
  }

  private loadListsAddToSnapshot(anaData, modelData: AnaModelData) {
    const aLists: AnaList = new AnaList();
    try {
      console.log(anaData);
      const modelCache = anaData.ModelContentCache;
      aLists.name = modelCache._customHierarchiesLabelPage.labels[0];
      const entityLongIds = modelCache._customHierarchiesLabelPage.entityLongIds[0];
      aLists.code = entityLongIds;
      aLists.count = entityLongIds.length;
      aLists.hierachies = modelCache._modelInfo.hierarchiesInfo.hierarchyInfos;
      aLists.subsets = modelCache._modelInfo.hierarchySubsetsInfo.hierarchySubsetInfos;
      aLists.properties = entityLongIds.map((id) => {
        return this.getPropertiesByListId(modelCache, id);
      });

    } catch (error) {
      throw new Error(error);
    }
    modelData.list = aLists;
  }

  private loadModuleInfosFromById(modelCache, id, idx, amodule: AnaModule) {

    const moduleTimes = amodule.time;
    const modulesLineItems = amodule.lineItems;
    let fullAppliesTo = [];
    let mTime: AnaTimeInfo = new AnaTimeInfo();
    let mLineItem = {};
    try {
      mTime = new AnaTimeInfo();
      console.log('################');
      mLineItem = {
        name: modelCache._modelInfo.modulesLabelPage.labels[0][idx],
        code: id,
        lineItemsLabelPage: modelCache._modelInfo.moduleInfos[idx].lineItemsLabelPage,
        // format: modelCache._modelInfo.moduleInfos[idx].format,
        lineItemInfos: modelCache._modelInfo.moduleInfos[idx].lineItemInfos,
        appliesTo: modelCache._modelInfo.moduleInfos[idx].appliesTo,
        periodType: modelCache._modelInfo.moduleInfos[idx].leafPeriodType.entityLabel,
        fullAppliesTo: modelCache._modelInfo.moduleInfos[idx].fullAppliesTo,
        version: modelCache._modelInfo.moduleInfos[idx].versionSelection.entityLabel,
        timeRangeLabel: modelCache._modelInfo.moduleInfos[idx].timeRangeLabel,
        functionalArea: modelCache._modelInfo.moduleInfos[idx].functionalAreaEntityLongId
      };
    } catch (err) {
      mTime = new AnaTimeInfo();
      fullAppliesTo = [];
      throw new Error('loadModuleInfosFromById :' + err);
    }
    amodule.fullAppliesTo = fullAppliesTo;
    moduleTimes.push(mTime);
    modulesLineItems.push(mLineItem);

  }

  private getTimesInfoFromModelInfo(modelInfos) {

    const atimes: AnaTimeInfo = new AnaTimeInfo();

    if (modelInfos && modelInfos.timeScaleInfo) {

      console.log('jts getTimesInfoFromModelInfo:');
      if (modelInfos.timeScaleInfo.allowedTimeEntityPeriodTypes) {
        atimes.timePeriod = modelInfos.timeScaleInfo.allowedTimeEntityPeriodTypes.map((period) => {
          const aPeriod: AnaTimePeriod = {
            entityGuid: '' + period.entityGuid,
            entityId: '' + period.entityId,
            entityIndex: + period.entityIndex,
            entityLabel: '' + period.entityLabel,
          };
          return aPeriod;
        });
      }

      if (modelInfos.timeScaleInfo.allowedTimeEntityPeriodTypeLabelPages) {
        atimes.timescales = modelInfos.timeScaleInfo.allowedTimeEntityPeriodTypeLabelPages.map((scales) => {
          const ascale: AnaTimescales = {
            labels: [],
            entityIds: []
          };
          ascale.labels = scales.labels[0];
          ascale.entityIds = scales.entityIds[0];
          return ascale;
        });
        // console.log(atimes.timePeriod);
        if (modelInfos.timeRangesInfo && modelInfos.timeRangesInfo.timeRangeInfos) {
          atimes.timeRangeCount = modelInfos.timeRangesInfo.timeRangeInfos.length;
        }
      }
    }
    return atimes;
  }
  private loadTimesAddToSnapshot(modelInfos, snapshot: AnaModelData) {
    snapshot.time = this.getTimesInfoFromModelInfo(modelInfos);
  }

  private loadLineItemSubsetsToSnapshot(modelInfo, snapshot: AnaModelData) {
    let alineItemsubSet = new AnaLineItemSubset();
    try {
      alineItemsubSet.name = modelInfo.lineItemSubsetsInfo.lineItemSubsetsLabelPage.entityLongIds[0];
      alineItemsubSet.code = modelInfo.lineItemSubsetsInfo.lineItemSubsetsLabelPage.labels[0];
      alineItemsubSet.module = modelInfo.lineItemSubsetsInfo.lineItemSubsetInfos.map((item) => item.applicableModuleEntityLongIds);
    } catch (error) {
      alineItemsubSet = null;
      throw new Error(error);
    }
    snapshot.lineItemSubset = alineItemsubSet;
  }
  private loadFunctionAreasToSnapshot(modelInfo, snapshot: AnaModelData) {
    let aFunctionalArea = new AnaFunctionalAreas();
    try {
      aFunctionalArea.name = modelInfo.functionalAreasLabelPage.entityLongIds[0];
      aFunctionalArea.code = modelInfo.functionalAreasLabelPage.labels[0];
    } catch (error) {
      aFunctionalArea = null;
      throw new Error(error);
    }
    snapshot.functionalArea = aFunctionalArea;
  }

  private loadViewsToSnapshot(modelInfo, snapshot: AnaModelData) {
    let aViews = new AnaView();
    try {
      aViews.name = modelInfo.viewsInfo.viewsLabelPage.entityLongIds[0];
      aViews.code = modelInfo.viewsInfo.viewsLabelPage.labels[0];
      aViews.module = modelInfo.viewsInfo.moduleEntityLongIds;
    } catch (error) {
      aViews = null;
      throw new Error(error);
    }
    snapshot.views = aViews;
  }

  private loadDashboardToSnapshot(modelInfo, snapshot: AnaModelData) {
    let dashboard = new AnaDashboard();
    try {
      dashboard.code = modelInfo.dashboardsInfo.dashboardsLabelPage.entityLongIds[0];
      dashboard.name = modelInfo.dashboardsInfo.dashboardsLabelPage.labels[0];
      dashboard.functionalArea = modelInfo.dashboardsInfo.dashboardInfos.map((item) => item.functionalAreaEntityLongId);
      dashboard.definition = modelInfo.dashboardsInfo.dashboardInfos.map((item) => item.dashboardDefinitionJsonString);
    } catch (error) {
      dashboard = null;
      throw new Error(error);
    }
    snapshot.dashboard = dashboard;
  }

  private loadModulesAddToSnapshot(anaData, snapshot: AnaModelData) {
    let amodule: AnaModule = new AnaModule();
    try {
      const modelCache = anaData.ModelContentCache;
      console.log(anaData);
      const modelInfo = anaData.ModelContentCache._modelInfo;
      const labels = modelInfo.modulesLabelPage.labels[0];
      const entityLongIds = modelInfo.modulesLabelPage.entityLongIds[0];
      amodule.fullAppliesTo = [];
      amodule.name = labels;
      amodule.code = entityLongIds;
      amodule.time = [];

      amodule.version = [];
      amodule.lineItems = [];
      amodule.cellCount = 0;
      entityLongIds.map((id: any, index: number) =>
        this.loadModuleInfosFromById(modelCache, id, index, amodule));
    } catch (error) {
      throw new Error(error);
      amodule = null;
    }
    snapshot.module = amodule;
  }


  private loadImportInfosById(importDefinitions, index, importTypes, importSources, importTargets, importMappinges) {
    let imType = '';
    let imSource = '';
    let imTarget = '';
    let imMappinge = '';
    try {
      imType = importDefinitions[index].importType;
      imSource = importDefinitions[index].source;
      imTarget = importDefinitions[index].target;
      imMappinge = importDefinitions[index].mappinge;
    } catch (err) {
      throw new Error('loadImportInfosById :' + err);
    }
    importTypes.push(imType);
    importSources.push(imSource);
    importTargets.push(imTarget);
    importMappinges.push(imMappinge);
  }

  private loadImportsAddToSnapshot(anaData, snapshot: AnaModelData) {
    const aimport: AnaImport = new AnaImport();
    try {
      console.log(anaData);
      const modelInfo = anaData.ModelContentCache._modelInfo;

      const labels = modelInfo.importsInfo.importsLabelPage.labels[0];
      const entityLongIds = modelInfo.importsInfo.importsLabelPage.entityLongIds[0];
      aimport.name = labels;
      aimport.code = entityLongIds;
      aimport.importType = [];
      aimport.source = [];
      aimport.target = [];
      aimport.mappinges = [];
      // const importDefinitions = anaData.Aggregator._observers._importDefinitions || '';
      // entityLongIds.map((id) =>
      //   this.loadImportInfosById(importDefinitions, id, aimport.importType, aimport.source, aimport.target, aimport.mappinges));
    } catch (error) {
      console.log(error);
      throw new Error('jts: loadImportsAddToSnapshot');
    }
    snapshot.import = aimport;
  }

  private loadDatasourcesAddToSnapshot(anaData, snapshot: AnaModelData) {
    let datasources = {};
    try {
      // datasources = anaData.Aggregator._observers._dataSources;
      datasources = 'anaData.Aggregator._observers._dataSources';
    } catch (error) {
      throw new Error('loadImportsAddToSnapshot' + error);
    }
    snapshot.datasource = datasources;
  }

  public loadFromAnaplan(anaRoot, workspaceId, selectedModelId) {
    const anaData = anaRoot.data;
    return new Promise((resolve, reject) => {
      if (!this.checkUserRole(anaRoot)) {
        throw new Error('access denined or data load error');
      }

      try {

        // load workspace
        const nxtWsInfo = this.loadWorkspace(anaData);

        // load userInfo
        const nxtUserInfo = this.loadUserInformation(anaRoot);

        // load models
        const modelContentCache = anaData.ModelContentCache;
        const prvWsInfo = modelContentCache._workspaceInfo;
        const prvMDInfo = modelContentCache._modelInfo;
        const nxtModel = this.loadModelInformation(modelContentCache, nxtWsInfo, nxtUserInfo, selectedModelId);

        // load version to add snapshot
        const snapshot = this.attachedVersionToSnapshot(prvMDInfo, nxtModel);

        // load Times to snapshot
        this.loadTimesAddToSnapshot(prvMDInfo, snapshot);

        // load lists to add snapshot
        this.loadListsAddToSnapshot(anaData, snapshot);

        // load Module to add snapshot
        this.loadModulesAddToSnapshot(anaData, snapshot);

        // load lineItemSubset to add snapshot
        this.loadLineItemSubsetsToSnapshot(prvMDInfo, snapshot);

        // load Views to add snapshot
        this.loadViewsToSnapshot(prvMDInfo, snapshot);

        // load functionAreas to add snapshot
        this.loadFunctionAreasToSnapshot(prvMDInfo, snapshot);

        // load dashbard to add snapshot
        this.loadDashboardToSnapshot(prvMDInfo, snapshot);

        // load Import to add snapshot
        this.loadImportsAddToSnapshot(anaData, snapshot);

        // load Datasources to add snapshot
        this.loadDatasourcesAddToSnapshot(anaData, snapshot);


        resolve(nxtWsInfo);
      } catch (err) {
        reject(err);
      }

    });
  }

  public saveWSInfoToLocalStorage(ws, md, ver) {
    localStorage.setItem(ANAPLAN_CONST.ANPLAN_LAST_V_MARK, JSON.stringify({
      workspace: ws,
      model: md,
      snapshot: ver
    }));
  }

  public restoreWsInfoFromLocalStorage() {
    return localStorage.getItem(ANAPLAN_CONST.ANPLAN_LAST_V_MARK);
  }

  public removeWsInfoFromLocalStorage() {
    try {
      if (localStorage.getItem(ANAPLAN_CONST.ANPLAN_LAST_V_MARK)) {
        localStorage.removeItem(ANAPLAN_CONST.ANPLAN_LAST_V_MARK);
      }
    } catch (ex) { }
  }

}

