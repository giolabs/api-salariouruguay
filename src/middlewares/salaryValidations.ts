import { body, ValidationChain } from 'express-validator';

export const calculateSalaryValidations: ValidationChain[] = [
  body('salarioNominal')
    .notEmpty()
    .withMessage('El salario nominal es requerido')
    .isNumeric()
    .withMessage('El salario nominal debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El salario nominal debe ser mayor a 0'),

  body('tieneHijos')
    .notEmpty()
    .withMessage('El campo tieneHijos es requerido')
    .isBoolean()
    .withMessage('El campo tieneHijos debe ser un booleano'),

  body('tieneConyuge')
    .notEmpty()
    .withMessage('El campo tieneConyuge es requerido')
    .isBoolean()
    .withMessage('El campo tieneConyuge debe ser un booleano'),

  body('factorDeduccionPersonasACargo')
    .notEmpty()
    .withMessage('El factor de deducción es requerido')
    .isInt({ min: 0, max: 100 })
    .withMessage('El factor de deducción debe ser un número entre 0 y 100'),

  body('cantHijosSinDiscapacidad')
    .notEmpty()
    .withMessage('La cantidad de hijos sin discapacidad es requerida')
    .isInt({ min: 0 })
    .withMessage('La cantidad de hijos sin discapacidad debe ser un número mayor o igual a 0'),

  body('cantHijosConDiscapacidad')
    .notEmpty()
    .withMessage('La cantidad de hijos con discapacidad es requerida')
    .isInt({ min: 0 })
    .withMessage('La cantidad de hijos con discapacidad debe ser un número mayor o igual a 0'),

  body('adicionales')
    .notEmpty()
    .withMessage('El objeto adicionales es requerido')
    .isObject()
    .withMessage('adicionales debe ser un objeto'),

  body('adicionales.aportesFondoSolidaridad')
    .notEmpty()
    .withMessage('El campo aportesFondoSolidaridad es requerido')
    .isBoolean()
    .withMessage('El campo aportesFondoSolidaridad debe ser un booleano'),

  body('adicionales.adicionalFondoSolidaridad')
    .notEmpty()
    .withMessage('El campo adicionalFondoSolidaridad es requerido')
    .isBoolean()
    .withMessage('El campo adicionalFondoSolidaridad debe ser un booleano'),

  body('adicionales.aportesCJPPU')
    .notEmpty()
    .withMessage('El campo aportesCJPPU es requerido')
    .isNumeric()
    .withMessage('El campo aportesCJPPU debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El campo aportesCJPPU debe ser mayor o igual a 0'),

  body('adicionales.otrasDeducciones')
    .notEmpty()
    .withMessage('El campo otrasDeducciones es requerido')
    .isNumeric()
    .withMessage('El campo otrasDeducciones debe ser un número')
    .isFloat({ min: 0 })
    .withMessage('El campo otrasDeducciones debe ser mayor o igual a 0'),
]; 