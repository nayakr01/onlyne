import { Client } from "./client.interface";

export interface Comment {
  _id: string;
  movieSerieId: [];
  userId: Client;
  comment: string;
}
