import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { NetworksByProductKeyDto } from 'src/app/shared/services/network/entities/networksByProductKey.dto';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NetworkService } from 'src/app/shared/services/network/network.service';
import { TranslateService } from '@ngx-translate/core';
import { ExcludedNetworksResponseDto } from 'src/app/shared/services/network/entities/excludedNetworkResponse.dto';
import { NetworkDto } from 'src/app/shared/services/network/entities/network.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-add-networks-modal',
  templateUrl: './add-networks-modal.component.html'
})
export class AddNetworksModalComponent implements OnInit, OnDestroy {

  /**
   * Input ProductKey
   */
  @Input() inputProductKey: string;

  /**
   * Input AddedNetworks
   */
  @Input() inputAddedNetworks: NetworksByProductKeyDto[];

  /**
   * Output seletedNetworks
   */
  @Output() selectedNetworks = new EventEmitter<NetworksByProductKeyDto[]>();

  /**
   * productkey
   */
  private productkey: string;

  /**
   * AddedNetworks
   */
  private AddedNetworks: NetworksByProductKeyDto[];

  /**
   * Object for networks response NetworkResponse
   */
  public networksResponse: any;

  /**
   * Collection size for pagination component
   */
  public collectionSize: number;

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 5;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * List selected networks
   */
  public listSelectedNetworks: NetworkDto[];

  /**
   * List selected converted networks
   */
  public listSelectedConvertedNetworks: NetworksByProductKeyDto[];

  /**
   * Subscription Networks
   */
  private subNetworks: Subscription;

  /**
   * flag for input info
   */
  public inputInfo = true;

  /**
   * Constants for the add networks modal message.
   */
  private ADD_NETWORK_MSG_TITLE = 'NETWORK.ADD_NETWORKS.TITLE_MSG';
  private ADD_NETWORK_MSG_OK_BTN = 'APP.BUTTON.CONTINUE_BTN';

  private EXIST_CHECKED_NETWOKR_MSG = 'NETWORK.ADD_NETWORKS.ADD_EXIST_NETWORK_MSG';



  /**
   * constructor method
   * @param translate Translate Service Injection
   * @param networkService Network Service Injection
   * @param activeModal Active Modal Injection
   * @param notification Notification Service Injection
   */
  constructor(
    public activeModal: NgbActiveModal,
    private networkService: NetworkService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.initiallizeVariables();
    this.getInputInformation();
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subNetworks) { this.subNetworks.unsubscribe(); }
  }

  /**
   * Validates and gets the input info
   */
  getInputInformation() {
    if (this.inputProductKey) {
      this.productkey = this.inputProductKey;
      this.AddedNetworks = this.inputAddedNetworks;
      this.inputInfo = true;
      this.page = this.INIT_PAGE;
      this.searchNetworksByProductKey(this.page);
    } else { this.inputInfo = false; }
  }

  /**
   * Initiallize component variables
   */
  initiallizeVariables() {
    this.networksResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
    this.listSelectedNetworks = [];
    this.listSelectedConvertedNetworks = [];
    this.collectionSize = 0;
    this.page = this.INIT_PAGE;
  }

  /***
   * Emit event when accept the list networks selected
   */
  acceptNetworksSelected() {
    this.convertedSelectedExcludedNetworks(this.listSelectedNetworks);
    this.selectedNetworks.emit(this.listSelectedConvertedNetworks);
    this.activeModal.close();
  }

  /**
   * Search not associated networks filtering by product key.
   */
  searchNetworksByProductKey(page: number) {
    if (this.inputInfo) {
      this.networksResponse = null;
      this.listSelectedNetworks = [];
      this.searchProccess = false;
      this.subNetworks = this.networkService.getNotAssociatedNetworksByProductKey(
        this.productkey, String(true), String(page), String(this.PAGE_SIZE)).subscribe(
          data => {
            this.networksResponse = data;
            this.searchProccess = true;
            this.collectionSize = data.count;
          },
          error => {
            this.networksResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
            this.collectionSize = 0;
            this.handleError(error);
          }
        );
    }
  }

  /***
   * Handle error
   */
  private handleError(error: any) {
    if (error.status === 404) {
      this.searchProccess = true;
      this.networksResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
    } else {
      this.searchProccess = false;
    }
  }

  /**
   * Updates pagination
   */
  changePageOfExcludedNetworks(page: number) {
    if (!page) { return; }
    this.page = page;
    this.searchNetworksByProductKey(this.page);
  }

  /**
   * Store selected excluded networks
   */
  seletedNetwork(network: any, event) {
    if (event.target.checked) {
      const indexAddedNet = this.AddedNetworks.findIndex(e => e.networkKey === network.networkKey);
      if (indexAddedNet === -1) {
        this.listSelectedNetworks.push(network);
      } else {
        event.target.checked = false;
        this.showMessage(this.EXIST_CHECKED_NETWOKR_MSG);
      }

    } else {
      const indexNetw = this.listSelectedNetworks.findIndex(e => e.networkKey === network.networkKey);
      this.listSelectedNetworks.splice(indexNetw, 1);
    }
  }

  /**
   * Store selected converted excluded networks
   */
  convertedSelectedExcludedNetworks(selectedNetworks: NetworkDto[]) {
    if (selectedNetworks) {
      selectedNetworks.forEach(element => {
        const convertedNetwork: NetworksByProductKeyDto = {
          productNetworkKey: this.productkey,
          networkKey: element.networkKey,
          network: {
            networkKey: element.networkKey,
            networkId: element.networkId,
            networkName: element.networkName,
            networkDescription: element.networkDescription,
            fromDate: element.fromDate,
            toDate: element.toDate,
            parentNetworkKey: element.parentNetworkKey
          },
          productkey: this.inputProductKey,
          deductibleAmount: null,
          coinsurancePercent: null,
          fromDate: null,
          toDate: null,
        };
        this.listSelectedConvertedNetworks.push(convertedNetwork);
      });
    }
  }

  /***
   * Show message.
   * @param msgPath Message Path.
   * @param titlePath Title Path.
   * @param okBtnPath Ok Button Path.
   */
  showMessage(msgPath: string, titlePath?: string, okBtnPath?: string) {
    let message = '';
    let messageTitle = '';
    let okBtn = null;
    this.translate.get(msgPath).subscribe(
      result => message = result
    );
    this.translate.get(titlePath ? titlePath : this.ADD_NETWORK_MSG_TITLE).subscribe(
      result => messageTitle = result
    );
    this.translate.get(okBtnPath ? okBtnPath : this.ADD_NETWORK_MSG_OK_BTN).subscribe(
      result => okBtn = result
    );
    this.notification.showDialog(messageTitle, message, false, okBtn);
  }

}
