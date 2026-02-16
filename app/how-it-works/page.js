"use client";

import { useState } from 'react';
import Button from '@/components/Button';

export default function HowItWorks() {
  const [open, setOpen] = useState(null);

  const steps = [
    {
      id: 1,
      title: 'Report or Post an Item',
      desc: 'Quickly create a clear listing with a title, description, location, and optional photo. Choose "Lost" if you’re missing something or "Found" if you are holding an item.',
      icon: (
        <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Verification & Moderation',
      desc: 'We perform light moderation to reduce spam and verify that listings follow our guidelines. This keeps the system safe and reliable for everyone.',
      icon: (
        <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Matching & Notifications',
      desc: 'Our matching process finds candidate items that might be yours based on title, description, and location. You’ll receive a notification for good matches so you can connect with the finder.',
      icon: (
        <svg className="w-10 h-10 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h3l3 8 4-16 3 8h3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Claiming & Recovery',
      desc: 'Once a match is found, contact the person who posted the item through the in-app messaging or by the contact details they provided. Arrange a safe exchange and mark the item as returned.',
      icon: (
        <svg className="w-10 h-10 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      q: 'Is it free to report or post a found item?',
      a: 'Yes — creating a listing is free for everyone. We may introduce premium features in the future, but basic reporting and searching will remain free.',
    },
    {
      q: 'Can I edit or remove my listing?',
      a: 'Yes — go to your Dashboard → My Lost / My Found and use the edit or remove actions to update or delete a listing at any time.',
    },
    {
      q: 'How do you protect my privacy when contacting a finder?',
      a: 'We provide an in-app messaging system and allow users to share minimal contact details. Do not share sensitive personal information; arrange to meet in a public place when exchanging items.',
    },
    {
      q: 'What should I include in a good listing?',
      a: 'Include a clear title, concise description, exact or approximate location, date when it was lost/found, and a photo if available. The more detail, the better the matches.',
    },
  ];

  return (
    <div className="prose max-w-6xl mx-auto py-16 px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">How It Works</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">A simple, secure process to report lost items, post found items, and recover belongings quickly.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button href="/report-lost">Report Lost</Button>
          <Button variant="outline" href="/post-found">Post Found</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-gray-600">Our goal is to make returning lost items easy and reliable. We match listings using title, description, date, and location, and provide tools to verify and communicate with finders safely.</p>

          <h3 className="text-lg font-medium">Why it works</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Fast reporting with optional photos</li>
            <li>Automated matching reduces manual searching</li>
            <li>Moderation to keep listings trustworthy</li>
            <li>Secure, minimal-contact exchanges recommended</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Step-by-step</h3>
          <ol className="space-y-4">
            {steps.map((s) => (
              <li key={s.id} className="flex gap-4 items-start">
                <div className="flex-shrink-0">{s.icon}</div>
                <div>
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Benefits for users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold">Save time</h4>
            <p className="text-gray-600 text-sm">Automated matching surfaces likely candidates quickly so you don’t have to check manually.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold">Safe connections</h4>
            <p className="text-gray-600 text-sm">Communicate in-app or share limited contact details. We recommend meeting in public places.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold">Peace of mind</h4>
            <p className="text-gray-600 text-sm">Moderation and clear guidelines help maintain a trustworthy community.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-4 py-3 flex items-center justify-between bg-white">
                <span className="font-medium">{f.q}</span>
                <span className="text-sm text-gray-500">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-4 py-3 bg-gray-50 text-gray-700 text-sm">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl text-center">
        <h3 className="text-xl font-semibold">Ready to get started?</h3>
        <p className="text-gray-600 mt-2">Report a lost item or post a found item now — it only takes a minute.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button href="/report-lost">Report Lost</Button>
          <Button variant="outline" href="/post-found">Post Found</Button>
        </div>
      </section>
    </div>
  );
}
