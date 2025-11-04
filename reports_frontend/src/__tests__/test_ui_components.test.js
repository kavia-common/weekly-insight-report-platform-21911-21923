import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button, Input, Modal, Badge } from "../components/ui";

describe("UI components", () => {
  test("Button renders with text and triggers onClick", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("Button disabled prevents click", () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole("button", { name: /disabled/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("Input shows label, reflects value and change", () => {
    const handleChange = jest.fn();
    render(<Input label="Email" value="a@b.com" onChange={handleChange} />);
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    const textbox = screen.getByRole("textbox");
    expect(textbox).toHaveValue("a@b.com");
    fireEvent.change(textbox, { target: { value: "x@y.com" } });
    expect(handleChange).toHaveBeenCalled();
  });

  test("Modal renders when open=true and closes on overlay click", () => {
    const onClose = jest.fn();
    render(
      <Modal title="Confirm" open={true} onClose={onClose} actions={<Button>OK</Button>}>
        Content
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: /confirm/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  test("Badge renders with children text", () => {
    render(<Badge color="error">Error</Badge>);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
