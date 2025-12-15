import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ClipboardCheck, TrendingUp, MessageSquare } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                ETA
              </span>
            </div>
            <span className="font-semibold text-lg">{t("common.appName")}</span>
          </div>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/modules">
              <Button variant="ghost">{t("nav.modules")}</Button>
            </Link>
            <Link href="/auth/login">
              <Button>{t("nav.signIn")}</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="font-bold text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {t("home.heroSubtitle")}
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg">{t("home.getStarted")}</Button>
              </Link>
              <Link href="/modules">
                <Button variant="outline" size="lg">
                  {t("home.learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("home.features.modules.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t("home.features.modules.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ClipboardCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("home.features.assessments.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t("home.features.assessments.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("home.features.progress.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t("home.features.progress.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t("home.features.coaching.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t("home.features.coaching.description")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container py-16 md:py-24 bg-muted/50 rounded-lg">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="font-bold text-2xl md:text-3xl mb-4">
              {t("modules.phase1")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 mt-8">
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    <CardTitle className="text-lg">
                      {t("modules.module1.title")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t("modules.module1.description")}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </span>
                    <CardTitle className="text-lg">
                      {t("modules.module2.title")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t("modules.module2.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Children&apos;s Hospital of Philadelphia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
