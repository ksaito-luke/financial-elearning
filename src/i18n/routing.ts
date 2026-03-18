import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ja"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/login": "/login",
    "/dashboard": "/dashboard",
    "/quiz/[subject]": "/quiz/[subject]",
    "/admin": "/admin",
    "/admin/questions": "/admin/questions",
  },
});
