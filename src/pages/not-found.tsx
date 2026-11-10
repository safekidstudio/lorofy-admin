import { ArrowLeft, Compass, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="grid flex-1 place-items-center py-10">
      <div className="grid max-w-md justify-items-center gap-4 text-center">
        <div className="relative grid size-24 place-items-center rounded-3xl border bg-card shadow-sm">
          <Compass className="size-10 text-primary" />
          <span className="absolute -top-2 -right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            404
          </span>
        </div>
        <div className="grid gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved. Check
            the URL or return to dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Go Back
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
