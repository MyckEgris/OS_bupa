export enum PetitionerType {
    POLICY_HOLDER = 1,
    COMPANY = 2,
    INDIVIDUAL = 3
}

export namespace PetitionerType {
    export function getDescription(petitionerType: PetitionerType): string {
        if (petitionerType === PetitionerType.COMPANY) {
            return 'COMPANY';
        } else if (petitionerType === PetitionerType.POLICY_HOLDER) {
            return 'POLICY_HOLDER';
        } else if (petitionerType === PetitionerType.INDIVIDUAL) {
            return 'INDIVIDUAL';
        } else {
            return null;
        }
    }

}
