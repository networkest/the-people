import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Wallet, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/register");
    } else {
      startLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/logo_fcf800f3.jpg" alt="the.people" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-slate-800">the.people</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/register")} variant="default">
                Complete Membership
              </Button>
            ) : (
              <Button onClick={handleGetStarted} variant="default">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  by the people, with the people and for the people
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  we just join our funds together until...there's enough to pay for everyone's meal!
                </p>
              </div>

              <p className="text-lg text-slate-700 leading-relaxed max-w-lg">
                Join a collective where community members pool a percentage of their income into a shared high-interest account. Everyone lives off the accumulated interest together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  Join the Collective <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  size="lg"
                  variant="outline"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right: Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur-3xl opacity-20"></div>
                <img
                  src="/manus-storage/logo_fcf800f3.jpg"
                  alt="the.people community"
                  className="relative h-80 w-80 rounded-full shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A simple three-step model for collective prosperity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="bg-slate-800 border-slate-700 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <div className="bg-yellow-500 rounded-full p-4">
                  <Wallet className="h-8 w-8 text-slate-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 1: Contribute</h3>
              <p className="text-slate-300 mb-4">
                Members set their own contribution percentage and join the collective. One-time joining fee gets you started.
              </p>
              <div className="text-sm text-slate-400">Monthly subscription + recurring contributions</div>
            </Card>

            {/* Step 2 */}
            <Card className="bg-slate-800 border-slate-700 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <div className="bg-green-500 rounded-full p-4">
                  <TrendingUp className="h-8 w-8 text-slate-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 2: Pool & Grow</h3>
              <p className="text-slate-300 mb-4">
                All contributions flow into a shared high-interest account. Your money works for the collective, earning compound interest.
              </p>
              <div className="text-sm text-slate-400">Transparent tracking & real-time updates</div>
            </Card>

            {/* Step 3 */}
            <Card className="bg-slate-800 border-slate-700 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mb-6 flex justify-center">
                <div className="bg-red-500 rounded-full p-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 3: Live Together</h3>
              <p className="text-slate-300 mb-4">
                Everyone lives off the collective interest earned. Withdraw anytime, participate in community decisions.
              </p>
              <div className="text-sm text-slate-400">Democratic & inclusive governance</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Why Join the Collective?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Community-Driven</h3>
                  <p className="text-slate-600">Make decisions together with transparent voting and governance.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">High-Interest Growth</h3>
                  <p className="text-slate-600">Your money grows exponentially through compound interest.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Flexible Contributions</h3>
                  <p className="text-slate-600">Set your own percentage and adjust anytime. Full transparency.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Active Forum</h3>
                  <p className="text-slate-600">Discuss ideas, share experiences, and build community together.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Get Started Today</h3>
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                  <div>
                    <p className="font-semibold">Sign up for free</p>
                    <p className="text-sm text-slate-600">Create your account in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-600">2</span>
                  <div>
                    <p className="font-semibold">Pay joining fee</p>
                    <p className="text-sm text-slate-600">Secure payment via Stripe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-red-600">3</span>
                  <div>
                    <p className="font-semibold">Set your contribution</p>
                    <p className="text-sm text-slate-600">Choose your percentage and start earning</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleGetStarted} className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Collective?</h2>
          <p className="text-xl mb-8 opacity-90">
            by the people, with the people and for the people. Start your journey today.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-slate-100 font-semibold"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">the.people</h4>
              <p className="text-sm">Collective funding for collective prosperity.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Forum</a></li>
                <li><a href="#" className="hover:text-white transition">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 the.people. All rights reserved. by the people, with the people and for the people.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
