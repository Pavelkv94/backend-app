import { agent } from "supertest";
import { initApp } from "../../src/initApp";

const app = initApp();
export const req = agent(app);
