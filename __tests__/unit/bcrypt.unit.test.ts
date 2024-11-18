import { bcryptService } from "../../src/adapters/bcrypt.service";

describe("bcrypt", () => {
  it("password should be correct", async () => {
    const pasword = "123123123";
    const hash = await bcryptService.generateHash(pasword);
    const checkPassword = await bcryptService.checkPassword(pasword, hash);
    expect(checkPassword).toBeTruthy();
  });
  it("password shouldn't be correct", async () => {
    const pasword = "123123123";
    const hash = await bcryptService.generateHash(pasword);
    const checkPassword = await bcryptService.checkPassword("22222", hash);
    expect(checkPassword).toBeFalsy();
  });
});
