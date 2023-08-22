import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { useAuth } from "../../hooks/useAuth";
import { useBoard } from "../../hooks/useBoard";
import { CardDetailsModal } from ".";
import { type TaskProps } from "../../interfaces/ITasks";

jest.mock("../../hooks/useAuth");
jest.mock("../../hooks/useBoard");
jest.mock("firebase/firestore");

describe("tests CardDetailsModal", () => {
  const mockHandleModal = jest.fn();
  const mockSetBoards = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "user-uid" } });
    (useBoard as jest.Mock).mockReturnValue({ setBoards: mockSetBoards });
  });

  it("should render modal content", () => {
    render(
      <CardDetailsModal
        handleModal={mockHandleModal}
        isOpen={true}
        task={{ taskId: "task-id", isBlocked: false } as TaskProps}
        authorInfo={{
          uid: "author-uid",
          displayName: "Gallo",
          photoUrl: "photo-url",
        }}
      />,
    );

    expect(screen.getByText("Detalhes da tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("should close modal when click in button", () => {
    render(
      <CardDetailsModal
        handleModal={mockHandleModal}
        isOpen={true}
        task={{ taskId: "task-id", isBlocked: false } as TaskProps}
        authorInfo={{
          uid: "author-uid",
          displayName: "Gallo",
          photoUrl: "photo-url",
        }}
      />,
    );

    fireEvent.click(screen.getByLabelText("Close"));
    expect(mockHandleModal).toHaveBeenCalledWith(false);
  });
});
