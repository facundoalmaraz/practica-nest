import { Car } from 'src/cars/interfaces/car.interface';
import { v4 as uuid } from 'uuid';

export const CARS_SEED: Car[] = [
  {
    id: uuid(),
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
  },
  {
    id: uuid(),
    brand: 'Ford',
    model: 'Mustang',
    year: 2021,
  },
  {
    id: uuid(),
    brand: 'Chevrolet',
    model: 'Camaro',
    year: 2022,
  },
];
