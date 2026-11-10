import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useLogin } from "@refinedev/core";
import {
  Mail02Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffSlashIcon,
  Leaf01Icon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(5, "Email must be at least 5 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password too long."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

const HIGHLIGHTS = [
  {
    icon: Leaf01Icon,
    title: "Grow the mascot garden",
    description: "Create, balance and publish companions.",
  },
  {
    icon: SparklesIcon,
    title: "Shape the journey",
    description: "Tune categories, badges and rewards.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Keep it safe",
    description: "Role-based access for your whole team.",
  },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutate: login, isPending } = useLogin<SignInFormValues>();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = handleSubmit(async (values) => {
    setFormError(null);
    login(values, {
      onSuccess: (result) => {
        if (!result.success) {
          setFormError(result.error?.message ?? "Sign in failed.");
        }
      },
      onError: (error) => {
        setFormError(error.message || "Sign in failed.");
      },
    });
  });

  const isLoading = isPending || isSubmitting;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-background p-3 sm:p-5 lg:p-6">
      {/* Soft garden glows behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-[-10rem] size-[28rem] rounded-full bg-[#c9e8c0]/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 size-[26rem] rounded-full bg-[#f4d9a5]/50 blur-3xl"
      />

      <div className="relative z-10 flex h-full max-h-[45rem] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-card shadow-[0_40px_120px_-60px_rgba(7,27,18,0.55)] ring-1 ring-black/5 sm:rounded-[2.5rem]">
        <div className="grid h-full min-h-0 w-full lg:grid-cols-[1.05fr_1fr]">
          {/* Brand panel */}
          <section className="relative hidden flex-col justify-between overflow-hidden bg-[#071B12] p-7 text-white lg:flex xl:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#1f9d55]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-[#e9a23b]/20 blur-3xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/20">
                  <img
                    src="/lorofy.png"
                    alt="Lorofy"
                    className="size-full object-contain"
                    draggable={false}
                  />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-3xl tracking-wide text-white">
                    Lorofy
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Admin Console
                  </span>
                </div>
              </div>

              <h1 className="mt-8 max-w-sm font-display text-4xl leading-[0.95] tracking-wide text-white xl:mt-10 xl:text-5xl">
                Grow something good today.
              </h1>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/65">
                One calm place to look after the people, mascots and little
                rituals that make Lorofy feel alive.
              </p>

              <div className="mt-6 grid gap-3">
                {HIGHLIGHTS.map(({ icon, title, description }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#b9e7ae] ring-1 ring-white/10">
                      <HugeIcon icon={icon} size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-6 text-[11px] text-white/35">
              <span>© {new Date().getFullYear()} Lorofy</span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Made for focused people
              </span>
            </div>
          </section>

          {/* Sign-in form */}
          <section className="flex min-h-0 flex-col overflow-y-auto px-5 py-6 sm:px-10 lg:px-12">
            <div className="mx-auto my-auto w-full max-w-sm">
              <div className="mb-5 lg:hidden">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-11 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
                    <img
                      src="/lorofy.png"
                      alt="Lorofy"
                      className="size-full object-contain"
                      draggable={false}
                    />
                  </span>
                  <span className="font-display text-3xl tracking-wide">
                    Lorofy
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Admin access
                </p>
                <h2 className="mt-1.5 font-display text-3xl leading-none tracking-wide text-foreground xl:text-4xl">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Sign in to keep the Lorofy garden growing.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                <FieldSet>
                  <FieldGroup className="space-y-4">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="email"
                            className="text-[0.8rem] font-semibold text-foreground/80"
                          >
                            Email
                          </FieldLabel>
                          <InputGroup className="h-11 rounded-full border-border bg-muted/40 px-4 focus-within:bg-card">
                            <InputGroupAddon>
                              <HugeIcon
                                icon={Mail02Icon}
                                size={18}
                                className="text-muted-foreground"
                              />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="email"
                              type="email"
                              placeholder="you@lorofy.space"
                              autoComplete="email"
                              aria-invalid={fieldState.invalid}
                              className="text-sm"
                              {...field}
                            />
                          </InputGroup>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="password"
                            className="text-[0.8rem] font-semibold text-foreground/80"
                          >
                            Password
                          </FieldLabel>
                          <InputGroup className="h-11 rounded-full border-border bg-muted/40 px-4 focus-within:bg-card">
                            <InputGroupAddon>
                              <HugeIcon
                                icon={SquareLock02Icon}
                                size={18}
                                className="text-muted-foreground"
                              />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              aria-invalid={fieldState.invalid}
                              className="text-sm"
                              {...field}
                            />
                            <InputGroupAddon align="inline-end">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    aria-label="Toggle password visibility"
                                    size="icon-xs"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    <HugeIcon
                                      icon={
                                        showPassword ? ViewIcon : ViewOffSlashIcon
                                      }
                                      size={17}
                                    />
                                  </InputGroupButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">
                                    {showPassword
                                      ? "Hide password"
                                      : "Show password"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {formError && (
                      <div
                        role="alert"
                        className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
                      >
                        {formError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 w-full rounded-full text-[0.95rem] font-semibold shadow-sm"
                      isLoading={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </FieldGroup>
                </FieldSet>
              </form>

              <div className="mt-5 rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                This console is for the Lorofy team. Need access?{" "}
                <a
                  href="mailto:admin@lorofy.space"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Talk to a super admin
                </a>
                .
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
