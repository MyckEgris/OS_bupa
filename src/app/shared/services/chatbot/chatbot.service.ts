import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { TranslationService } from '../translation/translation.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Rol } from '../../classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private SCRIPT_ID = 'Microsoft_Omnichannel_LCWidget';

  private ATTRIBUTE_ID = 'id';

  private ATTRIBUTE_SOURCE = 'src';

  private ATTRIBUTE_DATA_ORG_ID = 'data-org-id';

  private ATTRIBUTE_DATA_ORG_URL = 'data-org-url';

  private ATTRIBUTE_DATA_APP_ID = 'data-app-id';

  private ENGLISH = 'ENG';

  private SPANISH = 'SPA';

  private TAG_HEAD = 'head';

  private MEXICO_INSURANCE = '41';

  constructor(
    private config: ConfigurationService,
    private translation: TranslationService
  ) { }

  existsWidgetScript() {
    return document.getElementById(this.SCRIPT_ID);
  }

  removeScript() {
    if (this.existsWidgetScript()) {
      document.getElementById(this.SCRIPT_ID).remove();
    }
  }

  createChatbotScript() {
    const chatScript = document.createElement('script');
    chatScript.setAttribute(this.ATTRIBUTE_ID, this.SCRIPT_ID);
    chatScript.setAttribute(this.ATTRIBUTE_SOURCE, this.config.chatbotSource);
    chatScript.setAttribute(this.ATTRIBUTE_DATA_ORG_ID, this.config.chatbotDataOrgId);
    chatScript.setAttribute(this.ATTRIBUTE_DATA_ORG_URL, this.config.chatbotDataOrgUrl);

    switch (this.translation.getLanguage()) {
      case this.ENGLISH:
        chatScript.setAttribute(this.ATTRIBUTE_DATA_APP_ID, this.config.chatbotDataAppIdEng);
        break;
      case this.SPANISH:
        chatScript.setAttribute(this.ATTRIBUTE_DATA_APP_ID, this.config.chatbotDataAppIdSpa);
        break;
      default:
        chatScript.setAttribute(this.ATTRIBUTE_DATA_APP_ID, this.config.chatbotDataAppIdSpa);
        break;
    }

    document.getElementsByTagName(this.TAG_HEAD)[0].appendChild(chatScript);
  }

  /*loadChatBot() {
    const user = this.auth.getUser();
    if (user) {
      if (!user.is_anonymous && user.bupa_insurance !== this.MEXICO_INSURANCE && this.supportRoles(user)) {
        this.createChatbotScript();
      }
    }
  }*/

  supportRoles(user: UserInformationModel) {
    const supportedRoles = [Rol.AGENT, Rol.AGENT_ASSISTANT, Rol.POLICY_HOLDER, Rol.GROUP_POLICY_HOLDER, Rol.GROUP_ADMIN];
    return supportedRoles.indexOf(+user.role_id) !== -1;
  }

}
