import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlanFeature {
  name: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
}

const features: PlanFeature[] = [
  { name: "Cameras", free: true, pro: true, enterprise: true },
  { name: "Live Streaming", free: true, pro: true, enterprise: true },
  { name: "Basic Motion Alerts", free: true, pro: true, enterprise: true },
  { name: "Night Vision", free: false, pro: true, enterprise: true },
  { name: "Secure Sharing", free: false, pro: true, enterprise: true },
  { name: "Advanced Motion Detection", free: false, pro: true, enterprise: true },
  { name: "AI-powered Alerts", free: false, pro: false, enterprise: true },
  { name: "Custom Rules & Automations", free: false, pro: false, enterprise: true },
  { name: "Priority Support", free: false, pro: false, enterprise: true },
  { name: "API Access", free: false, pro: false, enterprise: true },
  { name: "Custom Branding", free: false, pro: false, enterprise: true },
  { name: "Dedicated Account Manager", free: false, pro: false, enterprise: true },
];

export default function Billing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "enterprise">("pro");

  const handleUpgrade = (plan: string) => {
    setSelectedPlan(plan as any);
    toast.success(`Upgraded to ${plan} plan!`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">GuardianCam</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-slate-300 hover:text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Billing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">Billing & Plans</h1>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Choose the perfect plan for your security needs. Upgrade or downgrade anytime.
        </p>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-slate-400 mb-6">Perfect for getting started</p>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg text-slate-400">/mo</span>
            </div>
            <Button
              onClick={() => handleUpgrade("free")}
              disabled={selectedPlan === "free"}
              variant={selectedPlan === "free" ? "outline" : "default"}
              className="w-full mb-8"
            >
              {selectedPlan === "free" ? "Current Plan" : "Get Started"}
            </Button>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> 1 Camera
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Live Streaming
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Basic Motion Alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-500">✗</span> Night Vision
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-cyan-500/20 to-slate-800/50 border border-cyan-500/50 rounded-lg p-8 relative">
            <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-slate-400 mb-6">For serious monitoring</p>
            <div className="text-4xl font-bold mb-6">
              $9.99<span className="text-lg text-slate-400">/mo</span>
            </div>
            <Button
              onClick={() => handleUpgrade("pro")}
              disabled={selectedPlan === "pro"}
              className={`w-full mb-8 ${
                selectedPlan === "pro"
                  ? "bg-slate-600 hover:bg-slate-600"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {selectedPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Up to 5 Cameras
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Live Streaming
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Advanced Motion Alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Night Vision
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Secure Sharing
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-400 mb-6">For large deployments</p>
            <div className="text-4xl font-bold mb-6">
              Custom<span className="text-lg text-slate-400">/mo</span>
            </div>
            <Button
              onClick={() => handleUpgrade("enterprise")}
              disabled={selectedPlan === "enterprise"}
              variant={selectedPlan === "enterprise" ? "outline" : "default"}
              className="w-full mb-8"
            >
              {selectedPlan === "enterprise" ? "Current Plan" : "Contact Sales"}
            </Button>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Unlimited Cameras
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> All Features
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Priority Support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Custom Integration
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-8 border-b border-slate-700">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-700 ${
                      idx % 2 === 0 ? "bg-slate-700/20" : ""
                    }`}
                  >
                    <td className="p-4">{feature.name}</td>
                    <td className="text-center p-4">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {feature.pro ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {feature.enterprise ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-slate-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-slate-400 text-sm">
                Yes! Start with our Free plan with no credit card required. Upgrade anytime.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-400 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-slate-400 text-sm">
                Yes! We offer a 30-day money-back guarantee if you're not satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
