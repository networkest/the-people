import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"welcome" | "contribution" | "payment">("welcome");
  const [contributionPercentage, setContributionPercentage] = useState("5");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const joiningFeeCheckout = trpc.payment.createJoiningFeeCheckout.useMutation();
  const monthlySubscriptionCheckout = trpc.payment.createMonthlySubscriptionCheckout.useMutation();
  const recurringContributionCheckout = trpc.payment.createRecurringContributionCheckout.useMutation();

  const handleJoiningFeePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await joiningFeeCheckout.mutateAsync();
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecting to payment page...");
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMonthlySubscription = async () => {
    setIsProcessing(true);
    try {
      const result = await monthlySubscriptionCheckout.mutateAsync();
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecting to subscription page...");
      }
    } catch (error) {
      toast.error("Failed to create subscription session");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecurringContribution = async () => {
    setIsProcessing(true);
    try {
      const percentage = parseFloat(contributionPercentage);
      if (isNaN(percentage) || percentage < 0.1 || percentage > 100) {
        toast.error("Please enter a valid percentage between 0.1 and 100");
        setIsProcessing(false);
        return;
      }

      // Estimate monthly amount (assuming $3000/month average income)
      const estimatedMonthlyAmount = (3000 * percentage) / 100;

      const result = await recurringContributionCheckout.mutateAsync({
        percentage,
        estimatedMonthlyAmount,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecting to contribution setup...");
      }
    } catch (error) {
      toast.error("Failed to create contribution session");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/logo_fcf800f3.jpg" alt="the.people" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-slate-800">the.people</span>
          </div>
          <span className="text-slate-600">Welcome, {user?.name || "Member"}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step === "welcome" || step === "contribution" || step === "payment" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-center text-sm mt-2 font-semibold">Welcome</p>
            </div>
            <div className={`flex-1 h-1 ${step === "contribution" || step === "payment" ? "bg-blue-600" : "bg-slate-200"}`}></div>
            <div className="flex-1">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step === "contribution" || step === "payment" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>
                {step === "contribution" || step === "payment" ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-semibold">2</span>}
              </div>
              <p className="text-center text-sm mt-2 font-semibold">Contribution</p>
            </div>
            <div className={`flex-1 h-1 ${step === "payment" ? "bg-blue-600" : "bg-slate-200"}`}></div>
            <div className="flex-1">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step === "payment" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>
                <span className="text-sm font-semibold">3</span>
              </div>
              <p className="text-center text-sm mt-2 font-semibold">Payment</p>
            </div>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === "welcome" && (
          <Card className="p-8 bg-white border-slate-200 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Join the Collective</h1>
            <p className="text-slate-600 mb-6">
              Welcome to the.people! You're about to become part of a community where we pool our resources and live off collective interest.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">Here's what you'll do:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</span>
                  <span className="text-slate-700">Pay a one-time joining fee of <strong>$50</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</span>
                  <span className="text-slate-700">Set up a monthly subscription of <strong>$20</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</span>
                  <span className="text-slate-700">Configure your income contribution percentage</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setStep("contribution")}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Setup
            </Button>
          </Card>
        )}

        {/* Step 2: Contribution Setup */}
        {step === "contribution" && (
          <Card className="p-8 bg-white border-slate-200 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Set Your Contribution</h1>
            <p className="text-slate-600 mb-8">
              Choose what percentage of your income you'd like to contribute to the collective pool.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <Label htmlFor="percentage" className="text-base font-semibold mb-2 block">
                  Income Contribution Percentage (%)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="percentage"
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={contributionPercentage}
                    onChange={(e) => setContributionPercentage(e.target.value)}
                    className="flex-1"
                    placeholder="Enter percentage"
                  />
                  <span className="text-2xl font-bold text-blue-600">%</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Estimated monthly contribution: ${((3000 * parseFloat(contributionPercentage)) / 100).toFixed(2)} (based on $3000 monthly income)
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <strong>Note:</strong> You can adjust your contribution percentage anytime. This is an estimate based on average income.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep("welcome")}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("payment")}
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <Card className="p-8 bg-white border-slate-200">
              <h1 className="text-3xl font-bold text-slate-900 mb-6">Complete Your Registration</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Joining Fee</span>
                  <span className="font-bold text-slate-900">$50.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Monthly Subscription</span>
                  <span className="font-bold text-slate-900">$20.00</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Income Contribution ({contributionPercentage}%)</span>
                  <span className="font-bold text-slate-900">${((3000 * parseFloat(contributionPercentage)) / 100).toFixed(2)}/mo</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-slate-700">
                  <strong>Secure Payment:</strong> All payments are processed securely through Stripe. Your payment information is never stored on our servers.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleJoiningFeePayment}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Pay Joining Fee ($50)
                </Button>
                <Button
                  onClick={handleMonthlySubscription}
                  disabled={isProcessing}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Set Up Monthly Subscription ($20)
                </Button>
                <Button
                  onClick={handleRecurringContribution}
                  disabled={isProcessing}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Set Up Income Contribution
                </Button>
              </div>

              <Button
                onClick={() => setStep("contribution")}
                variant="ghost"
                size="lg"
                className="w-full mt-4"
              >
                Back
              </Button>
            </Card>

            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Test Card Information</h3>
                  <p className="text-sm text-yellow-800">
                    Use card number <code className="bg-white px-2 py-1 rounded">4242 4242 4242 4242</code> with any future expiry date and any CVC to test payments.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
