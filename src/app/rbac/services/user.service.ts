import { Injectable } from '@angular/core';
import { ReplaySubject} from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as userAuthorization from '../../../environments/workflow.json';
import { of } from 'rxjs/observable/of';

@Injectable()
export class UserService {

  constructor() {    
  }


  getUserProfile(): Observable<any> {
    return of(userAuthorization['userPermissions']);
  }

}
