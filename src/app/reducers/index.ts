/**
* index.ts
*
* @description: Index for reducers
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { ActionReducerMap } from '@ngrx/store';
import { UserInformationReducer } from '../security/reducers/user-information.reducer';
import { MenuReducer } from '../security/reducers/menu.reducer';
import { PolicyInformationReducer } from '../security/reducers/policy-information.reducer';
import { MyPortfolioReducer } from '../security/reducers/my-portfolio.reducer';
import { QuotePolicyReducer } from '../security/reducers/quote-policy.reducer';
import { PolicyDtoReducer } from '../security/reducers/policy-dto.reducer';

/**
 * Const for application reducers
 */
export const reducers: ActionReducerMap<any> = {
  menu: MenuReducer.menuReducer,
  userInformation: UserInformationReducer.userInformationReducer,
  policyInformation: PolicyInformationReducer.policyInformationReducer,
  myPortfolio: MyPortfolioReducer.myPortfolioReducer,
  quotePolicy: QuotePolicyReducer.quotePolicyReducer,
  policyDto: PolicyDtoReducer.policyDtoReducer
};
