<script setup lang="ts">
// Bottom row: the author, the languages (same pages as the header's
// switcher), Wippy, the license and ©.
const { t } = useI18n()
const languages = useLanguageLinks()
const year = new Date().getFullYear()
</script>

<template>
  <div class="ft-bottom">
    <a href="https://linkedin.com/in/butschster" target="_blank" rel="noopener" class="ft-bottom__author">
      <img
        src="https://avatars.githubusercontent.com/u/773481?v=4"
        alt=""
        width="32"
        height="32"
        loading="lazy"
        class="ft-bottom__avatar"
      >
      <span>
        <span class="ft-bottom__name">
          Pavel Buchnev
          <svg class="ft-bottom__in" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </span>
        <span class="ft-bottom__role">{{ t('footer.creator') }}</span>
      </span>
      <span class="sr-only">(LinkedIn, {{ t('footer.newTab') }})</span>
    </a>

    <nav class="ft-bottom__langs" :aria-label="t('footer.language')">
      <svg class="ft-bottom__globe" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
      </svg>
      <NuxtLink
        v-for="loc in languages"
        :key="loc.code"
        :to="loc.href"
        :hreflang="loc.code"
        :lang="loc.code"
        :title="loc.name"
        :aria-current="loc.current ? 'true' : undefined"
        class="ft-bottom__lang"
      >
        {{ loc.code.toUpperCase() }}
      </NuxtLink>
    </nav>

    <div class="ft-bottom__legal">
      <span>{{ t('footer.builtWith') }} <a href="https://wippy.ai" target="_blank" rel="noopener">Wippy</a></span>
      <a href="https://github.com/buggregator/server/blob/master/LICENSE" target="_blank" rel="noopener">{{ t('footer.license') }}</a>
      <span>&copy; {{ year }} Buggregator</span>
    </div>
  </div>
</template>

<style scoped>
.ft-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  margin-top: 48px;
  padding: 18px 0 22px;
  border-top: 1px solid theme('colors.landing-border-subtle');
}

.ft-bottom a:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

.ft-bottom__author {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  text-decoration: none;
}

.ft-bottom__avatar {
  width: 32px;
  height: 32px;
  border: 1px solid theme('colors.landing-border');
  border-radius: 50%;
  object-fit: cover;
}

.ft-bottom__name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: theme('colors.on-dark.primary');
}

.ft-bottom__in {
  width: 12px;
  height: 12px;
  color: #0a66c2;
}

.ft-bottom__role {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: theme('colors.on-dark.muted');
}

.ft-bottom__langs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: theme('colors.on-dark.muted');
}

.ft-bottom__globe {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  opacity: 0.7;
}

.ft-bottom__lang {
  display: inline-grid;
  place-items: center;
  min-width: 32px;
  min-height: 32px;
  padding: 0 6px;
  border-radius: 4px;
  color: theme('colors.on-dark.muted');
  text-decoration: none;
}

.ft-bottom__lang:hover {
  color: theme('colors.on-dark.primary');
}

.ft-bottom__lang[aria-current] {
  font-weight: 600;
  color: theme('colors.on-dark.primary');
  background: theme('colors.landing-elevated');
}

.ft-bottom__legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: theme('colors.on-dark.muted');
}

.ft-bottom__legal a {
  color: theme('colors.on-dark.secondary');
  text-decoration: none;
}

.ft-bottom__legal a:hover {
  color: theme('colors.on-dark.primary');
}

@media (max-width: 639px) {
  .ft-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .ft-bottom__lang {
    min-width: 44px;
    min-height: 44px;
  }

  .ft-bottom__legal {
    margin-left: 0;
  }

  .ft-bottom__legal a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
}
</style>
