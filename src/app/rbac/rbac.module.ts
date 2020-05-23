import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsService } from './services/permissions.service';
import { UserService } from './services/user.service';
import { CanAccessDirective } from './directives/can-access.directive';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [CanAccessDirective],
  providers:[PermissionsService,UserService],
  exports: [CanAccessDirective]
})
export class RbacModule { }
