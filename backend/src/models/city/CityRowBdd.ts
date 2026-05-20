import type { RowDataPacket } from "mysql2";

export interface CityRowBdd extends RowDataPacket{
  city_id: number;
  city_name: string;
  city_zip: string;
}
