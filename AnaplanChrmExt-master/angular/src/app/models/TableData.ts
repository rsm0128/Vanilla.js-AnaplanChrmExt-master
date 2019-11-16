import { ModelSnapshotFilter } from './modelsnapshotfilter';
import { AnaWorkspace } from './anaplanmodel';

export declare interface TableData {
  showHeaderIdx: number[];
  headerRow: string[];
  dataRows: string[][];
}
export interface ModuelPageFilter {
  name: string;
  appliesTo: string[];
  timeRange: string;
  periodType: string;
  version: string;
  lineitems: string[];
}

export interface ListPageFilter {
  idx: number;
  name: string;
  parent: string;
  numbered: boolean;
  items: number;
  properties: number;
  subset: number;
}


export interface FunctionFreqLinePageFlt {
  name: string;
  count: number;
}

export interface ListFreqLinePageFlt {
  key: number;
  name: string;
  count: number;
}




export interface SnapshotModel {
  modelList: ModelSnapshotFilter[];
  modelId1: string;
  snapshotId1: string;
  modelId2: string;
  snapshotId2: string;
  wsInfo1: AnaWorkspace;
  wsInfo2: AnaWorkspace;
}


export interface ItemDataLinePageFlt {
  label: string;
  module: string;
  format: string;
  formula: string;
  appliesTo: any[];
  time: string;
  version: string;
}


export interface ModuleDifferenceModel {
  applies: number;
  timeGranularity: number;
  moduleNameChanes: number;
}

export interface LineItemDifferenceModel {
  formula: number;
  applies: number;
  liname: number;
}

export interface VersionDifferenceModel {
  append: number;
  renamed: number;
  deteled: number;
}


export interface ListSearchResult {
  type: 'subset' | 'list' | 'none';
  name: string;
  id: number;
}
