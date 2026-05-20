import { City } from "./City.js";

export class CityMapper {
  static toDomain(raw: any): City | null {
    if (!raw.city_id) return null;
    return City.hydrate(raw.city_id, raw.city_name, raw.city_zip);
  }

  static toPersistence(city: City) {
    return {
      cityId: city.getId(),
      cityName: city.getName(),
      cityZip: city.getZip(),
    };
  }

  static toJson(city: City | null) {
    if (!city) return null;
    return {
      id: city.getId(),
      name: city.getName(),
      zip: city.getZip(),
    };
    
  }
}
