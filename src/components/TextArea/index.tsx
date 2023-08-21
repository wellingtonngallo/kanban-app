import React from "react";
import {
  FormControl,
  FormLabel,
  Textarea as ChakraTextarea,
  type TextareaProps as ChakraTextareaProps,
  FormErrorMessage,
} from "@chakra-ui/react";
import { type FieldError } from "react-hook-form";
import { type ForwardRefRenderFunction, forwardRef } from "react";

interface TextAreaProps extends ChakraTextareaProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const TextAreaBase: ForwardRefRenderFunction<
  HTMLInputElement,
  TextAreaProps
> = ({ name, label, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraTextarea
        name={name}
        id={name}
        variant="filled"
        size="lg"
        ref={ref}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const TextArea = forwardRef(TextAreaBase);
