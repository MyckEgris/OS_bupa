import { BankAccountType } from './bank-account-type';
import { Currency } from './currency';
import { Identification } from './Identification';

export interface FinanceDependencyDto {
    currencies: Array<Currency>;
    identificationTypes: Array<Identification>;
    bankAccountTypes: Array<BankAccountType>;
}
