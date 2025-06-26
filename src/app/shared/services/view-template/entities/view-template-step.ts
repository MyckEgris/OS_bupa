import { Section } from './section';

/**
* ViewTemplateStep.ts
*
* @description: Belong to View template with the configuration of control (enable, visible or required). Basically the Validators
* @author Enrique Durango
* @version 1.0
* @date 18-10-2019.
*
**/
export class ViewTemplateStep {
    type: string;
    stepNumber: number;
    multisection: boolean;
    stepVariationNumber: number;
    sections: Array<Section>;
}
