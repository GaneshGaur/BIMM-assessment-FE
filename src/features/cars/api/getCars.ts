import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars($make: String, $model: String, $year: Int, $color: String) {
    cars(make: $make, model: $model, year: $year, color: $color) {
      id
      make
      model
      year
      color
      mobile
      tablet
      desktop
    }
  }
`;
