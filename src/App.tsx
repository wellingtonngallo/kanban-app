import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "./style/theme";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BoardProvider } from "./context/BoardContext";

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <AuthProvider>
            <BoardProvider>
              <AppRoutes />
            </BoardProvider>
          </AuthProvider>
        </DndProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
