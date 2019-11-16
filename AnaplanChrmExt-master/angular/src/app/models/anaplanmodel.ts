export class AnaList {
  name: any[];
  code: any[];
  count: number;
  properties: any[];
  hierachies: any[];
  subsets: any[];

  constructor() {
    this.name = [];
    this.code = [];
    this.count = 0;
    this.properties = [];
    this.hierachies = [];
    this.subsets = [];
  }
}
export class AnaLineItemSubset {
  name: string[];
  code: any[];
  module: any[];

  constructor() {
    this.name = [];
    this.code = [];
    this.module = [];
  }
}

export class AnaFunctionalAreas {
  name: string[];
  code: any[];

  constructor() {
    this.name = [];
    this.code = [];
  }
}
export class AnaView {
  name: string[];
  code: any[];
  module: any[];

  constructor() {
    this.name = [];
    this.code = [];
    this.module = [];
  }
}

export class AnaDashboard {
  code: string[];
  name: string[];
  functionalArea: any[];
  definition: any[];

  constructor() {
    this.name = [];
    this.code = [];
    this.functionalArea = [];
    this.definition = [];
  }
}
export class AnaModule {
  name: string;
  code: any[];
  fullAppliesTo: any[];
  time: AnaTimeInfo[];
  version: any[];
  lineItems: any[];
  cellCount: number;

  constructor() {
    this.name = '';
    this.code = [];
    this.time = [];
    this.version = [];
    this.lineItems = [];
    this.fullAppliesTo = [];
  }
}

export class AnaImport {
  name: string;
  code: string;
  importType: any[];
  source: any[];
  target: any[];
  mappinges: any[];
  constructor() {
    this.name = '';
    this.code = '';
    this.importType = [];
    this.source = [];
    this.target = [];
    this.mappinges = [];
  }
}


export class AnaUser {
  firstName: string;
  lastName: string;
  email: string;
  modelRole: string;
  wsRole: string;
}
export class AnaVersion {
  name: string[];
  code: any[];

  savedtime: string;
  snapshotName: number;
  snapshotVersion: string;
}

export class AnaTimePeriod {
  entityGuid: string;
  entityId: string;
  entityIndex: number;
  entityLabel: string;
}
export class AnaTimescales {
  labels: string[];
  entityIds: string[];
}
export class AnaTimeInfo {
  timescales: AnaTimescales[];
  timePeriod: AnaTimePeriod[];
  timeRangeCount = 2;
}

// class AnaDatasource {
//   name: string;
// }

export class AnaModelData {
  version: AnaVersion;
  time: AnaTimeInfo;
  list: AnaList;
  module: AnaModule;
  lineItemSubset: AnaLineItemSubset;
  dashboard: AnaDashboard;
  import: AnaImport;
  datasource: any;
  views: AnaView;
  functionalArea: AnaFunctionalAreas;
}

export class AnaBaseModel {
  public name: string;
  public code: string;
  public ws: string;
  public user: AnaUser;
  public modelsize = 0;
  public cellCount = 0;
  public modelVersion: number;


}
export class AnaModel extends AnaBaseModel {
  modelData: AnaModelData;
}
// export class AnaModelSchema extends AnaBaseModel {
//   snapshotCount = 1;
// }


export class AnaBaseWorkspace {
  public name: string;
  public code: string;
  public workspaceSizeAllowance = 1000;
  public currentWorkspaceSize = 0;
  public modelIds: string[];
  public modelNames: string[];
  public modelSummaries: string[];
  public snapshotVersion: number;
  public snapshoId: number;
}
// export class AnaWorkspace extends AnaBaseWorkspace {
//   model: AnaModelSchema;
//   constructor(name: string = '', code: string = '', model: AnaModelSchema = null) {
//     super();
//     this.name = name;
//     this.code = code;
//     this.model = model;
//   }

// }

export class AnaWorkspace extends AnaBaseWorkspace {
  model: AnaModel;
  constructor(nn: string = '', cc: string = '', mm: AnaModel = null) {
    super();
    this.name = nn;
    this.code = cc;
    this.model = mm;
  }
}


