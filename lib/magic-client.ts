import { Magic } from "magic-sdk";

const createMagic = () => {
  if (typeof window === "undefined") {
    return;
  }
  return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY!);
};

export const magic = createMagic();

export const loginInWithEmail = async (email: string) => {
  try {
    if (magic) {
      const result = await magic.auth.loginWithMagicLink({ email: email });
      return result;
    }
  } catch (error) {
    console.error("something went wrong signing in", error);
  }
};

export const getUserInfo = async () => {
  try {
    if (magic) {
      return await magic.user.getInfo();
    }
  } catch (error) {
    console.error("something went wrong getting user info", error);
  }
};

export const signOutUser = async () => {
  try {
    if (magic) {
      const result = await magic.user.logout();
      return result;
    }
  } catch (error) {
    console.error("something went wrong logging out", error);
  }
};

export const isUserLoggedIn = async () => {
  try {
    if (magic) {
      return await magic.user.isLoggedIn();
    }
  } catch (error) {
    console.error(
      "something went wrong while checking if the user logged in",
      error
    );
  }
};
