export function shared(): string {
  return "shared";
}

export function capitalize(s: string) {
  return s[0].toUpperCase() + s.substring(1).toLowerCase();
}

export function fixNombreLocal(desde: string): string {
  if (!desde) return "";
  return capAll(
    desde
      .trim()
      .replace(/^N?\d+/, "")
      .replace(/-/g, " ")
  );
}

function capAll(s: string): string {
  const words = s.trim().toLowerCase().split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
}

export function ifDebug(...s: any[]): void {
  if (process.env["DEBUG"]) console.log(s.join(" "));
}

export function numericPart(s: string) {
  const m = /(\d+)/.exec(s);
  if (!m) return s;
  return m[1];
}

export function genCodSeguridad(): number {
  return randomIntFromInterval(100000, 999999);
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const messages: Record<string, string> = {
  RPA002: "El email no está registrado en nuestro sistema",
  RPA001:
    "Hemos enviado a su correo electrónico las instrucciones para recuperar su contraseña",
};
export function errMessage(code: string): string {
  return messages[code];
}
