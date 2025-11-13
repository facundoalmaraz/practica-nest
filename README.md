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

## Próximos Pasos

- Validación de datos con DTOs (Data Transfer Objects)
- Conexión a base de datos (TypeORM, Prisma, etc.)
- Autenticación y autorización
- Guards (protección de rutas)
- Interceptors (transformación de respuestas)
- Middleware personalizado

---

## Recursos Adicionales

- [Documentación oficial de NestJS](https://docs.nestjs.com)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection)

---

**¡Feliz coding con NestJS! 🚀**
