import WeekWorkingHours from "@/components/week-working-hours";

export default function Home() {
  return (
    <main className="container max-w-7xl pb-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-6 mb-4">
        Shadcn week working hours
      </h1>
      <div className="border-border rounded-md border p-3">
        <WeekWorkingHours />
      </div>
    </main>
  );
}
