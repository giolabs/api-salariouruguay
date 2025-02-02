// Constants
const BPC = 6177;
const IRPF_FRANJAS = [
  { desde: 0, hasta: 7, tasa: 0 },
  { desde: 7, hasta: 10, tasa: 10 },
  { desde: 10, hasta: 15, tasa: 15 },
  { desde: 15, hasta: 30, tasa: 24 },
  { desde: 30, hasta: 50, tasa: 25 },
  { desde: 50, hasta: 75, tasa: 27 },
  { desde: 75, hasta: 115, tasa: 31 },
  { desde: 115, hasta: 0, tasa: 36 },
];
const APORTES_JUBILATORIOS = 15;
const TOPE_APORTES_JUBILATORIOS = 236309;
const APORTE_FRL = 0.1;
const INCREMENTO_INGRESOS_GRAVADOS = 6;
const TASA_DEDUCCIONES_HASTA15BPC = 10;
const TASA_DEDUCCIONES_DESDE15BPC = 8;
const DEDUCCION_HIJO_SIN_DISCAPACIDAD = (20 * BPC) / 12;
const DEDUCCION_HIJO_CON_DISCAPACIDAD = (40 * BPC) / 12;
const ADICIONAL_FONDO_SOLIDARIDAD = ((5 / 4) * BPC) / 12;

export interface SalaryInputs {
  salarioNominal: number;
  tieneHijos: boolean;
  tieneConyuge: boolean;
  factorDeduccionPersonasACargo: number;
  cantHijosSinDiscapacidad: number;
  cantHijosConDiscapacidad: number;
  adicionales: {
    aportesFondoSolidaridad: boolean;
    adicionalFondoSolidaridad: boolean;
    aportesCJPPU: number;
    otrasDeducciones: number;
  };
}

const useSalaryCalculator = (salaryInputs: SalaryInputs) => {
  const {
    salarioNominal,
    tieneHijos,
    tieneConyuge,
    factorDeduccionPersonasACargo,
    cantHijosSinDiscapacidad,
    cantHijosConDiscapacidad,
    adicionales,
  } = salaryInputs;

  const aportes = calcularAportesBPS(salarioNominal, tieneHijos, tieneConyuge);

  const { detalleIRPF, totalIRPF } = calcularIRPF(
    salarioNominal,
    factorDeduccionPersonasACargo,
    cantHijosSinDiscapacidad,
    cantHijosConDiscapacidad,
    aportes,
    adicionales
  );

  const salarioLiquido =
    salarioNominal -
    aportes.aportesJubilatorios -
    aportes.aportesFONASA -
    aportes.aporteFRL -
    totalIRPF;


  // Cálculo de salario vacacional
  // Es un complemento de la licencia anual que equivale a
  // un monto adicional del 100% del jornal líquido de vacaciones
  const salarioVacacional = (salarioNominal / 24) * 20;
  // 20 días de licencia anual prorrateado mensualmente

  // Cálculo de aguinaldo (sueldo anual complementario)
  // Es un sueldo adicional que se paga en dos partes: junio y diciembre
  // Equivale a 1/12 del total de salarios nominales percibidos en el período
  const aguinaldo = salarioNominal / 2 ;

  return {
    salarioNominal: parseFloat(salarioNominal.toFixed(2)),
    salarioLiquido: parseFloat(salarioLiquido.toFixed(2)),
    salarioAnual: parseFloat((salarioNominal * 12).toFixed(2)),
    ...aportes,
    detalleIRPF,
    totalIRPF: parseFloat(totalIRPF.toFixed(2)),
    aguinaldo: parseFloat(aguinaldo.toFixed(2)),
    salarioVacacional: parseFloat(salarioVacacional.toFixed(2)),
    informacionSalarioVacacional: "El salario vacacional es un complemento de la licencia anual que equivale a un monto adicional del 100% del jornal líquido de vacaciones. 20 días de licencia anual prorrateado mensualmente",
    informacionAguinaldo: "El aguinaldo es un sueldo adicional que se paga en dos partes: junio y diciembre. Equivale a 1/12 del total de salarios nominales percibidos en el período",
  };
};

const calcularAportesBPS = (
  salarioNominal: number,
  tieneHijos: boolean,
  tieneConyuge: boolean
) => {
  const aportesJubilatorios =
    Math.min(TOPE_APORTES_JUBILATORIOS, salarioNominal) *
    APORTES_JUBILATORIOS *
    0.01;

  let porcentajeFonasa;
  if (!tieneHijos && !tieneConyuge) porcentajeFonasa = 0.045; // 4.5%
  else if (tieneHijos && !tieneConyuge) porcentajeFonasa = 0.06; // 6.0%
  else if (!tieneHijos && tieneConyuge) porcentajeFonasa = 0.065; // 6.5%
  else porcentajeFonasa = 0.08; // 8.0%

  const aportesFONASA = salarioNominal * porcentajeFonasa;
  const aporteFRL = salarioNominal * APORTE_FRL * 0.01;

  return {
    aportesJubilatorios: parseFloat(aportesJubilatorios.toFixed(2)),
    aportesFONASA: parseFloat(aportesFONASA.toFixed(2)),
    aporteFRL: parseFloat(aporteFRL.toFixed(2)),
  };
};

const calcularIRPF = (
  salarioNominal: number,
  factorDeduccionPersonasACargo: number,
  cantHijosSinDiscapacidad: number,
  cantHijosConDiscapacidad: number,
  aportes: {
    aportesJubilatorios: number;
    aportesFONASA: number;
    aporteFRL: number;
  },
  adicionales: {
    aportesFondoSolidaridad: boolean;
    adicionalFondoSolidaridad: boolean;
    aportesCJPPU: number;
    otrasDeducciones: number;
  }
) => {
  let salarioAjustado = salarioNominal;
  const salarioEnBPC = calcularSalarioEnBPC(salarioNominal);
  if (salarioEnBPC > 10)
    salarioAjustado *= 1 + INCREMENTO_INGRESOS_GRAVADOS * 0.01;

  const percentage = factorDeduccionPersonasACargo * 0.01;

  const deduccionesHijos =
    percentage *
    (cantHijosSinDiscapacidad * DEDUCCION_HIJO_SIN_DISCAPACIDAD +
      cantHijosConDiscapacidad * DEDUCCION_HIJO_CON_DISCAPACIDAD);

  const deducciones =
    deduccionesHijos +
    aportes.aportesJubilatorios +
    aportes.aportesFONASA +
    aportes.aporteFRL +
    (adicionales.aportesFondoSolidaridad ? BPC : 0) +
    (adicionales.adicionalFondoSolidaridad ? ADICIONAL_FONDO_SOLIDARIDAD : 0) +
    adicionales.aportesCJPPU +
    adicionales.otrasDeducciones;

  const tasaDeducciones =
    salarioEnBPC > 15
      ? TASA_DEDUCCIONES_DESDE15BPC
      : TASA_DEDUCCIONES_HASTA15BPC;

  const detalleIRPF = { impuestoFranja: [] };

  IRPF_FRANJAS.forEach((franja) => {
    const hasta = franja.hasta !== 0 ? franja.hasta : Infinity;
    if (salarioAjustado > franja.desde * BPC) {
      const impuesto =
        (Math.min(hasta * BPC, salarioAjustado) - franja.desde * BPC) *
        franja.tasa *
        0.01;
      detalleIRPF.impuestoFranja.push(parseFloat(impuesto.toFixed(2)) as never);
    } else {
      detalleIRPF.impuestoFranja.push(0 as never);
    }
  });

  const totalIRPF = Math.max(
    0,
    detalleIRPF.impuestoFranja.reduce((a, b) => a + b, 0) -
      deducciones * tasaDeducciones * 0.01
  );
  return { detalleIRPF, totalIRPF };
};

const calcularSalarioEnBPC = (salarioNominal: number) => salarioNominal / BPC;

export { useSalaryCalculator };
