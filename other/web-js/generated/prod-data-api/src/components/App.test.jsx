import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const now = Date.now();
const nonce = Math.floor(10000 * Math.random());

const TEST_USERNAME = `test-user-${now}-${nonce}@example.com`;
const TEST_PASSWORD = "Password123";

function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

test("initially renders the login/signup page", () => {
  setup(<App />);
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
});

test("allows you to sign up for a new account", async () => {
  const { user } = setup(<App />);
  await user.click(screen.getByText(/Sign up for an account/i));
  await user.type(screen.getByLabelText("Email Address"), TEST_USERNAME);
  await user.type(screen.getByLabelText("Password"), "aa");
  await user.click(screen.getByTestId("submit-button"));
  await waitFor(
    () => {
      expect(
        screen.getByText(/Password must be between 6 and 128 characters./i)
      ).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
  await user.clear(screen.getByLabelText("Password"));
  await user.type(screen.getByLabelText("Password"), TEST_PASSWORD);
  await user.click(screen.getByTestId("submit-button"));
  await wait(10)
  await waitFor(
    () => {
      expect(screen.getByText(/You have 0 To-Do Items/i)).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
  await user.click(screen.getByText(/Log out/i));
  await waitFor(() => {
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });
}, 10000);

test("allows you to log in with an existing account", async () => {
  const { user } = setup(<App />);
  if (screen.queryByText(/Log out/i)) {
    await user.click(screen.getByText(/Log out/i));
  }
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  await user.type(screen.getByLabelText("Email Address"), TEST_USERNAME);
  await user.type(screen.getByLabelText("Password"), TEST_PASSWORD);
  await user.click(screen.getByTestId("submit-button"));
  await waitFor(
    () => {
      expect(
        screen.getByText(/You have (.+) To-Do Item(s?)/i)
      ).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
}, 7000);

test("allows you to CRUD to-do items", async () => {
  const { user } = setup(<App />);
  await waitFor(() => {
    expect(screen.getByText(/You have 0 To-Do Items/i)).toBeInTheDocument();
  }, { timeout: 4000 });
  // Add the first To-Do
  await user.click(screen.getByText(/Add To-Do/i));
  await user.type(
    screen.getByPlaceholderText("What needs doing?"),
    "Do the dishes"
  );
  await user.click(screen.getByText(/Save/i));
  await wait(10);
  await waitFor(
    () => {
      expect(
        screen.queryByPlaceholderText("What needs doing?")
      ).not.toBeInTheDocument();
      expect(screen.getByText(/You have 1 To-Do Item/i)).toBeInTheDocument();
      expect(screen.getByText(/Do the dishes/i)).toBeInTheDocument();
    },
    { timeout: 10000 }
  );
  // Add a second To-Do
  await user.click(screen.getByText(/Add To-Do/i));
  await user.type(
    screen.getByPlaceholderText("What needs doing?"),
    "Do the laundry"
  );
  await user.click(screen.getByText(/Save/i));
  await wait(10)
  await waitFor(
    () => {
      expect(
        screen.queryByPlaceholderText("What needs doing?")
      ).not.toBeInTheDocument();
      expect(screen.getByText(/You have 2 To-Do Items/i)).toBeInTheDocument();
    },
    { timeout: 8000 }
  );
  // Mark the second To-Do as completed
  const checkboxes = screen
    .getAllByTestId("todo-checkbox")
    .map((el) => el.childNodes[0]);
  expect(checkboxes[0].parentElement).not.toHaveClass("Mui-checked");
  expect(checkboxes[1].parentElement).not.toHaveClass("Mui-checked");
  await user.click(checkboxes[0]);
  await waitFor(
    () => {
      expect(checkboxes[0].parentElement).toHaveClass("Mui-checked");
      expect(checkboxes[1].parentElement).not.toHaveClass("Mui-checked");
    },
    { timeout: 4000 }
  );
  // Delete the first To-Do
  const deleteButtons = screen.getAllByTestId("todo-delete-button");
  expect(deleteButtons.length).toBe(2);
  await user.click(deleteButtons[0]);
  await wait(10)
  await waitFor(
    () => {
      expect(screen.getByText(/You have 1 To-Do Item/i)).toBeInTheDocument();
      expect(screen.getByText(/Do the laundry/i)).toBeInTheDocument();
    },
    { timeout: 10000 }
  );
}, 33000);

test("allows you to log out", async () => {
  const { user } = setup(<App />);
  const logoutButton = screen.queryByText(/Log out/i);
  expect(logoutButton).toBeInTheDocument();
  await user.click(logoutButton);
  await waitFor(() => {
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });
});
