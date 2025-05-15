"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, HelpCircle, FileQuestion } from "lucide-react";
import { Header } from "../_components/header";
import { useTranslations } from "use-intl";
import { useLocaleFromUrl } from "@/hooks/useLocaleFromUrl";

export default function SupportPage() {
  const t = useTranslations("support");
  useLocaleFromUrl();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("contact.title")}
                </CardTitle>
                <CardDescription>{t("contact.description")}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <a href="https://t.me/turbosmm_admin" target="_blank" rel="noopener noreferrer">
                    {t("contact.button")}
                  </a>
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {t("faq.title")}
                  </CardTitle>
                  <CardDescription>{t("faq.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {t.raw("faq.questions").map((question: { title: string; answer: string }, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{question.title}</h3>
                        <p className="text-sm text-muted-foreground">{question.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("faq.button")}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    {t("knowledgeBase.title")}
                  </CardTitle>
                  <CardDescription>{t("knowledgeBase.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {t.raw("knowledgeBase.articles").map((article: { title: string; description: string }, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("knowledgeBase.button")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}