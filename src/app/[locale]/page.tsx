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
import { BookOpen, ClipboardCheck, TrendingUp, MessageSquare, Car, Brain, Video, Shield } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg chop-gradient flex items-center justify-center shadow-sm">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[hsl(211,100%,20%)]">ETA Platform</span>
              <span className="text-xs text-muted-foreground">CHOP Research</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/modules">
              <Button variant="ghost" className="text-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,20%,0.1)]">{t("nav.modules")}</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]">{t("nav.signIn")}</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 chop-gradient opacity-5" />
          <div className="container py-20 md:py-28 relative">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
              <div className="phase-badge phase-badge-1 animate-fade-in">
                {t("home.tagline")}
              </div>
              <h1 className="font-bold text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-[hsl(211,100%,20%)] animate-slide-up">
                {t("home.heroTitle")}
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 animate-fade-in">
                {t("home.heroSubtitle")}
              </p>
              <div className="flex gap-4 pt-4 animate-fade-in">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)] px-8">
                    {t("home.getStarted")}
                  </Button>
                </Link>
                <Link href="/modules">
                  <Button variant="outline" size="lg" className="border-[hsl(211,100%,20%)] text-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,20%,0.1)] px-8">
                    {t("home.learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-[hsl(211,100%,20%)] mb-3">
              {t("home.featuresTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.featuresSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="chop-card group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[hsl(211,100%,20%,0.1)] flex items-center justify-center mb-3 group-hover:bg-[hsl(211,100%,20%)] transition-colors">
                  <BookOpen className="h-6 w-6 text-[hsl(211,100%,20%)] group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-[hsl(211,100%,20%)]">{t("home.features.modules.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t("home.features.modules.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="chop-card group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[hsl(145,100%,29%,0.1)] flex items-center justify-center mb-3 group-hover:bg-[hsl(145,100%,29%)] transition-colors">
                  <ClipboardCheck className="h-6 w-6 text-[hsl(145,100%,29%)] group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-[hsl(211,100%,20%)]">{t("home.features.assessments.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t("home.features.assessments.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="chop-card group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[hsl(32,100%,48%,0.1)] flex items-center justify-center mb-3 group-hover:bg-[hsl(32,100%,48%)] transition-colors">
                  <Brain className="h-6 w-6 text-[hsl(32,100%,48%)] group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-[hsl(211,100%,20%)]">{t("home.features.aiCoaching.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t("home.features.aiCoaching.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="chop-card group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[hsl(174,72%,40%,0.1)] flex items-center justify-center mb-3 group-hover:bg-[hsl(174,72%,40%)] transition-colors">
                  <Video className="h-6 w-6 text-[hsl(174,72%,40%)] group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-[hsl(211,100%,20%)]">{t("home.features.telecoaching.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t("home.features.telecoaching.description")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-to-b from-[hsl(211,100%,20%,0.03)] to-[hsl(145,100%,29%,0.03)]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-bold text-2xl md:text-3xl text-[hsl(211,100%,20%)] mb-3">
                {t("home.journeyTitle")}
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="phase-badge phase-badge-1 mb-4">
                  {t("modules.phase1")}
                </div>
                <Card className="module-card">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(211,100%,20%)] text-white font-bold">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)] mb-2">
                        {t("modules.module1.title")}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t("modules.module1.description")}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="module-card">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(211,100%,20%)] text-white font-bold">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)] mb-2">
                        {t("modules.module2.title")}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t("modules.module2.description")}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <div className="phase-badge phase-badge-2 mb-4">
                  {t("modules.phase2")}
                </div>
                <Card className="module-card">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(145,100%,29%)] text-white font-bold">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)] mb-2">
                        {t("modules.module3.title")}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t("modules.module3.description")}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="module-card">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(145,100%,29%)] text-white font-bold">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)] mb-2">
                        {t("modules.module4.title")}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t("modules.module4.description")}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="chop-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-[hsl(211,100%,20%,0.1)] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[hsl(211,100%,20%)]" />
                </div>
                <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)]">{t("home.features.progress.title")}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t("home.features.progress.description")}</p>
            </Card>
            <Card className="chop-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-[hsl(145,100%,29%,0.1)] flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-[hsl(145,100%,29%)]" />
                </div>
                <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)]">{t("home.features.coaching.title")}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t("home.features.coaching.description")}</p>
            </Card>
            <Card className="chop-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-[hsl(32,100%,48%,0.1)] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[hsl(32,100%,48%)]" />
                </div>
                <h3 className="font-semibold text-lg text-[hsl(211,100%,20%)]">{t("home.features.security.title")}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{t("home.features.security.description")}</p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-[hsl(211,100%,20%)] text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">ETA Platform</span>
            </div>
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} Children&apos;s Hospital of Philadelphia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
