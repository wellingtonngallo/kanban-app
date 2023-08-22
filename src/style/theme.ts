import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(
  {
    config: {
      initialColorMode: "light",
    },
    styles: {
      global: (props: { colorMode: string }) => ({
        body: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
        },
      }),
    },
  },
  withDefaultColorScheme({
    colorScheme: "gray",
    components: ["Button", "Input", "Spinner", "Card"],
  }),
);
export default theme;
