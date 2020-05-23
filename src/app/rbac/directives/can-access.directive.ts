import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, EmbeddedViewRef, ɵstringify as stringify, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[appCanAccess]'
})
export class CanAccessDirective implements OnInit, OnDestroy {

  private _context: CanAccessDirectiveContext = new CanAccessDirectiveContext();
  private _elseViewRef: EmbeddedViewRef<CanAccessDirectiveContext> | null = null;
  private _elseTemplateRef: TemplateRef<CanAccessDirectiveContext> | null = null;
  private _thenTemplateRef: TemplateRef<CanAccessDirectiveContext> | null = null;
  private _thenViewRef: EmbeddedViewRef<CanAccessDirectiveContext> | null = null;

  @Input()
  set appCanAccess(value: string | string[]) {
    this._context.$implicit = this._context.appCanAccess = value;
    // this.applyPermission(value);
    this.applyPermission(this._context.$implicit);
  }

  @Input()
  set appCanAccessThen(templateRef: TemplateRef<CanAccessDirectiveContext> | null) {
    assertTemplate('ngIfThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null;  // clear previous view if any.
    // this._updateView();
    this.applyPermission(this._context.$implicit);
  }

  @Input()
  set appCanAccessElse(templateRef: TemplateRef<CanAccessDirectiveContext> | null) {
    assertTemplate('ngIfElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null;  // clear previous view if any.
    // this._updateView();
    this.applyPermission(this._context.$implicit);
  }

  private permission$: Subscription;

  constructor(private templateRef: TemplateRef<CanAccessDirectiveContext>,
              private _viewContainer: ViewContainerRef,
              private workflowEvents: PermissionsService,
              private _el: ElementRef,
              private _renderer: Renderer2) {
    this._thenTemplateRef = templateRef;
  }

  ngOnInit(): void {
  }

  private applyPermission(value: string | string[]): void {
    this.permission$ = this.workflowEvents.checkAuthorization(value)
      .subscribe(authorized => {
        if (authorized) {
          if (!this._thenViewRef) {
            this._viewContainer.clear();
            this._elseViewRef = null;
            if (this._thenTemplateRef) {
              this._thenViewRef =
                this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
            }
          }
        } else {
          if(Array.isArray(value) && value.length > 2){
            let view = this._viewContainer.createEmbeddedView(this._thenTemplateRef);
            let rootElem = view.rootNodes[0];
            console.log('root::-> ',rootElem);
            if(rootElem) {
              this._renderer.setProperty(rootElem, value[2], true);
            }
          }else if (!this._elseViewRef) {
            this._viewContainer.clear();
            this._thenViewRef = null;
            if (this._elseTemplateRef) {
              this._elseViewRef =
                this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
            }
          }
        }
      });
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef =
            this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef =
            this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.permission$.unsubscribe();
  }

}

export class CanAccessDirectiveContext {
  public $implicit: any = null;
  public appCanAccess: any = null;
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}
