import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

// Основной блок тестов для Todo приложения
describe("Todo App", () => {
  // Тест 1: Проверяет, что приложение рендерится корректно
  test("renders the app", () => {
    render(<App />); // Рендерим компонент App
    // Проверяем, что заголовок "Todo App" присутствует в документе
    expect(screen.getByText("Todo App")).toBeInTheDocument();
  });

  // Тест 2: Проверяет добавление новой задачи
  test("adds a new todo", () => {
    render(<App />);
    // Находим поле ввода по метке
    const input = screen.getByLabelText("What needs to be done?");
    // Имитируем ввод текста и нажатие Enter
    fireEvent.change(input, { target: { value: "Test todo" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
    // Проверяем, что новая задача появилась в списке
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  // Тест 3: Проверяет переключение статуса задачи (выполнено/не выполнено)
  test("toggles todo completion", () => {
    render(<App />);
    const input = screen.getByLabelText("What needs to be done?");
    // Добавляем новую задачу через userEvent (более реалистичное взаимодействие)
    userEvent.type(input, "Test todo{enter}");

    // Находим чекбокс и проверяем, что он не отмечен
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    // Кликаем по чекбоксу и проверяем изменения
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked(); // Чекбокс должен быть отмечен
    // Текст задачи должен быть перечеркнут
    expect(screen.getByText("Test todo")).toHaveStyle(
      "text-decoration: line-through"
    );
  });

  // Тест 4: Проверяет фильтрацию задач
  test("filters todos", () => {
    render(<App />);
    const input = screen.getByLabelText("What needs to be done?");

    // Добавляем 3 задачи: 2 активные и 1 выполненную
    userEvent.type(input, "Active 1{enter}");
    userEvent.type(input, "Active 2{enter}");
    userEvent.type(input, "Completed 1{enter}");

    // Помечаем последнюю задачу как выполненную
    const checkboxes = screen.getAllByRole("checkbox");
    userEvent.click(checkboxes[2]);

    // Тестируем фильтр "Active"
    userEvent.click(screen.getByText("Active"));
    // Проверяем, что выполненные задачи не отображаются
    expect(screen.queryByText("Completed 1")).not.toBeInTheDocument();
    // А активные - отображаются
    expect(screen.getByText("Active 1")).toBeInTheDocument();
    expect(screen.getByText("Active 2")).toBeInTheDocument();

    // Тестируем фильтр "Completed"
    userEvent.click(screen.getByText("Completed"));
    // Проверяем, что отображается только выполненная задача
    expect(screen.getByText("Completed 1")).toBeInTheDocument();
    // А активные - скрыты
    expect(screen.queryByText("Active 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Active 2")).not.toBeInTheDocument();
  });

  // Тест 5: Проверяет очистку выполненных задач
  test("clears completed todos", () => {
    render(<App />);
    const input = screen.getByLabelText("What needs to be done?");

    // Добавляем две задачи
    userEvent.type(input, "Todo 1{enter}");
    userEvent.type(input, "Todo 2{enter}");

    // Помечаем первую задачу как выполненную
    const checkboxes = screen.getAllByRole("checkbox");
    userEvent.click(checkboxes[0]);

    // Кликаем "Clear completed" и проверяем результат
    userEvent.click(screen.getByText("Clear completed"));
    // Выполненная задача должна исчезнуть
    expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
    // Невыполненная задача должна остаться
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });
});