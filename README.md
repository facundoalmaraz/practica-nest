# 🚗 Car Dealership - Curso de NestJS

Este proyecto es una aplicación de gestión de concesionarios de autos construida con NestJS, creada como parte de un curso introductorio.

## 📚 Tabla de Contenidos

1. [¿Qué es NestJS y por qué usarlo?](#qué-es-nestjs-y-por-qué-usarlo)
2. [Instalación de Nest CLI](#instalación-de-nest-cli)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos](#módulos)
5. [Controladores](#controladores)
6. [Servicios](#servicios)
7. [Inyección de Dependencias](#inyección-de-dependencias)
8. [Decoradores](#decoradores)
9. [Pipes](#pipes)
10. [Exception Filters](#exception-filters)
11. [Métodos HTTP (GET, POST, PATCH, DELETE)](#métodos-http)
12. [DTOs y Validación de Información](#dtos-y-validación-de-información)

---

## ¿Qué es NestJS y por qué usarlo?

### ¿Qué es NestJS?

**NestJS** es un framework progresivo de Node.js construido con TypeScript que utiliza patrones de diseño arquitectónicos maduros y probados. Está inspirado en frameworks como Angular (frontend) y Spring (Java), lo que lo hace familiar para desarrolladores que vienen de esos ecosistemas.

### Características principales:

- ✅ **TypeScript nativo**: Soporte completo para TypeScript desde el inicio
- ✅ **Arquitectura modular**: Organización clara del código en módulos
- ✅ **Inyección de dependencias**: Sistema robusto de DI integrado
- ✅ **Decoradores**: Uso extensivo de decoradores para metadatos
- ✅ **Express/Fastify**: Puede usar Express o Fastify como motor HTTP
- ✅ **Testing**: Herramientas integradas para testing
- ✅ **Escalable**: Diseñado para aplicaciones enterprise

### ¿Por qué usarlo?

1. **Organización**: La arquitectura modular facilita mantener código limpio y organizado
2. **Productividad**: Muchas funcionalidades vienen "out of the box"
3. **TypeScript**: Type safety que reduce errores en tiempo de ejecución
4. **Ecosistema**: Gran comunidad y documentación
5. **Enterprise-ready**: Ideal para aplicaciones grandes y complejas

---

## Instalación de Nest CLI

El **Nest CLI** (Command Line Interface) es una herramienta que facilita la creación y gestión de proyectos NestJS.

### Instalación global:

```bash
npm i -g @nestjs/cli
```

### Comandos útiles:

```bash
# Crear un nuevo proyecto
nest new nombre-proyecto

# Generar un módulo
nest g module nombre-modulo

# Generar un controlador
nest g controller nombre-controlador

# Generar un servicio
nest g service nombre-servicio
```

---

## Estructura del Proyecto

### Archivos principales:

```
car-dealership/
├── src/
│   ├── main.ts              # Punto de entrada de la aplicación
│   ├── app.module.ts        # Módulo raíz de la aplicación
│   └── cars/
│       ├── cars.module.ts   # Módulo de autos
│       ├── cars.controller.ts # Controlador de autos
│       └── cars.service.ts  # Servicio de autos
├── dist/                    # Código compilado (JavaScript)
├── test/                    # Tests e2e
├── package.json             # Dependencias del proyecto
└── tsconfig.json            # Configuración de TypeScript
```

### Explicación de cada archivo:

#### `main.ts`
Es el punto de entrada de la aplicación. Aquí se crea la instancia de NestJS y se inicia el servidor.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**¿Qué hace?**
- Importa `NestFactory` para crear la aplicación
- Crea una instancia de la app usando `AppModule` como módulo raíz
- Inicia el servidor en el puerto 3000 (o el definido en `process.env.PORT`)

#### `app.module.ts`
Es el módulo raíz que importa todos los demás módulos de la aplicación.

```typescript
@Module({
  imports: [CarsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
```

**Propiedades del decorador `@Module`:**
- `imports`: Módulos que este módulo necesita
- `controllers`: Controladores que pertenecen a este módulo
- `providers`: Servicios/proveedores disponibles en este módulo
- `exports`: Lo que este módulo exporta para que otros módulos lo usen

---

## Módulos

### ¿Qué es un Módulo?

Un **módulo** es una clase decorada con `@Module()` que organiza el código relacionado. Es la unidad básica de organización en NestJS.

### Características:

- Cada aplicación tiene al menos un módulo raíz (`AppModule`)
- Los módulos encapsulan funcionalidad relacionada
- Permiten la organización y reutilización del código
- Definen qué controladores y servicios están disponibles

### Ejemplo: `CarsModule`

```typescript
@Module({
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
```

**¿Qué hace?**
- Declara que `CarsController` manejará las rutas HTTP
- Declara que `CarsService` es un proveedor disponible para inyección
- Todo lo que está en este módulo puede usar `CarsService`

---

## Controladores

### ¿Qué es un Controlador?

Un **controlador** es una clase decorada con `@Controller()` que maneja las peticiones HTTP entrantes y devuelve respuestas al cliente.

### Responsabilidades:

- Recibir peticiones HTTP
- Validar datos de entrada
- Llamar a servicios para procesar la lógica de negocio
- Devolver respuestas HTTP

### Ejemplo: `CarsController`

```typescript
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.findAllCars();
  }

  @Get(':id')
  getCarById(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOneById(id);
  }
}
```

**¿Qué hace?**
- `@Controller('cars')`: Define que todas las rutas empezarán con `/cars`
- `@Get()`: Maneja peticiones GET a `/cars`
- `@Get(':id')`: Maneja peticiones GET a `/cars/:id`
- `@Param('id')`: Extrae el parámetro `id` de la URL
- `ParseIntPipe`: Convierte el parámetro a número

---

## Servicios

### ¿Qué es un Servicio?

Un **servicio** es una clase decorada con `@Injectable()` que contiene la lógica de negocio de la aplicación. Los servicios son reutilizables y pueden ser inyectados en controladores u otros servicios.

### Responsabilidades:

- Contener la lógica de negocio
- Interactuar con bases de datos
- Procesar datos
- Manejar reglas de negocio

### Ejemplo: `CarsService`

```typescript
@Injectable()
export class CarsService {
  private cars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
    { id: 2, brand: 'Ford', model: 'Mustang', year: 2021 },
    { id: 3, brand: 'Chevrolet', model: 'Camaro', year: 2022 },
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
```

**¿Qué hace?**
- `@Injectable()`: Marca la clase como inyectable (puede ser usada con DI)
- Almacena datos en memoria (en producción usarías una base de datos)
- Implementa métodos para buscar autos
- Lanza excepciones cuando no encuentra datos

---

## Inyección de Dependencias

### ¿Qué es la Inyección de Dependencias (DI)?

La **Inyección de Dependencias** es un patrón de diseño donde las dependencias de una clase se proporcionan desde el exterior en lugar de ser creadas dentro de la clase misma.

### ¿Por qué es importante?

1. **Desacoplamiento**: Las clases no crean sus propias dependencias
2. **Testabilidad**: Fácil de hacer pruebas unitarias (puedes inyectar mocks)
3. **Reutilización**: El mismo servicio puede usarse en múltiples lugares
4. **Mantenibilidad**: Cambios en una clase no afectan directamente a otras

### Cómo funciona en NestJS:

NestJS tiene un **contenedor de inyección de dependencias** integrado que:
- Crea instancias de servicios automáticamente
- Las inyecta donde se necesiten
- Gestiona el ciclo de vida de las instancias
- Crea una única instancia (singleton) por defecto

### Ejemplo práctico:

#### ❌ Sin Inyección de Dependencias (MAL):

```typescript
@Controller('cars')
export class CarsController {
  private carsService: CarsService;

  constructor() {
    // ❌ La clase crea su propia dependencia
    this.carsService = new CarsService();
  }

  @Get()
  getAllCars() {
    return this.carsService.findAllCars();
  }
}
```

**Problemas:**
- Difícil de testear (no puedes inyectar un mock)
- Acoplamiento fuerte
- Si `CarsService` necesita dependencias, tienes que crearlas manualmente

#### ✅ Con Inyección de Dependencias (BIEN):

```typescript
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  // ✅ NestJS inyecta automáticamente CarsService
}
```

**Ventajas:**
- NestJS crea e inyecta `CarsService` automáticamente
- Fácil de testear (puedes inyectar un mock)
- Desacoplamiento total

### Proceso paso a paso:

1. **Definir el servicio como `@Injectable()`**:
```typescript
@Injectable()
export class CarsService { }
```

2. **Registrarlo como `provider` en el módulo**:
```typescript
@Module({
  providers: [CarsService] // ← NestJS sabe que puede crear instancias
})
export class CarsModule {}
```

3. **Inyectarlo en el constructor**:
```typescript
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  // ↑ NestJS automáticamente:
  // 1. Busca CarsService en el módulo
  // 2. Crea una instancia (o reutiliza una existente)
  // 3. La inyecta aquí
}
```

### Flujo completo:

```
1. NestJS inicia la aplicación
2. Lee CarsModule y ve que CarsService está en providers
3. Crea una instancia de CarsService (singleton)
4. Ve que CarsController necesita CarsService en su constructor
5. Inyecta automáticamente la instancia de CarsService
6. CarsController puede usar this.carsService
```

### Inyección en múltiples niveles:

Puedes inyectar servicios en otros servicios:

```typescript
@Injectable()
export class DatabaseService {
  // Lógica de base de datos
}

@Injectable()
export class CarsService {
  constructor(private readonly databaseService: DatabaseService) {}
  // ↑ CarsService puede usar DatabaseService
}
```

**Regla importante**: Ambos servicios deben estar en el mismo módulo (o el módulo debe importar el módulo que exporta el servicio).

---

## Decoradores

### ¿Qué es un Decorador?

Un **decorador** es una función especial que modifica o añade metadatos a clases, métodos, propiedades o parámetros. En TypeScript, los decoradores se escriben con el símbolo `@`.

### Tipos de decoradores en NestJS:

#### 1. Decoradores de Clase

##### `@Module()`
Define un módulo de NestJS.

```typescript
@Module({
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
```

##### `@Controller('ruta')`
Define un controlador y su ruta base.

```typescript
@Controller('cars') // Todas las rutas empezarán con /cars
export class CarsController {}
```

##### `@Injectable()`
Marca una clase como inyectable (puede ser usada con DI).

```typescript
@Injectable()
export class CarsService {}
```

#### 2. Decoradores de Métodos HTTP

Estos decoradores definen qué método HTTP maneja cada función:

##### `@Get()`, `@Post()`, `@Patch()`, `@Delete()`, `@Put()`

```typescript
@Get()           // GET /cars
getAllCars() { }

@Get(':id')      // GET /cars/:id
getCarById() { }

@Post()          // POST /cars
createCar() { }

@Patch(':id')    // PATCH /cars/:id
updateCar() { }

@Delete(':id')   // DELETE /cars/:id
deleteCar() { }
```

#### 3. Decoradores de Parámetros

Estos decoradores extraen datos de la petición HTTP:

##### `@Param()`
Extrae parámetros de la URL.

```typescript
@Get(':id')
getCarById(@Param('id') id: string) {
  // Si la URL es /cars/123, id será "123"
}
```

##### `@Body()`
Extrae el cuerpo de la petición (JSON).

```typescript
@Post()
createCar(@Body() body: any) {
  // body contiene los datos enviados en el POST
}
```

##### `@Query()`
Extrae query parameters de la URL.

```typescript
@Get()
getCars(@Query('page') page: number) {
  // Si la URL es /cars?page=1, page será 1
}
```

### Cómo funcionan los decoradores:

Los decoradores son **funciones que se ejecutan en tiempo de compilación** y añaden metadatos a las clases. NestJS lee estos metadatos para saber:

- Qué rutas manejar
- Qué parámetros extraer
- Qué servicios inyectar
- Cómo estructurar la aplicación

### Ejemplo completo:

```typescript
@Controller('cars')  // ← Decorador de clase: define ruta base
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  // ↑ Inyección de dependencia

  @Get()  // ← Decorador de método: define método HTTP y ruta
  getAllCars() {
    return this.carsService.findAllCars();
  }

  @Get(':id')  // ← Decorador de método con parámetro dinámico
  getCarById(
    @Param('id', ParseIntPipe) id: number  // ← Decorador de parámetro
  ) {
    return this.carsService.findOneById(id);
  }

  @Post()  // ← Decorador de método
  createCar(@Body() body: any) {  // ← Decorador de parámetro
    return body;
  }
}
```

**¿Qué hace NestJS con estos decoradores?**

1. Lee `@Controller('cars')` → Crea rutas base `/cars`
2. Lee `@Get()` → Crea ruta GET `/cars`
3. Lee `@Get(':id')` → Crea ruta GET `/cars/:id`
4. Lee `@Param('id')` → Extrae el parámetro `id` de la URL
5. Lee `@Body()` → Extrae el cuerpo JSON de la petición

---

## Pipes

### ¿Qué es un Pipe?

Un **Pipe** es una clase que transforma o valida datos antes de que lleguen al handler del controlador.

### Tipos de Pipes:

1. **Transformación**: Convierte datos de un formato a otro
2. **Validación**: Valida que los datos cumplan ciertos criterios

### Pipes integrados de NestJS:

#### `ParseIntPipe`
Convierte un string a número y valida que sea un entero válido.

```typescript
@Get(':id')
getCarById(@Param('id', ParseIntPipe) id: number) {
  // Si la URL es /cars/abc, lanzará un error
  // Si la URL es /cars/123, id será el número 123
}
```

**¿Qué hace?**
- Convierte `"123"` → `123` (número)
- Si no puede convertir, lanza una excepción automáticamente
- Valida que sea un número entero válido

#### Otros Pipes comunes:

- `ParseFloatPipe`: Convierte a número decimal
- `ParseBoolPipe`: Convierte a booleano
- `ParseUUIDPipe`: Valida que sea un UUID válido
- `DefaultValuePipe`: Proporciona un valor por defecto

### Ejemplo sin Pipe (problema):

```typescript
@Get(':id')
getCarById(@Param('id') id: string) {
  // id es un string "123", no un número
  // Tendrías que hacer: const numId = parseInt(id)
  // Y manejar errores manualmente
}
```

### Ejemplo con Pipe (solución):

```typescript
@Get(':id')
getCarById(@Param('id', ParseIntPipe) id: number) {
  // id ya es un número 123
  // Si no es válido, NestJS lanza error automáticamente
}
```

---

## Exception Filters

### ¿Qué es un Exception Filter?

Un **Exception Filter** es un mecanismo que captura excepciones lanzadas en la aplicación y las convierte en respuestas HTTP apropiadas.

### Excepciones integradas de NestJS:

#### `NotFoundException`
Se lanza cuando no se encuentra un recurso.

```typescript
@Injectable()
export class CarsService {
  findOneById(id: number) {
    const car = this.cars.find((car) => car.id === id);
    
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
      // ↑ Esto automáticamente devuelve:
      // Status: 404 Not Found
      // Body: { "statusCode": 404, "message": "Car with id 123 not found" }
    }
    
    return car;
  }
}
```

### Otras excepciones comunes:

- `BadRequestException` (400): Solicitud incorrecta
- `UnauthorizedException` (401): No autorizado
- `ForbiddenException` (403): Prohibido
- `NotFoundException` (404): No encontrado
- `ConflictException` (409): Conflicto
- `InternalServerErrorException` (500): Error interno

### ¿Qué hace NestJS automáticamente?

Cuando lanzas una excepción, NestJS:
1. Captura la excepción
2. Convierte el código de estado HTTP apropiado
3. Devuelve una respuesta JSON con el mensaje de error

**Ejemplo de respuesta automática:**

```json
{
  "statusCode": 404,
  "message": "Car with id 123 not found",
  "error": "Not Found"
}
```

---

## Métodos HTTP

### GET - Obtener recursos

```typescript
@Get()              // GET /cars
getAllCars() {
  return this.carsService.findAllCars();
}

@Get(':id')         // GET /cars/:id
getCarById(@Param('id', ParseIntPipe) id: number) {
  return this.carsService.findOneById(id);
}
```

### POST - Crear recursos

```typescript
@Post()             // POST /cars
createCar(@Body() body: any) {
  // body contiene los datos del nuevo auto
  return body;
}
```

**Ejemplo de petición:**
```bash
POST /cars
Content-Type: application/json

{
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2023
}
```

### PATCH - Actualizar recursos parcialmente

```typescript
@Patch(':id')       // PATCH /cars/:id
updateCar(@Body() body: any) {
  // body contiene solo los campos a actualizar
  return body;
}
```

**Ejemplo de petición:**
```bash
PATCH /cars/1
Content-Type: application/json

{
  "year": 2024
}
```

### DELETE - Eliminar recursos

```typescript
@Delete(':id')      // DELETE /cars/:id
deleteCar(@Param('id', ParseIntPipe) id: number) {
  return id;
}
```

---

## Resumen del Flujo Completo

### ¿Qué pasa cuando haces una petición?

```
1. Cliente hace: GET /cars/123

2. NestJS busca el controlador que maneja /cars
   → Encuentra CarsController (por @Controller('cars'))

3. NestJS busca el método que maneja GET /cars/:id
   → Encuentra getCarById (por @Get(':id'))

4. NestJS ejecuta los Pipes
   → ParseIntPipe convierte "123" → 123

5. NestJS inyecta el parámetro
   → id = 123

6. Se ejecuta el método del controlador
   → getCarById(123)

7. El controlador llama al servicio
   → this.carsService.findOneById(123)

8. El servicio busca el auto
   → Si no existe, lanza NotFoundException

9. NestJS captura la excepción (si hay)
   → Convierte a respuesta HTTP 404

10. Devuelve la respuesta al cliente
    → JSON con el auto o error
```

---

## Conceptos Clave Resumidos

### 🏗️ Arquitectura

- **Módulos**: Organizan el código
- **Controladores**: Manejan peticiones HTTP
- **Servicios**: Contienen lógica de negocio

### 🔌 Inyección de Dependencias

- Las dependencias se inyectan en el constructor
- NestJS las crea y gestiona automáticamente
- Facilita testing y desacoplamiento

### 🎨 Decoradores

- `@Module()`: Define módulos
- `@Controller()`: Define controladores
- `@Injectable()`: Marca servicios como inyectables
- `@Get()`, `@Post()`, etc.: Define métodos HTTP
- `@Param()`, `@Body()`, `@Query()`: Extrae datos de peticiones

### 🔧 Pipes

- Transforman y validan datos
- `ParseIntPipe`: Convierte strings a números

### ⚠️ Exception Filters

- Capturan excepciones automáticamente
- Las convierten en respuestas HTTP apropiadas
- `NotFoundException`: 404 Not Found

---

## DTOs y Validación de Información

### ¿Qué es un DTO?

Un **DTO (Data Transfer Object)** es un objeto que define la estructura y validación de los datos que se transfieren entre el cliente y el servidor. Los DTOs nos permiten:

- ✅ **Validar datos**: Asegurar que los datos recibidos cumplan con los requisitos
- ✅ **Documentar**: Hacer explícita la estructura esperada de los datos
- ✅ **Type Safety**: Aprovechar TypeScript para detectar errores en tiempo de compilación
- ✅ **Transformación**: Convertir datos de un formato a otro

### Interfaces vs DTOs

#### Interfaces
Las **interfaces** definen la estructura de datos que se usa **dentro** de la aplicación.

```typescript
// src/cars/interfaces/car.interface.ts
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
}
```

**Características:**
- Solo definen tipos (no validación)
- Se usan para tipado estático
- No tienen lógica de validación en tiempo de ejecución

#### DTOs
Los **DTOs** definen y validan los datos que **recibe** la aplicación desde el exterior.

```typescript
// src/cars/DTOs/create-car.dto.ts
import { IsString, IsOptional, IsNumber, Min, Max, MinLength } from 'class-validator';

export class CreateCarDto {
  @IsString({ message: 'La marca debe ser un string' })
  readonly brand: string;

  @IsString({ message: 'El modelo debe ser un string' })
  @MinLength(3)
  readonly model: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2025)
  readonly year?: number;
}
```

**Características:**
- Incluyen validación en tiempo de ejecución
- Usan decoradores de `class-validator`
- Se validan automáticamente con `ValidationPipe`

### UUID (Universally Unique Identifier)

Un **UUID** es un identificador único de 128 bits que se usa para identificar recursos de forma única. Es más seguro que usar números secuenciales.

#### ¿Por qué usar UUID?

1. **Seguridad**: No se pueden adivinar IDs secuenciales
2. **Distribución**: Únicos globalmente, incluso en sistemas distribuidos
3. **Privacidad**: No revelan información sobre la cantidad de recursos

#### Generar UUIDs en NestJS

```typescript
import { v4 as uuid } from 'uuid';

const newId = uuid(); // Genera: "550e8400-e29b-41d4-a716-446655440000"
```

#### Validar UUIDs con ParseUUIDPipe

```typescript
@Get(':id')
getCarById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
  // Si el id no es un UUID válido, NestJS lanza error automáticamente
  return this.carsService.findOneById(id);
}
```

**Versiones de UUID:**
- `version: '4'`: UUID aleatorio (más común)
- `version: '1'`: UUID basado en tiempo y MAC address

### ValidationPipe - Class Validator y Class Transformer

El **ValidationPipe** es un pipe integrado de NestJS que valida automáticamente los datos usando decoradores de `class-validator` y `class-transformer`.

#### Instalación

```bash
npm install class-validator class-transformer
```

#### Configuración Global

```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Elimina campos que no están en el DTO
      forbidNonWhitelisted: true,    // Lanza error si se envían campos extra
      transform: true,               // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos implícitamente
      },
    }),
  );

  await app.listen(3000);
}
```

**Opciones del ValidationPipe:**

- `whitelist: true`: Elimina propiedades que no están definidas en el DTO
- `forbidNonWhitelisted: true`: Lanza error si se envían propiedades no definidas
- `transform: true`: Convierte automáticamente los tipos (string → number, etc.)
- `disableErrorMessages: false`: Habilita mensajes de error personalizados

#### Decoradores de Validación (class-validator)

##### Validadores básicos

```typescript
import {
  IsString,      // Valida que sea string
  IsNumber,      // Valida que sea número
  IsBoolean,      // Valida que sea booleano
  IsOptional,    // Hace el campo opcional
  IsUUID,        // Valida que sea UUID válido
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  readonly brand: string;

  @IsNumber()
  readonly year: number;

  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean;
}
```

##### Validadores de longitud y rango

```typescript
import { MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @MinLength(3, { message: 'El modelo debe tener al menos 3 caracteres' })
  @MaxLength(50)
  readonly model: string;

  @IsNumber()
  @Min(1900, { message: 'El año debe ser mayor o igual a 1900' })
  @Max(2025, { message: 'El año debe ser menor o igual a 2025' })
  readonly year: number;
}
```

##### Mensajes de error personalizados

```typescript
@IsString({ message: 'La marca debe ser un string' })
readonly brand: string;

@MinLength(3, { message: 'El modelo debe tener al menos 3 caracteres' })
readonly model: string;
```

### Pipes Globales - A nivel de Aplicación

Los **pipes globales** se aplican a **todos** los endpoints de la aplicación automáticamente.

#### Configuración en main.ts

```typescript
// src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

**Ventajas:**
- ✅ No necesitas agregar `ValidationPipe` en cada endpoint
- ✅ Validación consistente en toda la aplicación
- ✅ Menos código repetitivo

#### Pipes a nivel de Controlador

```typescript
@Controller('cars')
@UsePipes(ValidationPipe) // Aplica a todos los endpoints de este controlador
export class CarsController {}
```

#### Pipes a nivel de Endpoint

```typescript
@Post()
@UsePipes(ValidationPipe) // Solo aplica a este endpoint
createCar(@Body() createCarDto: CreateCarDto) {
  return this.carsService.createCar(createCarDto);
}
```

#### Pipes en parámetros específicos

```typescript
@Patch(':id')
updateCar(
  @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  @Body(ValidationPipe) updateCarDto: UpdateCarDto, // Pipe solo en este parámetro
) {
  return this.carsService.updateCar(id, updateCarDto);
}
```

### Crear un nuevo carro (POST)

#### DTO de Creación

```typescript
// src/cars/DTOs/create-car.dto.ts
export class CreateCarDto {
  @IsString({ message: 'La marca debe ser un string' })
  readonly brand: string;

  @IsString({ message: 'El modelo debe ser un string' })
  @MinLength(3)
  readonly model: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2025)
  readonly year?: number;
}
```

#### Controlador

```typescript
@Post()
createCar(@Body() createCarDto: CreateCarDto) {
  return this.carsService.createCar(createCarDto);
}
```

#### Servicio

```typescript
createCar(createCarDto: CreateCarDto) {
  const car: Car = {
    id: uuid(), // Genera UUID automáticamente
    brand: createCarDto.brand,
    model: createCarDto.model,
    year: createCarDto.year ?? new Date().getFullYear(), // Valor por defecto
  };
  this.cars.push(car);
  return car;
}
```

**Ejemplo de petición:**
```bash
POST /cars
Content-Type: application/json

{
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2023
}
```

**Si falta un campo requerido:**
```json
{
  "statusCode": 400,
  "message": ["brand must be a string"],
  "error": "Bad Request"
}
```

### Actualizar un carro (PATCH)

#### DTO de Actualización

```typescript
// src/cars/DTOs/update-car.dto.ts
export class UpdateCarDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id?: string;

  @IsString({ message: 'La marca debe ser un string' })
  @IsOptional()
  readonly brand?: string;

  @IsString({ message: 'El modelo debe ser un string' })
  @MinLength(3)
  @IsOptional()
  readonly model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2025)
  readonly year?: number;
}
```

**Características importantes:**
- Todos los campos son opcionales (`@IsOptional()`)
- Permite actualizar solo los campos que se envían
- Valida que el `id` sea UUID si se proporciona

#### Controlador

```typescript
@Patch(':id')
updateCar(
  @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  @Body(ValidationPipe) updateCarDto: UpdateCarDto,
) {
  return this.carsService.updateCar(id, updateCarDto);
}
```

#### Servicio

```typescript
updateCar(id: string, updateCarDto: UpdateCarDto) {
  let carDB = this.findOneById(id);

  // Validar que el id en el body coincida con el de la URL
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
        ...carDB,        // Mantiene valores existentes
        ...filteredUpdate, // Solo actualiza campos enviados
        id,              // Preserva el id original
      };
      return carDB;
    }
    return car;
  });
  return carDB;
}
```

**Ejemplo de petición (actualizar solo el modelo):**
```bash
PATCH /cars/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "model": "Fiesta"
}
```

**Resultado:** Solo se actualiza el `model`, manteniendo `brand` y `year` originales.

### Borrar un carro (DELETE)

#### Controlador

```typescript
@Delete(':id')
deleteCar(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
  return this.carsService.deleteCar(id);
}
```

#### Servicio

```typescript
deleteCar(id: string) {
  const car = this.findOneById(id); // Valida que exista
  
  if (!car) {
    throw new NotFoundException(`Car with id ${id} not found`);
  }

  this.cars = this.cars.filter((car) => car.id !== id);
  return {
    message: 'Car deleted successfully',
    car,
  };
}
```

**Ejemplo de petición:**
```bash
DELETE /cars/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa:**
```json
{
  "message": "Car deleted successfully",
  "car": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "brand": "Ford",
    "model": "Mustang",
    "year": 2021
  }
}
```

### Estructura de Carpetas para DTOs

```
src/
└── cars/
    ├── cars.controller.ts
    ├── cars.service.ts
    ├── cars.module.ts
    ├── interfaces/
    │   └── car.interface.ts
    └── DTOs/
        ├── create-car.dto.ts
        └── update-car.dto.ts
```

**Convenciones:**
- Los DTOs van en una carpeta `DTOs/` dentro del módulo
- Las interfaces van en una carpeta `interfaces/`
- Nombres descriptivos: `create-car.dto.ts`, `update-car.dto.ts`

### Resumen de Conceptos Clave

#### DTOs
- ✅ Definen la estructura de datos de entrada
- ✅ Incluyen validación con decoradores
- ✅ Mejoran la seguridad y type safety

#### UUID
- ✅ Identificadores únicos y seguros
- ✅ Se validan con `ParseUUIDPipe`
- ✅ Se generan con la librería `uuid`

#### ValidationPipe
- ✅ Valida automáticamente los DTOs
- ✅ Se puede configurar globalmente
- ✅ Usa `class-validator` y `class-transformer`

#### Decoradores de Validación
- ✅ `@IsString()`, `@IsNumber()`, `@IsOptional()`
- ✅ `@MinLength()`, `@MaxLength()`, `@Min()`, `@Max()`
- ✅ `@IsUUID()` para validar UUIDs

#### Actualización Parcial (PATCH)
- ✅ Todos los campos del DTO son opcionales
- ✅ Solo se actualizan los campos enviados
- ✅ Se filtran propiedades `undefined` para no sobrescribir valores

---

## Próximos Pasos

- Conexión a base de datos (TypeORM, Prisma, etc.)
- Autenticación y autorización
- Guards (protección de rutas)
- Interceptors (transformación de respuestas)
- Middleware personalizado
- Swagger/OpenAPI para documentación

---

## Recursos Adicionales

- [Documentación oficial de NestJS](https://docs.nestjs.com)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection)

---

**¡Feliz coding con NestJS! 🚀**
