<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'

definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Local SMTP Server for Email Testing — Buggregator',
  description: 'Catch every email your app sends during development. No emails reach real inboxes. Preview HTML, check attachments, view raw source. Works with any language or framework. Free, open-source, runs locally.',
  ogTitle: 'Local SMTP Server for Email Testing — Buggregator',
  ogDescription: 'Catch every email your app sends during development. Preview HTML, attachments, raw source. One Docker command to start.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local SMTP Server for Email Testing — Buggregator',
  twitterDescription: 'Catch every email your app sends during development. No emails reach real inboxes.',
})

const accentColor = '#f59e0b'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'Run a single command. The SMTP server starts on port 1025 alongside the web UI on port 8000.',
    tabs: [
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025`,
      },
      {
        id: 'binary',
        label: 'Binary',
        code: `# Download the binary for your platform
$ curl -L https://github.com/buggregator/server/releases/latest/download/buggregator-linux-amd64 -o buggregator
$ chmod +x buggregator
$ ./buggregator`,
      },
    ],
  },
  {
    title: 'Point your app to Buggregator',
    description: 'Change your SMTP settings to localhost:1025. No authentication needed. No TLS configuration.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# .env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025`,
      },
      {
        id: 'symfony',
        label: 'Symfony',
        code: `# .env
MAILER_DSN=smtp://127.0.0.1:1025`,
      },
      {
        id: 'wordpress',
        label: 'WordPress',
        code: `# wp-content/mu-plugins/buggregator-smtp.php
add_action('phpmailer_init', function ($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = '127.0.0.1';
    $phpmailer->Port = 1025;
    $phpmailer->SMTPAuth = false;
    $phpmailer->SMTPAutoTLS = false;
});`,
      },
      {
        id: 'nodemailer',
        label: 'Node.js',
        code: `const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
});`,
      },
      {
        id: 'python',
        label: 'Python',
        code: `import smtplib
smtp = smtplib.SMTP('127.0.0.1', 1025)
smtp.sendmail(sender, recipient, message)`,
      },
      {
        id: 'ruby',
        label: 'Ruby',
        code: `# config/environments/development.rb
config.action_mailer.smtp_settings = {
    address: '127.0.0.1',
    port: 1025,
}`,
      },
      {
        id: 'go',
        label: 'Go',
        code: `import "net/smtp"
smtp.SendMail("127.0.0.1:1025", nil, sender, recipients, msg)`,
      },
    ],
  },
  {
    title: 'Send an email — see it instantly',
    description: 'Trigger any email from your app. It shows up in the Buggregator UI immediately with full HTML preview, attachments, and raw source.',
  },
]

const highlights = [
  {
    icon: '\u{1F4E8}',
    title: 'HTML preview',
    description: 'See exactly how your email looks. Rendered HTML with images, styles, and layouts.',
  },
  {
    icon: '\u{1F4CE}',
    title: 'Attachments',
    description: 'Download and inspect every attachment. PDFs, images, CSVs \u2014 all accessible.',
  },
  {
    icon: '\u{1F4C4}',
    title: 'Raw source',
    description: 'View the raw MIME source, headers, and encoding. Debug email structure at the protocol level.',
  },
  {
    icon: '\u{26A1}',
    title: 'Real-time',
    description: 'Emails appear instantly via WebSocket. No page refresh needed.',
  },
  {
    icon: '\u{1F6E1}\uFE0F',
    title: 'Safe by default',
    description: 'Emails never leave your machine. No risk of test emails reaching real users.',
  },
  {
    icon: '\u{1F504}',
    title: 'No auth required',
    description: 'No username, password, or TLS setup. Just point your SMTP host and port.',
  },
]

const worksWithItems = [
  { name: 'PHP', detail: '\u2014 Laravel, Symfony, WordPress, Magento, Spiral' },
  { name: 'Node.js', detail: '\u2014 Nodemailer, any SMTP library' },
  { name: 'Python', detail: '\u2014 smtplib, Django, Flask-Mail' },
  { name: 'Ruby', detail: '\u2014 Action Mailer, Rails' },
  { name: 'Go', detail: '\u2014 net/smtp, any SMTP client' },
  { name: 'Java', detail: '\u2014 JavaMail, Spring Boot' },
  { name: '.NET', detail: '\u2014 SmtpClient, MailKit' },
  { name: 'Any language', detail: '\u2014 if it speaks SMTP, it works' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Catch every email your app sends"
      subtitle="Email Testing"
      description="During development you need to see what emails your app sends, but you don't want them reaching real inboxes. Buggregator runs a local SMTP server that captures everything and shows it in a clean UI."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
          >
            Get started
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <span class="font-mono text-xs text-on-dark-muted">Replaces Mailhog, Mailtrap, MailCatcher</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/email-testing.png"
          alt="Screenshot: Buggregator email preview with HTML rendering, attachments, and raw source"
          caption="HTML preview with attachments, headers, and raw MIME source"
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Everything you need to debug emails"
      subtitle="Preview, inspect, and verify every email without leaving your dev environment."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with any language"
      description="Buggregator speaks standard SMTP. If your language can send emails, it works."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/smtp.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Exception Tracking" color="#f43f5e" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/sms" label="SMS Testing" color="#a855f7" />
      </template>
    </FeatureCTA>
  </div>
</template>
