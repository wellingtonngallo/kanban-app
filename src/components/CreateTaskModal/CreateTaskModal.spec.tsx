import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { useAuth } from "../../hooks/useAuth";
import { useBoard } from "../../hooks/useBoard";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { CreateTaskModal } from ".";

jest.mock("../../hooks/useAuth");
jest.mock("../../hooks/useBoard");
jest.mock("firebase/firestore");

describe("tests CreateTaskModal", () => {
  const mockHandleModal = jest.fn();
  const mockSetBoards = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "user-uid" } });
    (useBoard as jest.Mock).mockReturnValue({ setBoards: mockSetBoards });
    jest.mock("@chakra-ui/react", () => {
      const actualChakra = jest.requireActual("@chakra-ui/react");
      return {
        ...actualChakra,
        useToast: jest.fn(),
      };
    });
  });

  it("should render modal", () => {
    render(
      <CreateTaskModal
        handleModal={mockHandleModal}
        isOpen={true}
        idBoard="board-id"
      />,
    );

    expect(screen.getByText("Criar tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("should close modal when click in btn", () => {
    render(
      <CreateTaskModal
        handleModal={mockHandleModal}
        isOpen={true}
        idBoard="board-id"
      />,
    );

    fireEvent.click(screen.getByText("Fechar"));

    expect(mockHandleModal).toHaveBeenCalledWith(false);
  });

  it("should create a task", async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: "new-task-id" });

    render(
      <CreateTaskModal
        handleModal={mockHandleModal}
        isOpen={true}
        idBoard="board-id"
      />,
    );

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Tarefa de teste" },
    });
    fireEvent.change(screen.getByLabelText("Descrição"), {
      target: { value: "Descrição de teste" },
    });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(collection(db, "tasks"), {
        name: "Tarefa de teste",
        description: "Descrição de teste",
        author: doc(db, "users", "user-uid"),
      });
    });
  });
});
