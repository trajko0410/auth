"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log(email);

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email.";
  }

  if (password.trim().length < 8) {
    errors.password = "Plese enter password longer than 8 caracters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors: errors,
    };
  }

  const hashedPassword = hashUserPassword(password);

  //console.log(errors);
  try {
    const id = createUser(email, hashedPassword);

    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "Account already exists",
        },
      };
    }
    throw error;
  }
}

export async function login(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existigUser = getUserByEmail(email);
  if (!existigUser) {
    return {
      errors: {
        email: "Account does not exist",
      },
    };
  }

  const isValidPassword = verifyPassword(existigUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        email: "Password is incorect",
      },
    };
  }
  await createAuthSession(existigUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
