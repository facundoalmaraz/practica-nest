import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Car } from './interfaces/car.interface';
import { CreateCarDto } from './DTOs/create-car.dto';
import { UpdateCarDto } from './DTOs/update-car.dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [
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

  findAllCars() {
    if (this.cars.length === 0) {
      throw new NotFoundException('No cars found');
    }

    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return car;
  }

  createCar(createCarDto: CreateCarDto) {
    const car: Car = {
      id: uuid(),
      brand: createCarDto.brand,
      model: createCarDto.model,
      year: createCarDto.year ?? new Date().getFullYear(),
    };
    this.cars.push(car);
    return car;
  }

  updateCar(id: string, updateCarDto: UpdateCarDto) {
    let carDB = this.findOneById(id);

    if (updateCarDto.id && updateCarDto.id !== id) {
      throw new NotFoundException('Car id is not valid inside body');
    }

    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        // Filtrar propiedades undefined para no sobrescribir valores existentes
        const { id: _, ...updateData } = updateCarDto;
        const filteredUpdate = Object.fromEntries(
          Object.entries(updateData).filter(
            ([_, value]) => value !== undefined,
          ),
        );

        carDB = {
          ...carDB,
          ...filteredUpdate,
          id,
        };
        return carDB;
      }
      return car;
    });
    return carDB;
  }

  deleteCar(id: string) {
    const car = this.findOneById(id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    this.cars = this.cars.filter((car) => car.id !== id);
    return {
      message: 'Car deleted successfully',
      car,
    };
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
