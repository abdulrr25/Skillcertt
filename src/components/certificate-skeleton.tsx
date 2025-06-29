import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CertificateSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card/80 shadow-md shadow-black/20">
      <Skeleton className="aspect-[1200/848] w-full" />
      <CardHeader className="pt-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-28" />
      </CardFooter>
    </div>
  );
}
