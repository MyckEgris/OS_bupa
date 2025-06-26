/**
* ShowPasswordDirective.ts
*
* @description: Custom directive add class to invalid field
* @author Juan Camilo Moreno
* @version 1.0
* @date 29-10-2018.
*
**/
import { Directive, Input, OnInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { Observable, Subscription, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[appValidateField]'
})
export class ValidateFieldDirective implements OnInit, OnDestroy {
    @Input() invalidmessage: string;
    control: AbstractControl;
    hasView = false;
    controlValue$: Observable<any>;
    controlSubscription: Subscription;
    hasSubmitted: boolean;
    constructor(
        private _fg: ControlContainer,
        private _el: ElementRef,
        private render: Renderer2
    ) { }

    ngOnInit() {
        this.control = this.form.get(this.invalidmessage);
        const formSubmit$ = (<FormGroupDirective>this._fg).ngSubmit.pipe(map(() => {
            this.hasSubmitted = true;
        }));
        this.controlValue$ = merge(this.control.valueChanges, of(''), formSubmit$);
        // this.controlValue$ = this.control.valueChanges;
        this.controlSubscription = this.controlValue$.subscribe(() => {
            this.setVisible();
        });
    }

    private setVisible() {
        if (this.control.invalid && (this.control.dirty || this.hasSubmitted)) {
            // this.render.removeStyle(this._el.nativeElement, 'display');
            this.render.addClass(this._el.nativeElement, 'red-border');
        // } else {
            // this.render.setStyle(this._el.nativeElement, 'display', 'none');
        }
    }

    match(error: string) {
        if (this.control && this.control.errors) {
            if (Object.keys(this.control.errors).indexOf(error) > -1) {
                return true;
            }
        }
        return false;
    }

    get form() { return this._fg.formDirective ? (this._fg.formDirective as FormGroupDirective).form : null; }

    ngOnDestroy() {
        this.controlSubscription.unsubscribe();
    }
}
