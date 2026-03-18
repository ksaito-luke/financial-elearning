"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NavbarProps {
  userName?: string | null;
  userRole?: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const t = useTranslations("nav");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <span className="font-semibold text-slate-900">USCMA Prep</span>
          </Link>

          <div className="hidden sm:flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard`}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              {t("dashboard")}
            </Link>
            {userRole === "admin" && (
              <Link
                href={`/${locale}/admin`}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                {t("admin")}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
            <Link
              href={`/en${typeof window !== "undefined" ? window.location.pathname.replace(/^\/(en|ja)/, "") : "/dashboard"}`}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                locale === "en"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              EN
            </Link>
            <Link
              href={`/ja${typeof window !== "undefined" ? window.location.pathname.replace(/^\/(en|ja)/, "") : "/dashboard"}`}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                locale === "ja"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              日本語
            </Link>
          </div>

          {userName && (
            <span className="text-sm text-slate-600 hidden sm:block">
              {userName}
            </span>
          )}

          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            className="text-sm text-slate-600 hover:text-red-600 font-medium transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
}
