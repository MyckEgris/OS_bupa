import { PolicyChangesDto } from '../entities/policy-changes.dto';

/***
 * Helper created to perform generic functions in the process of consulting policy changes
 */
export class PolicyChangesHelper {

    /****
     * Get policy changes by language
     */
    public static getPolicyChangesTraslate(data: PolicyChangesDto[], lang: number) {
        const lstReturn: PolicyChangesDto[] = [];
        data.forEach(
            (policyChanges: PolicyChangesDto) => {
                policyChanges.description =
                            policyChanges.descriptionByLanguage.filter(x => x.languageId === lang)[0].processOptionDescription;
                policyChanges.messageLanguage =
                            (policyChanges.message.filter(m => m.languageId === lang)[0]) !== undefined ?
                            (policyChanges.message.filter(m => m.languageId === lang)[0]).message : null;

                if (policyChanges.documents.length > 0) {
                    if (policyChanges.documents.filter(d => d.documentLanguage === lang).length > 0) {
                        policyChanges.documentsLanguage = policyChanges.documents.filter(d => d.documentLanguage === lang);
                    }
                }
                lstReturn.push(policyChanges);
            }
        );
        return lstReturn;
    }

}
