<script setup lang="ts">
import FeatureTips from '~/components/tips/FeatureTips.vue'
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'Local SMTP Server for Email Testing — Buggregator',
  description: 'Catch every email your app sends during development. Nothing reaches a real inbox unless you send it there. Preview HTML, check attachments, view raw source. Works with any language or framework. Free, open-source, runs locally.',
  ogTitle: 'Local SMTP Server for Email Testing — Buggregator',
  ogDescription: 'Catch every email your app sends during development. Preview HTML, attachments, raw source. One Docker command to start.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local SMTP Server for Email Testing — Buggregator',
  twitterDescription: 'Catch every email your app sends during development. Nothing reaches a real inbox unless you send it there.',
})

const accentColor = '#f59e0b'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Run a single command. The SMTP server starts on port 1025 alongside the web UI on port 8000. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
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
  {
    title: 'Optional: send one email to a real inbox',
    description: 'Want to see a caught email in Gmail or Outlook, or tap its link on your phone? Add an outgoing SMTP server (v2.13.0 or later). Then Send to inbox on an email\u2019s page sends that one message to the addresses you type. Example for Gmail, which needs an app password:',
    tabs: [
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `smtp_relay:
  host: smtp.gmail.com
  port: 587
  tls: starttls
  username: me@gmail.com
  password_file: /run/secrets/smtp_password
  allowed_recipients: ["me@gmail.com", "*@mycompany.com"]`,
      },
      {
        id: 'env',
        label: 'Environment',
        code: `SMTP_RELAY_HOST=smtp.gmail.com \\
SMTP_RELAY_USERNAME=me@gmail.com \\
SMTP_RELAY_PASSWORD=app-password \\
SMTP_RELAY_ALLOWED_RECIPIENTS=me@gmail.com,*@mycompany.com \\
./buggregator`,
      },
    ],
    note: 'Who can send: without login (SSO off), only from this machine, with the UI opened as localhost or 127.0.0.1, and only to addresses in allowed_recipients. Each pattern must name a real domain: * or *@* turns the button off. With SSO on, any signed-in user can send, and allowed_recipients is optional. The email\u2019s original recipients never get it. Up to 20 addresses per email, 10 emails a minute for the whole server.',
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
    description: 'Nothing is forwarded by itself. An email leaves your machine only if you set up a relay and press Send to inbox.',
  },
  {
    icon: '\u{1F4EC}',
    title: 'Send to a real inbox',
    description: 'Check how Gmail or Outlook shows an email, or whether its link works on your phone. Send to inbox sends that one message through your SMTP server, only to the addresses you type.',
  },
  {
    icon: '\u{1F4C5}',
    title: 'Every version of an email',
    description: 'The Apple Watch version, the AMP version, a calendar invite, a bounce report: each in its own tab, next to the HTML preview.',
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
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent-strong hover:bg-accent-strong-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
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

    <!-- Send to a real inbox -->
    <section id="send-to-inbox" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="text-center mb-10">
          <h2 class="text-section font-bold text-white mb-3">How does it look in Gmail? Send that one email</h2>
          <p class="text-lg text-on-dark-secondary leading-relaxed">
            Buggregator catches every email. When you want to see one in a real mail client, press Send to inbox and type
            your address. Only that message goes out, through the SMTP server you set up. The email’s original
            recipients never get it.
          </p>
        </div>
      </div>
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/email-send-to-inbox.png"
          alt="Buggregator Send to inbox dialog on a caught email: the addresses to send to and the option to put them in To"
          caption="Type the addresses to send to. By default the message goes exactly as it was caught; or put your addresses in To."
        />
      </div>
      <p class="mt-8 text-center font-sans">
        <a
          href="#setup"
          class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline"
        >Set up the relay</a>
      </p>
    </section>

    <!-- Other versions of an email -->
    <section id="other-versions" class="py-16 lg:py-20 border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="text-center mb-10">
          <h2 class="text-section font-bold text-white mb-3">Apple Watch, AMP, calendar invite: see every version of an email</h2>
          <p class="text-lg text-on-dark-secondary leading-relaxed">
            An email can carry more than HTML and plain text. An order email can have a short version for the Apple
            Watch; an invite carries the event itself. Buggregator shows each version in its own tab, after the main
            preview. Nothing to set up: send the email as usual.
          </p>
        </div>
        <ul class="grid gap-4 sm:grid-cols-2 text-on-dark-secondary leading-relaxed list-none p-0 m-0">
          <li><strong class="text-white">Apple Watch.</strong> The watch version at phone width, with its source.</li>
          <li><strong class="text-white">AMP.</strong> A static view of the AMP version (its scripts do not run), with its source.</li>
          <li><strong class="text-white">Calendar invite.</strong> A card above the email: what, when, where, the organizer and who accepted, declined or has not answered. The time is in your time zone; a cancelled invite is struck out.</li>
          <li><strong class="text-white">Bounces and receipts.</strong> Delivery status, Read receipt and Original headers tabs.</li>
          <li class="sm:col-span-2"><strong class="text-white">In the list.</strong> Emails are marked Watch, AMP, Invite or Cancelled, and an invite shows its title and time in one line.</li>
        </ul>
      </div>
      <div class="mt-10 px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/email-calendar-invite.png"
          alt="Buggregator showing a calendar invite email: the invite card with time, place, organizer and each guest's answer, above the HTML preview"
          caption="An invite to «Release sync»: the time in the viewer's zone, the organizer, and who accepted, declined or has not answered."
        />
      </div>
    </section>

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

    <FeatureTips label="email testing" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/smtp.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/sms" label="SMS Testing" color="#a855f7" />
      </template>
    </FeatureCTA>
  </div>
</template>
