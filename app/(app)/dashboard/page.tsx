export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to OpenLedger. Your financial overview will appear here.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">This Month Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">$0.00</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium text-muted-foreground">This Month Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">$0.00</p>
        </div>
      </div>
    </div>
  );
}
