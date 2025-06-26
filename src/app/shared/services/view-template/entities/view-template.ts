import { Language } from '../../common/entities/language';
import { ViewTemplateStep } from './view-template-step';
/**
* ViewTemplate.ts
*
* @description: View template with the configuration of control (enable, visible or required). Basically the Validators
* @author Enrique Durango
* @version 1.0
* @date 18-10-2019.
*
**/
export class ViewTemplate {
    viewTemplateId: number;
    viewTemplateName: string;
    viewTemplateLanguagesSupport: Language[];
    processOptionId: number;
    insuranceBusinessId: number;
    viewTemplateVersion: string;
    countSteps: number;
    steps: Array<ViewTemplateStep>;
}
