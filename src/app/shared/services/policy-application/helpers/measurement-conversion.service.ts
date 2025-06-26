import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeasurementConversionService {

  // If the decision is to use the constant 0.45359237,
  // then (pounds = kg / 0.45359237) and (kgs = pounds * 0.45359237)
  // With the constant 2.2046 the process is
  // (kgs = pounds / 2.2046) and (pounds = kgs * 2.2046)
  private MEASURE_CONSTANT_CONVERSION_KG_POUND = 2.2046;
  constructor() { }

  convertPoundToKg(weight: number): number {
    return weight / this.MEASURE_CONSTANT_CONVERSION_KG_POUND;
  }

  convertKgToPound(weight: number): number {
    return weight * this.MEASURE_CONSTANT_CONVERSION_KG_POUND;
  }

  convertCMStoMTS(height: number): number {
    return height / 100;
  }

  convertMTSToCMS(height: number): number {
    return height * 100;
  }
}
