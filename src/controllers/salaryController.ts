import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import {
  useSalaryCalculator,
  SalaryInputs,
} from "../services/salaryCalculator";

export class SalaryController {
  static calculateSalary(req: Request, res: Response): void {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: "Error de validación",
          details: errors.array().map(err => ({
            field: err.type,
            message: err.msg
          }))
        });
        return;
      }

      const salaryInputs: SalaryInputs = req.body;
      const result = useSalaryCalculator(salaryInputs);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: "Error al calcular el salario",
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static getInformation(req: Request, res: Response): void {
    const json = {
      "salarioVacacional": {
        "informacion": "El salario vacacional es un complemento de la licencia anual que equivale a un monto adicional del 100% del jornal líquido de vacaciones. 20 días de licencia anual prorrateado mensualmente",
      },
      "aguinaldo": {
        "informacion": "El aguinaldo es un sueldo adicional que se paga en dos partes: junio y diciembre. Equivale a 1/12 del total de salarios nominales percibidos en el período",
      },
      "aportesJubilatorios": {
        "informacion": "Los aportes jubilatorios son un porcentaje del salario nominal. El porcentaje es del 15%",
      },
      "aportesFONASA": {
        "informacion": "Los aportes FONASA son un porcentaje del salario nominal. Si tiene hijos o cónyuge, el porcentaje es del 6%, de lo contrario es del 4.5%",
      },
      "aportesFondoSolidaridad": {
        "informacion": "El Fondo de Solidaridad de Uruguay es un tributo que pagan los egresados de la educación terciaria pública para financiar becas y el presupuesto de la universidad. El monto de la contribución depende de la duración de la carrera.",
      },
      "aportesCJPPU": {
        "informacion": "El aporte a la Caja de Jubilaciones y Pensiones de Profesionales Universitarios (CJPPU) en Uruguay es un porcentaje del sueldo ficto de cada afiliado",
      },
      "IRPF": {
        "informacion": "El Impuesto a las Rentas de las Personas Físicas es un tributo anual de carácter personal y directo, que grava las rentas obtenidas por las personas físicas residentes",
      }
    };

    res.json(json);
  }
}
