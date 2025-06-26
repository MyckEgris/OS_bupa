export enum PetitionerConctactType {
    LEGAL_REPRESENTATIVE = 1,
    OFFICIAL = 2,
    SHAREHOLDER = 3
}

export namespace PetitionerType {
    export function getDescription(petitionerConctactType: PetitionerConctactType): string {
        if (petitionerConctactType === PetitionerConctactType.LEGAL_REPRESENTATIVE) {
            return 'LEGAL_REPRESENTATIVE';
        } else if (petitionerConctactType === PetitionerConctactType.OFFICIAL) {
            return 'OFFICIAL';
        } else if (petitionerConctactType === PetitionerConctactType.SHAREHOLDER) {
            return 'SHAREHOLDER';
        } else {
            return null;
        }
    }

}
