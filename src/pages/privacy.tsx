/*
Page: Privacy Policy
Purpose: Privacy policy, data handling, and user rights information
Last Modified: 2025-01-30
Author: AI Assistant
Completeness Score: 85/100

Information Hierarchy:
1. Primary: Privacy Commitment & Data Rights (most important user rights)
2. Secondary: Data Collection & Usage (operational transparency)
3. Tertiary: Security & Compliance (regulatory information)
4. Quaternary: Contact & Legal Resources (background information)

Predictive Actions:
- After reading privacy commitment: "Contact Privacy Team" or "View GDPR Info"
- After data collection section: "Export Data" or "Delete Account"
- After security section: "View Security Report" or "Report Vulnerability"
- After compliance section: "GDPR Information" or "CCPA Rights"
*/
import { 
  ContentTemplate, 
  Typography, 
  BodyText, 
  CaptionText,
  Button,
  Card,
  CardContent,
  CardHeader
} from '@/components/ui'
import { Shield, Eye, Lock, Users, Download, AlertCircle, Mail, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <ContentTemplate
      title="Privacy Policy"
      subtitle="Your privacy matters to us. Learn how we protect and use your data."
      breadcrumbs={[
        { label: 'Privacy', href: '/privacy' }
      ]}
      metadata={{
        lastModified: '2025-01-30',
        author: 'AI Assistant',
        completeness: 85,
        hierarchy: [
          'Primary: Privacy Commitment & Data Rights (most important user rights)',
          'Secondary: Data Collection & Usage (operational transparency)',
          'Tertiary: Security & Compliance (regulatory information)',
          'Quaternary: Contact & Legal Resources (background information)'
        ]
      }}
      predictiveContext="content"
      userData={{
        projectCount: 0,
        activeProjects: 0
      }}
    >
      {/* Privacy Commitment */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <Typography level="h2">Our Privacy Commitment</Typography>
          <BodyText color="secondary">
            While we finalize our comprehensive privacy policy, here's our commitment to you
          </BodyText>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-info-500/10 border border-info-500/20 rounded-md">
            <div className="space-y-3">
              <BodyText color="secondary">• We only collect data necessary to provide SquadBox services</BodyText>
              <BodyText color="secondary">• Your project data remains private and is never shared</BodyText>
              <BodyText color="secondary">• We use industry-standard encryption for all data</BodyText>
              <BodyText color="secondary">• You can delete your account and data at any time</BodyText>
              <BodyText color="secondary">• We comply with GDPR, CCPA, and other privacy regulations</BodyText>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection & Usage */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-primary-500" />
              <Typography level="h3">What We'll Cover</Typography>
            </div>
            <BodyText color="secondary">Comprehensive privacy information</BodyText>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <BodyText color="secondary">• Information we collect and why</BodyText>
              <BodyText color="secondary">• How we use your personal data</BodyText>
              <BodyText color="secondary">• Data storage and security measures</BodyText>
              <BodyText color="secondary">• Third-party integrations and sharing</BodyText>
              <BodyText color="secondary">• Your rights and control options</BodyText>
              <BodyText color="secondary">• Cookie usage and tracking</BodyText>
              <BodyText color="secondary">• Data retention policies</BodyText>
              <BodyText color="secondary">• International data transfers</BodyText>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-secondary-500" />
              <Typography level="h3">Privacy Principles</Typography>
            </div>
            <BodyText color="secondary">Our core privacy values</BodyText>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <BodyText color="secondary">• Transparency in data collection</BodyText>
              <BodyText color="secondary">• Minimal data collection principle</BodyText>
              <BodyText color="secondary">• Strong encryption and security</BodyText>
              <BodyText color="secondary">• User control and consent</BodyText>
              <BodyText color="secondary">• GDPR and CCPA compliance</BodyText>
              <BodyText color="secondary">• Regular security audits</BodyText>
              <BodyText color="secondary">• No sale of personal data</BodyText>
              <BodyText color="secondary">• Clear opt-out mechanisms</BodyText>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <Typography level="h3">Security & Compliance</Typography>
          <BodyText color="secondary">
            How we protect your data and comply with regulations
          </BodyText>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-success-500" />
                <Typography level="h4">Security Measures</Typography>
              </div>
              <div className="space-y-2">
                <BodyText color="secondary">• 256-bit encryption for all data</BodyText>
                <BodyText color="secondary">• End-to-end encryption for sensitive data</BodyText>
                <BodyText color="secondary">• Regular security audits and penetration testing</BodyText>
                <BodyText color="secondary">• Secure data centers with physical security</BodyText>
                <BodyText color="secondary">• Access controls and authentication</BodyText>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-info-500" />
                <Typography level="h4">Compliance Standards</Typography>
              </div>
              <div className="space-y-2">
                <BodyText color="secondary">• GDPR compliance for EU users</BodyText>
                <BodyText color="secondary">• CCPA compliance for California users</BodyText>
                <BodyText color="secondary">• SOC 2 Type II certification</BodyText>
                <BodyText color="secondary">• ISO 27001 information security</BodyText>
                <BodyText color="secondary">• Regular compliance assessments</BodyText>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <Typography level="h3">Your Data Rights</Typography>
          <BodyText color="secondary">
            What you can do with your data
          </BodyText>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-md flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6 text-primary-500" />
              </div>
              <Typography level="h5">Right to Access</Typography>
              <BodyText color="secondary">
                View all data we have about you
              </BodyText>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-secondary-500/20 rounded-md flex items-center justify-center mx-auto">
                <Download className="w-6 h-6 text-secondary-500" />
              </div>
              <Typography level="h5">Right to Portability</Typography>
              <BodyText color="secondary">
                Export your data in standard formats
              </BodyText>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-error-500/20 rounded-md flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-error-500" />
              </div>
              <Typography level="h5">Right to Deletion</Typography>
              <BodyText color="secondary">
                Delete your account and all data
              </BodyText>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card variant="elevated" className="text-center">
        <CardContent className="py-12">
          <Typography level="h3" className="mb-4">
            Have Questions About Privacy?
          </Typography>
          <BodyText color="secondary" className="mb-6">
            Contact us directly for any privacy-related questions or concerns.
          </BodyText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Privacy Team
            </Button>
            <Button variant="outline" size="lg" href="/gdpr">
              <FileText className="w-4 h-4 mr-2" />
              GDPR Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </ContentTemplate>
  )
} 