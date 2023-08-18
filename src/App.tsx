import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "./config/theme";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
