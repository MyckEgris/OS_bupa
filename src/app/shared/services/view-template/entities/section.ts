import { Control } from './control';

/**
* Section.ts
*
* @description: Belong to View template with the configuration of control (enable, visible or required). Basically the Validators
* @author Enrique Durango
* @version 1.0
* @date 18-10-2019.
*
**/
export class Section {
    id: number;
    name: string;
    nextStep: string;
    previousStep: string;
    currentStep: string;
    controls: Array<Control>;
}
