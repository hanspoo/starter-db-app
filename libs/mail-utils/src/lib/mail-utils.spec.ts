import { cleanupEmail, isValidEmail } from "../lib/mail-utils";

const email = "admin@myapp.com";
describe("email utils", () => {
  describe("cleanup", () => {
    it("debe eliminar blancos al princicio", () => {
      expect(cleanupEmail("   admin@myapp.com")).toBe(email);
    });
    it("debe eliminar blancos al final", () => {
      expect(cleanupEmail("admin@myapp.com   ")).toBe(email);
    });
    it("debe convertir a minúsculas", () => {
      expect(cleanupEmail("ADMIN@myapp.com   ")).toBe(email);
    });
  });
  describe("valid email", () => {
    it("es valido email correcto", () => {
      expect(isValidEmail(email)).toBe(true);
    });
    it("debe tener formato email", () => {
      expect(isValidEmail("")).toBe(false);
    });
    it("debe tener arroba", () => {
      expect(isValidEmail("@")).toBe(false);
    });
    it("debe tener antes y despues arroba", () => {
      expect(isValidEmail("@xxx")).toBe(false);
    });
    it("es dominio debe tener dos partes al menos", () => {
      expect(isValidEmail("aaa@xxx")).toBe(false);
    });
    it("es dominio debe tener dos partes al menos", () => {
      expect(isValidEmail("aaa@xxx.cl")).toBe(true);
    });
    it("es dominio puede tener 3 partes", () => {
      expect(isValidEmail("aaa@xxx.yyy.cl")).toBe(true);
    });
    it("no puede contener espacios", () => {
      expect(isValidEmail("aaa@xxx .yyy.cl")).toBe(false);
    });
  });
});
