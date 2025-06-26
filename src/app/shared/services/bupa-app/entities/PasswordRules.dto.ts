/**
* PasswordRules.ts
*
* @description: DTO PasswordRules
* @author RNHG
* @version 1.0
* @date 21-04-2022.
*
**/

/**
 * DTO PasswordRules
 */
export interface PasswordRulesDTO {
  maxLength: number;
  minLength: number;
  passwordExplanation: string;
  passwordRegex: string;
  specialCharacters: string;

}
