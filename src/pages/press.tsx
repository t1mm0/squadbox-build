/*
Page: Press & Media
Purpose: Press releases, media kit, company news, and media contact information
Last Modified: 2025-01-28
Author: AI Assistant
Completeness Score: 20/100 (Stub)
*/

import Link from 'next/link'
import { Newspaper, Download, Users, Calendar, Camera } from 'lucide-react'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Newspaper className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              Latest news, press releases, and media resources for SquadBox
            </p>
          </div>

          {/* Media Contact */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Media Contact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-neutral-400 text-sm mb-2"><strong>Press Inquiries:</strong></p>
                <p className="text-blue-400">press@squadbox.teknoledg.com</p>
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-2"><strong>Media Relations:</strong></p>
                <p className="text-blue-400">media@squadbox.teknoledg.com</p>
              </div>
            </div>
          </div>

          {/* Stub Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Press Center Coming Soon</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Press Resources:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                  <li>Company press releases</li>
                  <li>Product launch announcements</li>
                  <li>Funding and investment news</li>
                  <li>Partnership announcements</li>
                  <li>Executive interviews and quotes</li>
                  <li>Company milestones and achievements</li>
                  <li>Industry awards and recognition</li>
                  <li>Speaking engagement schedules</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Media Kit:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-400 text-sm">
                  <li>High-resolution company logos</li>
                  <li>Product screenshots and demos</li>
                  <li>Executive headshots and bios</li>
                  <li>Company fact sheet</li>
                  <li>Brand guidelines and assets</li>
                  <li>Technical specifications</li>
                  <li>Customer success stories</li>
                  <li>Financial and growth metrics</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-white/5 p-6 rounded-md">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Latest News</h4>
                <p className="text-neutral-400 text-sm">Recent press releases and company announcements</p>
              </div>

              <div className="text-center bg-white/5 p-6 rounded-md">
                <Camera className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Media Gallery</h4>
                <p className="text-neutral-400 text-sm">Photos, videos, and visual assets for media use</p>
              </div>

              <div className="text-center bg-white/5 p-6 rounded-md">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Executive Team</h4>
                <p className="text-neutral-400 text-sm">Leadership bios and speaking availability</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 p-6 rounded-md border border-yellow-500/20 mb-8">
              <h4 className="text-white font-medium mb-2">Recent Company Highlights</h4>
              <ul className="text-neutral-400 text-sm space-y-1">
                <li>• Launched SquadBox AI-powered development platform</li>
                <li>• Achieved database migration system for enterprise customers</li>
                <li>• Reached 1,000+ developer beta users</li>
                <li>• Introduced comprehensive help center and documentation</li>
                <li>• Established partnerships with leading cloud providers</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-neutral-400 mb-4">
                Looking for specific information or want to schedule an interview?
              </p>
              <div className="space-x-4">
                <a
                  href="mailto:press@squadbox.teknoledg.com"
                  className="bg-primary-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Contact Press Team
                </a>
                <Link
                  href="/about"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md font-medium transition-colors border border-white/20"
                >
                  About SquadBox
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 