import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import * as useAuthModule from "../../hooks/useAuth";
import * as useSearchModule from "../../hooks/useSearch";
import { Header } from ".";
import { type AuthContextData } from "../../context/AuthContext";

describe("tests Header", () => {
  beforeEach(() => {
    const useAuthMock = jest.spyOn(useAuthModule, "useAuth");
    useAuthMock.mockReturnValue({
      user: {
        displayName: "Gallo",
        photoUrl: "https://via.placeholder.com/40",
      },
    } as AuthContextData);
  });

  it("should renders title", () => {
    render(<Header />);

    const titleElement = screen.getByRole("heading", { name: /Kanban APP/i });

    expect(titleElement).toBeInTheDocument();
  });

  it("should render displayName", () => {
    render(<Header />);

    const displayNameElement = screen.getByText("Gallo");

    expect(displayNameElement).toBeInTheDocument();
  });

  it("should render photo", () => {
    render(<Header />);

    const photoElement = screen.getByRole("img", { name: /Foto do usuário/i });

    expect(photoElement).toHaveAttribute(
      "src",
      "https://via.placeholder.com/40",
    );
  });

  it("should test typing in input", () => {
    const setSearchTaskMock = jest.spyOn(useSearchModule, "useSearch");
    const setSearchTask = jest.fn();

    setSearchTaskMock.mockReturnValue({
      setSearchTask,
      searchTask: "",
    });

    render(<Header />);

    const searchInput = screen.getByPlaceholderText("Buscar tarefa");
    fireEvent.change(searchInput, { target: { value: "Teste kanban-app" } });

    expect(setSearchTask).toHaveBeenCalledWith("teste kanban-app");
  });
});
