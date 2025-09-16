import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Award, 
  Heart, 
  Code, 
  Globe, 
  Target,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Arjun Patel',
    role: 'Team Lead & Backend Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: ['React', 'Node.js', 'AI/ML']
  },
  {
    name: 'Priya Singh',
    role: 'Frontend Developer & UI/UX',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b796?w=150&h=150&fit=crop&crop=face',
    skills: ['React', 'Tailwind', 'Design']
  },
  {
    name: 'Raj Kumar',
    role: 'Data Scientist & Analytics',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skills: ['Python', 'ML', 'Analytics']
  },
  {
    name: 'Sneha Reddy',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skills: ['React', 'Database', 'DevOps']
  }
];

const features = [
  {
    icon: Target,
    title: 'Early Detection',
    description: 'AI-powered algorithms identify at-risk students before they fall behind'
  },
  {
    icon: Globe,
    title: 'Open Source',
    description: 'Built as an open-source solution, accessible to educational institutions worldwide'
  },
  {
    icon: Heart,
    title: 'Student-Centric',
    description: 'Every feature designed with student welfare and success at its core'
  },
  {
    icon: Code,
    title: 'Modern Tech Stack',
    description: 'Built with React, AI/ML models, and modern web technologies for reliability'
  }
];

export default function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">About Team Neuronova</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A passionate team of developers building technology solutions for educational excellence and student success.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">Smart India Hackathon 2024</Badge>
          <Badge variant="secondary" className="bg-success/10 text-success">Open Source</Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">Education Technology</Badge>
        </div>
      </div>

      {/* Mission Statement */}
      <Card className="mb-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-8">
          <div className="text-center max-w-4xl mx-auto">
            <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every student deserves the opportunity to succeed. Our Early Intervention System uses cutting-edge 
              technology to identify students who need support before they fall behind, empowering educators with actionable 
              insights and AI-powered recommendations to make a meaningful difference in students' lives.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-soft transition-all duration-300 group">
              <CardContent className="pt-8">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{member.role}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Special</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-soft transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SIH Section */}
      <Card className="mb-12 bg-gradient-hero text-white">
        <CardContent className="pt-8 text-center">
          <Award className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Smart India Hackathon 2024</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6 text-white/90">
              This project was developed for Smart India Hackathon 2024, addressing the critical need for early 
              intervention in educational institutions. We're proud to contribute to India's digital education 
              transformation with innovative, accessible technology solutions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-bold text-xl">Problem Statement</h4>
                <p className="text-white/80">Early Intervention for Student Success</p>
              </div>
              <div>
                <h4 className="font-bold text-xl">Solution Type</h4>
                <p className="text-white/80">AI-Powered Education Platform</p>
              </div>
              <div>
                <h4 className="font-bold text-xl">Impact</h4>
                <p className="text-white/80">Nationwide Student Support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hackathon Spirit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Heart className="h-6 w-6 text-red-500" />
            Hackathon Spirit
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-muted-foreground">
              Our project embodies the true hackathon spirit: <strong>low-cost, open-source, high-impact</strong> 
              solutions that can make a real difference in people's lives.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-success/10 rounded-lg">
                <h4 className="font-bold text-success mb-2">💰 Low-Cost</h4>
                <p className="text-sm">Minimal infrastructure requirements, built with open-source technologies</p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-bold text-primary mb-2">🔓 Open Source</h4>
                <p className="text-sm">Freely available for educational institutions worldwide</p>
              </div>
              
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-bold text-accent-foreground mb-2">🎯 High Impact</h4>
                <p className="text-sm">Directly addresses student dropout and academic failure prevention</p>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                asChild
              >
                <a href="https://github.com/neuronova/student-intervention" target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-5 w-5" />
                  View Source Code
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground italic">
              "Technology should be a bridge to opportunity, not a barrier. Our commitment is to ensure every 
              student has access to the support they need to succeed." - Team Neuronova
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}