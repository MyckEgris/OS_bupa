import { ClaimUpdateDto } from './claim-update.dto';
import { FormGroup } from '@angular/forms';
import { FileDocument } from '../../common/entities/fileDocument';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ClaimUpdateModel } from './claim-update.model';

export interface ClaimUpdateWizard {

    /**
    * documents: FileDocument[]
    */
    documents: FileDocument[];

    /**
     * folderName
     */
    folderName: string;

    /**
     * claimGuid
     */
    claimGuid: string;

    /**
     * statusGuid
     */
    statusGuid: string;


    claimUpdateModel: ClaimUpdateModel;

}
