import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useLogin } from "@refinedev/core";
import {
  Mail02Icon,
  SquareLock02Icon,
  PaintBoardIcon,
  UserMultipleIcon,
  ShieldCheckIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { IconGmail, IconGithub } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Beams from "@/components/animates/animate-backgrounds/beams";

const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(5, "Email must be at least 5 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password too long."),
  remember: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutate: login, isPending } = useLogin<SignInFormValues>();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
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
    <div className="relative flex h-[100dvh] max-h-[100dvh] w-full items-center justify-center p-3 sm:p-6 lg:p-8 bg-muted/40 overflow-hidden">
      {/* Edge-to-edge split card: No inner card padding surrounding the black panel */}
      <div className="z-10 w-full max-w-5xl h-full max-h-[680px] flex shadow-2xl rounded-3xl overflow-hidden border border-border bg-card">
        <div className="w-full h-full grid lg:grid-cols-2">
          {/* --- Left Side: Edge-to-edge animated visual panel --- */}
          <div className="hidden lg:flex relative bg-black p-8 lg:p-12 text-white flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Beams
                beamWidth={2}
                beamHeight={15}
                beamNumber={12}
                lightColor="#ffffff"
                speed={2}
                noiseIntensity={1.75}
                scale={0.2}
                rotation={0}
              />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Lorofy Studio
                </div>
                <h1 className="mt-4 text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-tight">
                  Create, Design & Innovate
                </h1>
                <p className="mt-3 text-base text-white/80 leading-relaxed">
                  Unified management console for gamified productivity and companion progression.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: PaintBoardIcon,
                      title: "Smart Categories",
                      desc: "Organize focus categories & habit tags effortlessly.",
                    },
                    {
                      icon: UserMultipleIcon,
                      title: "Real-time Operations",
                      desc: "Live monitoring for users, activity & streaks.",
                    },
                    {
                      icon: ShieldCheckIcon,
                      title: "Enterprise Security",
                      desc: "Role-based access & encrypted credentials.",
                    },
                  ].map(({ icon, title, desc }, i) => (
                    <div key={i} className="flex items-center gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md shadow-xs">
                        <HugeIcon icon={icon} size={20} strokeWidth={2} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm lg:text-base font-semibold text-white">
                          {title}
                        </div>
                        <div className="text-xs lg:text-sm text-white/70">
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-white/50 pt-4">
                © {new Date().getFullYear()} Lorofy. Enterprise Console.
              </div>
            </div>
          </div>

          {/* --- Right Side: Clean Sign-in Form --- */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-12 lg:px-14 overflow-y-auto">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-7 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Sign in to continue your administrative journey
                </p>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-4.5"
                noValidate
              >
                <FieldSet>
                  <FieldGroup className="space-y-4.5">
                    {/* Email Field */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email" className="text-sm font-semibold">
                            Email
                          </FieldLabel>
                          <InputGroup className="h-11 sm:h-12 rounded-xl">
                            <InputGroupAddon>
                              <HugeIcon icon={Mail02Icon} size={19} className="text-muted-foreground" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="email"
                              type="email"
                              placeholder="imphuoctai@gmail.com"
                              autoComplete="email"
                              aria-invalid={fieldState.invalid}
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </InputGroup>
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* Password Field */}
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="password" className="text-sm font-semibold">
                            Password
                          </FieldLabel>
                          <InputGroup className="h-11 sm:h-12 rounded-xl">
                            <InputGroupAddon>
                              <HugeIcon icon={SquareLock02Icon} size={19} className="text-muted-foreground" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              aria-invalid={fieldState.invalid}
                              className="text-sm sm:text-base"
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
                                      icon={showPassword ? ViewIcon : ViewOffSlashIcon}
                                      size={18}
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

                    {/* Remember me & Forgot Password */}
                    <Controller
                      name="remember"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              id="remember-me"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="remember-me"
                              className="text-sm sm:text-base font-medium leading-none text-foreground/85 cursor-pointer select-none"
                            >
                              Remember me
                            </label>
                          </div>

                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Please contact the super administrator to reset credentials.");
                            }}
                            className="text-primary hover:text-primary/80 text-sm sm:text-base font-medium transition-colors"
                          >
                            Forgot password?
                          </a>
                        </div>
                      )}
                    />

                    {/* Form Error Alert */}
                    {formError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive font-medium"
                      >
                        {formError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl mt-2 cursor-pointer shadow-xs"
                      isLoading={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in to your account"}
                    </Button>

                    {/* OAuth Divider */}
                    <div className="flex items-center text-xs text-muted-foreground pt-1">
                      <hr className="border-border flex-1" />
                      <span className="relative px-3 uppercase tracking-wider font-medium text-[11px] text-muted-foreground">
                        Or continue with
                      </span>
                      <hr className="border-border flex-1" />
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="border-border h-11 rounded-xl px-4 text-sm font-medium shadow-xs hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          alert("Google OAuth will be configured with Google Workspace.");
                        }}
                      >
                        <IconGmail className="size-4 shrink-0" />
                        <span className="ml-2 font-medium">Google</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="border-border h-11 rounded-xl px-4 text-sm font-medium shadow-xs hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          alert("GitHub OAuth will be configured with GitHub Organization.");
                        }}
                      >
                        <IconGithub className="size-4 shrink-0" />
                        <span className="ml-2 font-medium">GitHub</span>
                      </Button>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </form>

              <div className="text-muted-foreground mt-6 text-center text-xs sm:text-sm">
                Restricted internal console.{" "}
                <a
                  href="mailto:admin@lorofy.app"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Need user access?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
