import { seedCars, type SeedCar } from "./seed";

const STORAGE_KEY = "car_inventory_db";

const loadCars = (): SeedCar[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_e) {
    void _e;
  }
  return [...seedCars];
};

const saveCars = (cars: SeedCar[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  } catch (_e) {
    void _e;
  }
};

let cars: SeedCar[] = loadCars();

export const db = {
  list: () => [...cars],
  insert: (car: SeedCar) => {
    cars = [...cars, car];
    saveCars(cars);
    return car;
  },
  reset: () => {
    cars = [...seedCars];
    saveCars(cars);
  },
};