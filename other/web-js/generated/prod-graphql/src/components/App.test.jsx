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
  expect(screen.queryByText(/Welcome!/i)).toBeInTheDocument();
});

test("allows you to sign up for a new account", async () => {
  const { user } = setup(<App />);
  await user.click(screen.queryByText(/Sign up for an account/i));
  await user.type(screen.queryByLabelText("Email Address"), TEST_USERNAME);
  await user.type(screen.queryByLabelText("Password"), "aa");
  await user.click(screen.queryByTestId("submit-button"));
  await waitFor(
    () => {
      expect(
        screen.queryByText(/Password must be between 6 and 128 characters./i)
      ).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
  await user.clear(screen.queryByLabelText("Password"));
  await user.type(screen.queryByLabelText("Password"), TEST_PASSWORD);
  await user.click(screen.queryByTestId("submit-button"));
  await wait(10);
  await waitFor(
    () => {
      expect(screen.queryByText(/You have 0 To-Do Items/i)).toBeInTheDocument();
    },
    { timeout: 7000 }
  );
  await user.click(screen.queryByText(/Log out/i));
  await waitFor(
    () => {
      expect(screen.queryByText(/Welcome!/i)).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
}, 12000);

test("allows you to log in with an existing account", async () => {
  const { user } = setup(<App />);
  const logOutButton = screen.queryByText(/Log out/i);
  if (logOutButton) {
    await user.click(logOutButton);
  }
  expect(screen.queryByText(/Welcome!/i)).toBeInTheDocument();
  await user.type(screen.queryByLabelText("Email Address"), TEST_USERNAME);
  await user.type(screen.queryByLabelText("Password"), TEST_PASSWORD);
  await user.click(screen.queryByTestId("submit-button"));
  await waitFor(
    () => {
      expect(
        screen.queryByText(/You have (.+) To-Do Item(s?)/i)
      ).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
}, 7000);

test("allows you to CRUD to-do items", async () => {
  const { user } = setup(<App />);
  await waitFor(
    () => {
      expect(screen.queryByText(/You have 0 To-Do Items/i)).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
  // Add the first To-Do
  await user.click(screen.queryByText(/Add To-Do/i));
  await user.type(
    screen.queryByPlaceholderText("What needs doing?"),
    "Do the dishes"
  );
  await user.click(screen.queryByText(/Save/i));
  await wait(10);
  await waitFor(
    () => {
      expect(
        screen.queryByPlaceholderText("What needs doing?")
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/You have 1 To-Do Item/i)).toBeInTheDocument();
      expect(screen.queryByText(/Do the dishes/i)).toBeInTheDocument();
    },
    { timeout: 10000 }
  );
  // Add a second To-Do
  await user.click(screen.queryByText(/Add To-Do/i));
  await user.type(
    screen.queryByPlaceholderText("What needs doing?"),
    "Do the laundry"
  );
  await user.click(screen.queryByText(/Save/i));
  await wait(10);
  await waitFor(
    () => {
      expect(
        screen.queryByPlaceholderText("What needs doing?")
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/You have 2 To-Do Items/i)).toBeInTheDocument();
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
  await wait(10);
  await waitFor(
    () => {
      expect(screen.queryByText(/You have 1 To-Do Item/i)).toBeInTheDocument();
      expect(screen.queryByText(/Do the laundry/i)).toBeInTheDocument();
    },
    { timeout: 10000 }
  );
}, 33000);

test("allows you to log out", async () => {
  const { user } = setup(<App />);
  const logoutButton = screen.queryByText(/Log out/i);
  expect(logoutButton).toBeInTheDocument();
  await user.click(logoutButton);
  await waitFor(
    () => {
      expect(screen.queryByText(/Welcome!/i)).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
});
