
/**
* SearchBenefitsService.ts
*
* @description: Class subscribe search benefit component an show in modal window
* @author Jose Daniel Hernandez
* @version 1.0
* @date 18-09-19.
*
**/

import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { SearchBenefitsModalComponent } from './search-benefits-modal/search-benefits-modal.component';


/**
 * Class subscribe search benefit component an show in modal window
 */
@Injectable({
    providedIn: 'root'
})
export class SearchBenefitsService {

    public closeWindow;

    /**
     * Contruct Methos
     * @param _http HttpClient Injection
     * @param _config Configuration Service Injection
     * @param modalService Modal Service Injection
     * @param _authService Auth Service Injection
     */
    constructor(
        private _http: HttpClient,
        private _config: ConfigurationService,
        private modalService: NgbModal,
        private _authService: AuthService
    ) { }

    /**
     * Open a modal dialog showing a message
     * @param title Title to show in modal
     * @param acceptText Text in accept button
     */
    async showDialog(policyId: number, memberId: number, title?, acceptText?, closeWindow?: boolean) {

        const result = this.modalService.open(SearchBenefitsModalComponent,
            { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-claimsubmission-step3' });
        const dialog = result.componentInstance as SearchBenefitsModalComponent;

        dialog.title = title;
        dialog.acceptText = acceptText ? acceptText : 'APP.BUTTON.CONTINUE_BTN';
        dialog.policyId = policyId;
        dialog.memberId = memberId;
        if (this.closeWindow) {
            dialog.closeWindow = this.closeWindow;
        } else {
            dialog.closeWindow = closeWindow ? closeWindow : false;
        }
        return await result.result;
    }
}
