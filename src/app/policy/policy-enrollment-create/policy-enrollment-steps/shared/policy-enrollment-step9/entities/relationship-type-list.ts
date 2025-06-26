import { RelationshipType } from './relationship-type';

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  {id: 1, name: 'SELF', description: 'Mismo'},
  {id: 2, name: 'SPOUSE', description: 'Cónyugue'},
  {id: 3, name: 'CHILD', description: 'Hijo'},
  {id: 4, name: 'PARENT', description: 'Padre/Madre'},
  {id: 5, name: 'BROTHER_SISTER', description: 'Hermano'},
  {id: 6, name: 'NEPHEW_NIECE', description: 'Sobrino'},
  {id: 7, name: 'GRAND_PARENT', description: 'Abuelo'},
  {id: 8, name: 'GRAND_CHILD', description: 'Nieto'},
  {id: 9, name: 'IN_LAW', description: 'Cuñado'},
  {id: 10, name: 'GUARDIAN', description: 'Representante Legal'},
];
