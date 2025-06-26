/**
* Control.ts
*
* @description: Belong to View template with the configuration of control (enable, visible or required). Basically the Validators
* @author Enrique Durango
* @version 1.0
* @date 18-10-2019.
*
**/
export class Control {
    key: string;
    visible: boolean;
    enable: boolean;
    validators: Array<ValidatorsReponse>;
}

export class ValidatorsReponse {
    key: string;
    value: object;
    keyMessage: string;
}
