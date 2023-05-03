export interface Client {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  lists_created?: Array<any>;
  lists_favourite?: Array<any>;
  ratings?: Array<any>;
}