import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";

export const backendConfig = () => {
  return SuperTokens.init({
    framework: "express",
    supertokens: {
      // For self-hosted setup, you'll need to run SuperTokens core
      // connectionURI: "http://localhost:3567", // SuperTokens core service
      // For managed service (easier for development):
      connectionURI: "https://try.supertokens.com",
      // Replace with your actual API key in production
      apiKey: process.env.SUPERTOKENS_API_KEY || "development-key",
    },
    appInfo: {
      appName: "FASHUN.CO",
      apiDomain: "http://localhost:3000",
      websiteDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        // Email password configuration
        signUpFeature: {
          formFields: [
            {
              id: "email",
              validate: async (value) => {
                if (typeof value !== "string") {
                  return "Please enter a valid email";
                }
                // Basic email validation
                if (!value.includes("@")) {
                  return "Please enter a valid email";
                }
                return undefined;
              },
            },
            {
              id: "password",
              validate: async (value) => {
                if (typeof value !== "string") {
                  return "Please enter a valid password";
                }
                if (value.length < 8) {
                  return "Password must be at least 8 characters long";
                }
                return undefined;
              },
            },
          ],
        },
      }),
      ThirdParty.init({
        // Social login providers
        signInAndUpFeature: {
          providers: [
            {
              config: {
                thirdPartyId: "google",
                clients: [
                  {
                    clientId: process.env.GOOGLE_CLIENT_ID || "",
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: "github",
                clients: [
                  {
                    clientId: process.env.GITHUB_CLIENT_ID || "",
                    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
                  },
                ],
              },
            },
          ],
        },
      }),
      Session.init({
        // Session configuration
        cookieSecure: process.env.NODE_ENV === "production",
        cookieSameSite: "lax",
      }),
    ],
  });
};