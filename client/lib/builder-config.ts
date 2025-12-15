// Builder.io Configuration
// You need to set your Builder API Key and Space ID from your Builder.io account
// API Key is available at: https://builder.io/account/settings
// Space ID is your workspace identifier in Builder.io

export const BUILDER_CONFIG = {
  // Replace with your actual Builder API key
  apiKey: process.env.VITE_BUILDER_API_KEY || "YOUR_BUILDER_API_KEY",
  
  // Replace with your actual Builder Space ID
  spaceId: process.env.VITE_BUILDER_SPACE_ID || "YOUR_BUILDER_SPACE_ID",
};

// Builder.io Content URLs patterns
// These are the model names/URLs you'll create in Builder.io
export const BUILDER_MODELS = {
  navbar: "navbar",
  loginPage: "login-page",
  agentsDashboard: "agents-dashboard",
  footer: "footer",
  globalContent: "global-content",
};

// Helper function to build the full Builder.io content URL
export const getBuilderContentUrl = (modelName: string): string => {
  return `${BUILDER_CONFIG.spaceId}/${modelName}`;
};
