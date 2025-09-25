import { NextApiRequest, NextApiResponse } from "next";
import { backendConfig } from "../../../config/supertokens";
import { middleware } from "supertokens-node/framework/express";
import { createHandler } from "supertokens-node/nextjs";

backendConfig();

export default createHandler(
  // Handle all SuperTokens authentication routes
  // This includes /auth/signin, /auth/signup, /auth/signout, etc.
);