import { BankAccountType } from "./bank-account-type";
import { Currency } from "./currency";
import { IdentificationType } from "./identification-type";

export interface PreconfigurationDto {
    currencies: Array<Currency>;
    identificationTypes: Array<IdentificationType>;
    bankAccountTypes: Array<BankAccountType>;
}
