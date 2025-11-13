import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
    },
    {
      id: 2,
      brand: 'Ford',
      model: 'Mustang',
      year: 2021,
    },
    {
      id: 3,
      brand: 'Chevrolet',
      model: 'Camaro',
      year: 2022,
    },
  ];

  findAllCars() {
    if (this.cars.length === 0) {
      throw new NotFoundException('No cars found');
    }

    return this.cars;
  }

  findOneById(id: number) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return car;
  }
}
