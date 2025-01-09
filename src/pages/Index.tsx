const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="dashboard-card space-y-6 text-center">
          <h1 className="bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
            Welcome to Your CRM Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Start managing your clients and business relationships efficiently
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="metric-card">
              <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
              <p className="text-muted-foreground">
                Streamline your client interactions
              </p>
            </div>
            <div className="metric-card">
              <h3 className="text-xl font-semibold mb-2">Powerful Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights from your data
              </p>
            </div>
            <div className="metric-card">
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data is safe with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;