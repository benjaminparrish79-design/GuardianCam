import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Camera, Shield, Moon, Mic2, Share2, Lock, Zap, Eye } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Reuse Old Phones",
      description: "Turn any old device into a professional security camera"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Easy Setup in 3 Minutes",
      description: "No complicated installation or technical knowledge required"
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: "See in the Dark",
      description: "Advanced night vision with thermal-style green filter"
    },
    {
      icon: <Mic2 className="w-8 h-8" />,
      title: "Talk and View",
      description: "Real-time push-to-talk communication with live streaming"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Share Live Feeds",
      description: "Generate secure shareable links with family and friends"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Motion Alerts",
      description: "AI-powered motion detection with instant notifications"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">GuardianCam</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="text-slate-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => window.location.href = getLoginUrl()}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">Professional Security Camera Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Transform Any Device Into a Security Camera
        </h1>

        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          GuardianCam turns your old phones, tablets, or laptops into professional security cameras with live streaming, night vision, motion alerts, and secure sharing — all in one beautiful platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg"
          >
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg"
          >
            Watch Demo
          </Button>
        </div>

        {/* Hero Image Placeholder */}
        <div className="bg-gradient-to-b from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20 p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-24 h-24 text-cyan-400 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">Live Camera Preview</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Everything you need for professional security monitoring
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-center text-slate-400 mb-16">Choose the plan that fits your needs</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-slate-400 mb-6">Perfect for getting started</p>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-slate-400">/mo</span></div>
            <ul className="space-y-3 mb-8 text-slate-300">
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
            <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-cyan-500/20 to-slate-800/50 border border-cyan-500/50 rounded-lg p-8 relative">
            <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-slate-400 mb-6">For serious monitoring</p>
            <div className="text-4xl font-bold mb-6">$9.99<span className="text-lg text-slate-400">/mo</span></div>
            <ul className="space-y-3 mb-8 text-slate-300">
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
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
              Start Free Trial
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-400 mb-6">For large deployments</p>
            <div className="text-4xl font-bold mb-6">Custom<span className="text-lg text-slate-400">/mo</span></div>
            <ul className="space-y-3 mb-8 text-slate-300">
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
            <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-slate-400 mb-8">Join thousands of users protecting what matters most</p>
        <Button
          onClick={() => window.location.href = getLoginUrl()}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg"
        >
          Start Your Free Trial Today
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2026 GuardianCam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
