import { BcryptService } from "../../src/adapters/bcrypt.service";
import { container } from "../../src/composition.root";

const bcryptService = container.get(BcryptService);

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
