import { Client } from "./client.interface";

export interface List {
  _id: string;
  title: string;
  description: string;
  listPhoto?: string;
  author: Client;
}
