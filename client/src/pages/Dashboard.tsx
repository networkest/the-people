import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Wallet, Users, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const paymentHistoryQuery = trpc.payment.getPaymentHistory.useQuery();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/logo_fcf800f3.jpg" alt="the.people" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-slate-800">the.people</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Welcome, {user?.name || "Member"}</span>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Member Dashboard</h1>
          <p className="text-slate-600">Manage your contributions and view collective statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Your Contributions</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">$0.00</p>
              </div>
              <Wallet className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Collective Pool</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">${paymentHistoryQuery.data?.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2) || "0.00"}</p>
              </div>
              <Users className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Interest Earned</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">$0.00</p>
              </div>
              <TrendingUp className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Members</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">1+</p>
              </div>
              <Users className="h-12 w-12 text-red-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Membership Section */}
          <Card className="p-8 bg-white border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Membership Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Status</p>
                <p className="text-lg font-semibold text-slate-900">Not Yet a Member</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Joining Fee</p>
                <p className="text-lg font-semibold text-slate-900">$50.00</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                Complete Membership
              </Button>
            </div>
          </Card>

          {/* Contribution Settings */}
          <Card className="p-8 bg-white border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contribution Settings</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Monthly Subscription</p>
                <p className="text-lg font-semibold text-slate-900">$20.00</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Income Contribution %</p>
                <p className="text-lg font-semibold text-slate-900">Not Set</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 mt-6">
                Configure Contributions
              </Button>
            </div>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-slate-100 border-slate-300">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Contribution History</h3>
            <p className="text-slate-600">Track all your contributions and payment history</p>
          </Card>
          <Card className="p-8 bg-slate-100 border-slate-300">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Fund Growth Chart</h3>
            <p className="text-slate-600">Visualize how the collective pool grows over time</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
