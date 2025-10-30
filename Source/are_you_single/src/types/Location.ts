// src/types/location.ts

export interface Location {
  type: "Point";              // kiểu GeoJSON chuẩn cho MongoDB
  coordinates: [number, number]; // [longitude, latitude]
}
