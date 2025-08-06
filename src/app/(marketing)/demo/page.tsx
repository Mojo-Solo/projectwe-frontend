
interface DemoPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { Heading } from "@/components/ui/heading";
import { Motion } from "@/components/ui/motion";
import { designTokens } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";

export const dynamic = 'force-dynamic';

export default function DemoPage() {
  return (
    <PageLayout>
      <div className="py-12 space-y-16">
        <section className="space-y-8">
          <Motion animation="slide-up">
            <Heading level="h1" className="text-center">
              Design System Demo
            </Heading>
            <p className="text-center text-muted-foreground max-w-xl mx-auto">
              This page showcases the components and design tokens used
              throughout the application.
            </p>
          </Motion>
        </section>

        <section className="space-y-8">
          <Motion animation="slide-up" delay={0.1}>
            <Heading level="h2">Typography</Heading>
          </Motion>

          <div className="grid gap-6">
            <Motion animation="slide-up" delay={0.2}>
              <div className="space-y-2">
                <Heading level="h1">Heading 1</Heading>
                <p className="text-muted-foreground">
                  Used for main page titles
                </p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.3}>
              <div className="space-y-2">
                <Heading level="h2">Heading 2</Heading>
                <p className="text-muted-foreground">Used for section titles</p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.4}>
              <div className="space-y-2">
                <Heading level="h3">Heading 3</Heading>
                <p className="text-muted-foreground">
                  Used for subsection titles
                </p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.5}>
              <div className="space-y-2">
                <Heading level="h4">Heading 4</Heading>
                <p className="text-muted-foreground">
                  Used for card titles and minor sections
                </p>
              </div>
            </Motion>
          </div>
        </section>

        <section className="space-y-8">
          <Motion animation="slide-up" delay={0.1}>
            <Heading level="h2">Animation Tokens</Heading>
          </Motion>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Motion animation="slide-up" delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Slide Up</CardTitle>
                  <CardDescription>Fades in while moving up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                    <Motion
                      animation="slide-up"
                      delay={0.2}
                      className="text-center"
                    >
                      <p>This content slides up</p>
                    </Motion>
                  </div>
                </CardContent>
                <CardFooter>
                  <code className="text-sm bg-muted p-2 rounded w-full overflow-x-auto">
                    {'<Motion animation="slide-up">...</Motion>'}
                  </code>
                </CardFooter>
              </Card>
            </Motion>

            <Motion animation="fade" delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>Fade</CardTitle>
                  <CardDescription>Simple fade in animation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                    <Motion
                      animation="fade"
                      delay={0.2}
                      className="text-center"
                    >
                      <p>This content fades in</p>
                    </Motion>
                  </div>
                </CardContent>
                <CardFooter>
                  <code className="text-sm bg-muted p-2 rounded w-full overflow-x-auto">
                    {'<Motion animation="fade">...</Motion>'}
                  </code>
                </CardFooter>
              </Card>
            </Motion>

            <Motion animation="scale" delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle>Scale</CardTitle>
                  <CardDescription>Fades in while scaling up</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                    <Motion
                      animation="scale"
                      delay={0.2}
                      className="text-center"
                    >
                      <p>This content scales in</p>
                    </Motion>
                  </div>
                </CardContent>
                <CardFooter>
                  <code className="text-sm bg-muted p-2 rounded w-full overflow-x-auto">
                    {'<Motion animation="scale">...</Motion>'}
                  </code>
                </CardFooter>
              </Card>
            </Motion>
          </div>
        </section>

        <section className="space-y-8">
          <Motion animation="slide-up" delay={0.1}>
            <Heading level="h2">Spacing & Layout</Heading>
            <p className="text-muted-foreground">
              The design system uses a consistent spacing scale for margin and
              padding values.
            </p>
          </Motion>

          <div className="grid gap-4">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((space) => (
              <Motion key={space}
                animation="slide-up"
                delay={0.1 + space * 0.03}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="bg-primary h-8"
                    style={{ width: `${space * 0.25}rem` }}
                  />
                  <p className="text-sm font-mono">
                    {space} ({space * 4}px / {space * 0.25}rem)
                  </p>
                </div>
              </Motion>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <Motion animation="slide-up" delay={0.1}>
            <Heading level="h2">Buttons & Actions</Heading>
          </Motion>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Motion animation="slide-up" delay={0.2}>
              <div className="space-y-2">
                <Button size="default" variant="default">
                  Default Button
                </Button>
                <p className="text-sm text-muted-foreground">Primary action</p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.3}>
              <div className="space-y-2">
                <Button size="default" variant="secondary">
                  Secondary Button
                </Button>
                <p className="text-sm text-muted-foreground">
                  Secondary action
                </p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.4}>
              <div className="space-y-2">
                <Button size="default" variant="outline">
                  Outline Button
                </Button>
                <p className="text-sm text-muted-foreground">Subtle action</p>
              </div>
            </Motion>

            <Motion animation="slide-up" delay={0.5}>
              <div className="space-y-2">
                <Button size="default" variant="ghost">
                  Ghost Button
                </Button>
                <p className="text-sm text-muted-foreground">
                  Very subtle action
                </p>
              </div>
            </Motion>
          </div>
        </section>

        <section className="space-y-8">
          <Motion animation="slide-up" delay={0.1}>
            <Heading level="h2">Color Tokens</Heading>
            <p className="text-muted-foreground">
              The primary colors used throughout the application.
            </p>
          </Motion>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Motion animation="slide-up" delay={0.2}>
              <Card>
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle>Primary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-primary</code>
                  <br />
                  <code className="text-sm">text-primary-foreground</code>
                </CardContent>
              </Card>
            </Motion>

            <Motion animation="slide-up" delay={0.3}>
              <Card>
                <CardHeader className="bg-secondary text-secondary-foreground">
                  <CardTitle>Secondary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-secondary</code>
                  <br />
                  <code className="text-sm">text-secondary-foreground</code>
                </CardContent>
              </Card>
            </Motion>

            <Motion animation="slide-up" delay={0.4}>
              <Card>
                <CardHeader className="bg-accent text-accent-foreground">
                  <CardTitle>Accent</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-accent</code>
                  <br />
                  <code className="text-sm">text-accent-foreground</code>
                </CardContent>
              </Card>
            </Motion>

            <Motion animation="slide-up" delay={0.5}>
              <Card>
                <CardHeader className="bg-muted text-muted-foreground">
                  <CardTitle>Muted</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-muted</code>
                  <br />
                  <code className="text-sm">text-muted-foreground</code>
                </CardContent>
              </Card>
            </Motion>

            <Motion animation="slide-up" delay={0.6}>
              <Card>
                <CardHeader className="bg-destructive text-destructive-foreground">
                  <CardTitle>Destructive</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-destructive</code>
                  <br />
                  <code className="text-sm">text-destructive-foreground</code>
                </CardContent>
              </Card>
            </Motion>

            <Motion animation="slide-up" delay={0.7}>
              <Card>
                <CardHeader className="bg-card text-card-foreground border-b">
                  <CardTitle>Card</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <code className="text-sm">bg-card</code>
                  <br />
                  <code className="text-sm">text-card-foreground</code>
                </CardContent>
              </Card>
            </Motion>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
