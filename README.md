
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Objetivo
API Salario Uruguay

Este es un proyecto open source para el calculo de salario liquido, salario vacacional y aguinaldo. Es una api rest en el cual puedes consumir un servicio que te devolvera datos para que pueda ser utilizado en una web, o aplicacion movil.

Conocemos que existe muchas paginas que tienen este calculo pero estamos dando a disposicion de los desarrolladores que puedan emplear esta fuente para crear su proyectos.

Queremos que pueda crecer en proporcionar informacion relacionada a lo laboral en Uruguay, porque queremos llegar a todos los uruguayos y uruguayas.

No duden en hacer un fork y crear una nueva funcionalidad, correcion de bug y levantar un PR.











## API Endpoint

#### Calcular salario liquido

```http
  POST /api/salary/calculate
```
```
{
  "salarioNominal": number,                      |required|
  "tieneHijos": boolean,                         |required|
  "tieneConyuge": boolean,                       |required|
  "factorDeduccionPersonasACargo": number,       |required|
  "cantHijosSinDiscapacidad": number,            |required|
  "cantHijosConDiscapacidad": number,            |required|
  "adicionales": {
    "aportesFondoSolidaridad": boolean,          |required|
    "adicionalFondoSolidaridad": boolean,        |required|
    "aportesCJPPU": number,                      |required|
    "otrasDeducciones": number                   |required|
  }
}
```






## Ambiente local

Clone the project

```bash
  git clone https://github.com/giolabs/api-salariouruguay.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install or yarn
```

Start the server

```bash
  npm run start or yarn dev
```


## Tech Stack

**Server:** Node, Express

