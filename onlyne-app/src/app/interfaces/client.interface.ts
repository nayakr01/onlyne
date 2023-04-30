export interface Client {
  id: string;
  name: string;
  email: string;
  lists_created?: Array<any>;
  lists_favourite?: Array<any>;
  ratings?: Array<any>;
}