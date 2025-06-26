export class MedicalMember {
  private _applicationMemberGuid: string;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _genreId: number;
  constructor(applicationMemberGuid: string,
    firstName: string,
    middleName: string,
    lastName: string,
    genreId: number) {
      this._applicationMemberGuid = applicationMemberGuid;
      this._firstName = firstName;
      this._middleName = middleName;
      this._lastName = lastName;
      this._genreId = genreId;
    }

    public get fullName() {
      return `${this._firstName} ${this._middleName} ${this._lastName}`;
    }

    public get applicationMemberGuid() {
      return this._applicationMemberGuid;
    }

    public get genreId() {
      return this._genreId;
    }
}
