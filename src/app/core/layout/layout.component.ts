/**
* LayoutComponent.ts
*
* @description: This class is the container of all components.
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit, TemplateRef } from '@angular/core';
import { CacheService } from '../../shared/services/cache/cache.service';
import { StorageKind } from '../../shared/services/cache/cache.index';
import { AgreementService } from '../../main/services/agreement/agreement.service';
import { Utilities } from '../../shared/util/utilities';
import { IdleUserService } from '../../shared/services/idle-user/idle-user.service';
import { RequestLoadingService } from '../../shared/services/request-loading/request-loading.service';
import { MenuOptionService } from 'src/app/security/services/menu-option/menu-option.service';
import { PrehomeService } from 'src/app/main/pre-home/prehome.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { RoleService } from 'src/app/shared/services/roles/role.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
/**
 * This class is the container of all components.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [NgbActiveModal]
})
export class LayoutComponent implements OnInit {

  @ViewChild('noticesModal') noticesModal : TemplateRef<any>;
  /**
   * Storage
   */
  private storage: any;

  /**
   * Language got from JWT
   */
  public lang: string;

  /**
   * Sub. Email address got from JWT
   */
  public sub: string;

  /**
   * User name got from JWT
   */
  public name: string;

  /**
   * Role got from JWT
   */
  public role: string;

  /**
   * Array of roles got from JWT
   */
  public roles: Array<string> = [];

  /**
   * Agreements files content
   */
  public htmlContent: string;

  /**
   * Date Now
   */
  public dateNow: any;

  /**
   * Loading flag
   */
  public loading: boolean;

  private INSURANCE_MEXICO = '41';
  modal: NgbModalRef;

  /**
   * Constructor Method
   * @param _cacheService Cache Service Injection
   * @param _agreementService Agreement Service Injection
   * @param idleService Idle User Service Injection
   * @param requestLoading Request Loading Service Injection
   */
  constructor(
    private _cacheService: CacheService,
    private _agreementService: AgreementService,
    private idleService: IdleUserService,
    private requestLoading: RequestLoadingService,
    private menuOptions: MenuOptionService,
    private _prehomeService: PrehomeService,
    private auth: AuthService,
    private modalService: NgbModal
  ) {
    this.storage = this._cacheService.storage(StorageKind.InSessionStorage);
    this.dateNow = Utilities.getDateNow();
  }

  /**
   * On Init event. Manage loading requests and start agreements service
   */
  async ngOnInit() {
    try {
      this.requestLoading.subscribe(p => this.loading = p);
      if (!this._agreementService.isAgreement) {
        this._agreementService.startAgreements().then(prehome => {
          this.loadPrehome(prehome);
        });
      }
      this.idleService.startTimer();
    } catch (error) {
    }
  }

  loadPrehome(prehome) {
    debugger;
    if (prehome && this.checkMenuState()) {
      this._prehomeService.showModal();
      return;
    }

    if ((this.auth.getUser().bupa_insurance === this.INSURANCE_MEXICO || this.auth.getUser().role_id === Rol.PROVIDER.toString())&& this.checkMenuState()) {
      if (this.checkIfExistsStoragePrehome()) {
        this.modal = this.modalService.open(this.noticesModal);
      }
    }
  }

  checkMenuState() {
    return (this.menuOptions.state.preHomeLinks && this.menuOptions.state.preHomeLinks.length > 0);
  }

  checkIfExistsStoragePrehome() {
    return (sessionStorage.getItem('loadPrehome') === null || sessionStorage.getItem('loadPrehome') !== 'false');
  }

  closeModalNotices() {
    this.modal.close();
    this._prehomeService.showModal();
  }

}
