import {
  CityNotEmptyError,
  ZipNotEmptyError,
} from "../../exceptions/DomainError.js";

export class City {
  private id: number | null;
  private name: string;
  private zip: string;

  private constructor(id: number | null, name: string, zip: string) {
    this.id = id;
    this.name = name;
    this.zip = zip;
  }

  public static create(name: string, zip: string): City {
    if (!name || name.trim() === "") {
      throw new CityNotEmptyError();
    }
    if (!zip || zip.trim() === "") {
      throw new ZipNotEmptyError();
    }
    return new City(null, name, zip);
  }
  public static hydrate(id: number, name: string, zip: string): City {
    return new City(id, name, zip);
  }

  getId(): number | null {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getZip(): string {
    return this.zip;
  }
}
