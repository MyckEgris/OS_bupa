import { PolicyApplicationModel } from '../../../../shared/services/policy-application/entities/policy-application-model';
import { FormGroup } from '@angular/forms';
import { ViewTemplate } from 'src/app/shared/services/view-template/entities/view-template';
import { MaritalStatus } from 'src/app/shared/services/common/entities/marital-status';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { SourceOffunding } from 'src/app/shared/services/common/entities/source-offunding';
import { Observable } from 'rxjs';
import { City } from 'src/app/shared/services/common/entities/city';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
import { Genders } from 'src/app/shared/services/common/entities/genders';
import { Colony } from 'src/app/shared/services/common/entities/colony.dto';
import { Locality } from 'src/app/shared/services/common/entities/locality';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { Industry } from 'src/app/shared/services/common/entities/industry';
import { Rule } from 'src/app/shared/services/policy-application/entities/rule';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { RuleByBusiness } from 'src/app/shared/services/common/entities/rule-by-business';
import { AgreementDefinition } from 'src/app/shared/services/common/entities/agreement-def-enrollment-response';


export interface PolicyEnrollmentWizard {
    currentStep: number;
    currentSection: number;
    user: UserInformationModel;
    agent: Agent;
    policyApplicationModel: PolicyApplicationModel;
    viewTemplate: ViewTemplate;
    enrollmentForm: FormGroup;
    languageId: number;
    language: string;

    /***
     * Information on different addresses (home / mail) holder
     */
    diffAddressHomeMail: boolean;
    listMaritalStatus$: Observable<MaritalStatus[]>;
    countries$: Observable<Country[]>;
    genders$: Observable<Genders[]>;
    relationCustomer: Array<any>;
    sourceOfFunding$: Observable<SourceOffunding[]>;
    cities$: Observable<City[]>;
    areaCodes$: Observable<AreaCodes[]>;
    coloniesHome$: Observable<Colony[]>;
    coloniesPostal$: Observable<Colony[]>;
    localityHome$: Observable<Locality[]>;
    localityPostal$: Observable<Locality[]>;
    municipality$: Observable<MunicipalityDto[]>;
    industries$: Observable<Industry[]>;
    policyApplicationGuid: string;
    ownerMemberGuid: string;
    phoneGuid: string;
    addressGuid: string;
    addressPostalGuid: string;
    emailGuid: string;
    emailOnlineGuid: string;
    statusGuid: string;

    isCurrentSectionValid: boolean;
    isHomeVisible: boolean;
    applicationIdentificationRUPGuid: string;
    applicationIdentificationCURPGuid: string;
    applicationIdentificationSNGuid: string;
    applicationIdentificationDepGuid: string;

    beneficiaryGuid: string;
    contactGuid: string;
    beneficiaryPhoneNumberGuid: string;
    beneficiaryCellPhoneNumberGuid: string;
    dependentNumberAndExtensionGuid: string;
    applicationGuids: string[];
    beneficiaryAddressGuid: string;
    otherInsuranceGuid: string;
    documentsFolderName: string;
    rulesSelected: Array<RuleByBusiness>;
    applicationIdentificationDocGuid: string;
    phone1001Guid: string;
    emailOtherGuid: string;
    otherAddressGuid: string;
    beneficiaryIdentificationGuid: string;
    agreementDefintion$: Observable<AgreementDefinition[]>;
    beneficiaryEmailGuid: string;
}
