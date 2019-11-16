import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';
import { IdbController } from './idb.controller';


@Injectable({
  providedIn: 'root'
})
export class IdbService extends IdbController {

  constructor() {
    super();
  }
}
