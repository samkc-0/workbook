export function template(
  strings: TemplateStringsArray,
  ...keys: number[]
): (...values: string[]) => string {
  return (...values) => {
    const dict = values[values.length - 1] || [];
    const result: string[] = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}

export const Texts = {
  LOADING: "Cargando...",
  GO_BACK: "Regresar",
  PRESS: "Presiona",
  YOU_WON: "¡Ganaste!",
  YOU_LOST: "¡Perdiste!",
  EXERCISES: template`Ejercicios para ${0} aparecerán aquí.`,
};
