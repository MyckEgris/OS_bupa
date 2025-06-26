import { MethodPayment } from './method-payment';

export const METHOD_OF_PAYMENTS: MethodPayment[] = [
    {id: 1, name: 'Tarjeta de crédito', englishName: 'Credit Card', isVisible: false},
    {id: 2, name: 'Cheque de caja', englishName: 'ElectronicCheck', isVisible: false},
    {id: 3, name: 'Cheque personal', englishName: 'Check', isVisible: false},
    {id: 5, name: 'Depósito en efectivo en sucursal bancaria', englishName: 'Cash', isVisible: false},
    {id: 6, name: 'Transferencia bancaria', englishName: 'Wire Transfer', isVisible: false}
  ];
