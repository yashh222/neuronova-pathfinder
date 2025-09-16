import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BarChart, Users, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-education.jpg';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Early Intervention for{" "}
              <span className="bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
                Student Success
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Built with <Heart className="inline h-6 w-6 text-red-400" /> by Team Neuronova to help mentors support students before it's too late.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-glow text-lg px-8 py-6 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/dashboard">
                  Start Risk Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl font-semibold backdrop-blur-sm"
                asChild
              >
                <Link to="/upload">
                  Upload Data First
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How We Help Students Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform identifies at-risk students early and provides actionable insights for mentors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-soft transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Early Detection</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze attendance, grades, and fee status to identify students who need support before they fall behind.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-soft transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive dashboards and visualizations help mentors understand student performance patterns and trends at a glance.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-soft transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mentor Support</h3>
              <p className="text-muted-foreground">
                AI-generated guidance and action recommendations help mentors provide targeted support to each student effectively.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary via-secondary/50 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of educators using our platform to ensure no student falls through the cracks.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/upload">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}