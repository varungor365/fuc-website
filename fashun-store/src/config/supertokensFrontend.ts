import SuperTokensReact from "supertokens-auth-react";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import SessionReact from "supertokens-auth-react/recipe/session";

export const frontendConfig = () => {
  return SuperTokensReact.init({
    appInfo: {
      appName: "FASHUN.CO",
      apiDomain: "http://localhost:3000",
      websiteDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPasswordReact.init({
        // Custom styling for email/password forms
        style: {
          container: {
            backgroundColor: "rgba(17, 24, 39, 0.8)", // Dark glassmorphism
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
          },
          inputWrapper: {
            marginBottom: "1rem",
          },
          input: {
            backgroundColor: "rgba(31, 41, 55, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "white",
            padding: "0.75rem",
          },
          button: {
            backgroundColor: "#8B5CF6", // Purple primary color
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
          },
        },
      }),
      ThirdPartyReact.init({
        // Social login styling
        style: {
          providerButton: {
            backgroundColor: "rgba(31, 41, 55, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "white",
            marginBottom: "0.5rem",
          },
        },
      }),
      SessionReact.init(),
    ],
  });
};