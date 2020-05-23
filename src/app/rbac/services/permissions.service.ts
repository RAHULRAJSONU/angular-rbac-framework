import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PermissionsService {
  private readonly WORKFLOW_EVENTS = Object.freeze(environment['workflow']);
  private userPermission: any[];

  constructor(private userService: UserService, private http: HttpClient) {
    this.test();
  }

  public checkAuthorization(path: any): Observable<boolean> {
    if (!this.userPermission) {
      return this.userService.getUserProfile()
        .do(perm => this.userPermission = perm)
        .map(() => this.doCheckAuthorization(path));
    }
    return Observable.of(this.doCheckAuthorization(path));
  }

  private doCheckAuthorization(path: any): boolean {
    const keys = this.parsePath(path);
    if (keys.length) {
      return this.evaluatePermission(this.userPermission,keys[0],keys[1])
    }
    return false;
  }

  private parsePath(path: any): string[] {
    if (typeof path === 'string') {
      return path.split('.');
    }
    if (Array.isArray(path)) {
      return path;
    }
    return [];
  }

  toLowerCase = function (s) {
    return String(s).toLowerCase();
  }

  evaluatePermission = (userProfile, key, str) => {
    var isExist = false;
    if (Array.isArray(userProfile)) {
      for (let profile of userProfile) {
        var resourceList = profile.permissions !== undefined ? profile.permissions : false;
        if (resourceList) {
          var resource = resourceList[key]
          if (Array.isArray(resource) && resource.map(this.toLowerCase).indexOf(str.toLowerCase()) > -1) {
            isExist = true;
            break;
          }
        }
      }
    }
    return isExist;
  };

  test(){
    this.http.get('https://api.com/',{observe: 'response'}).subscribe(res=>console.log('httpClient resp__',res.body))
  }

}
