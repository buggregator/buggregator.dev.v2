<script setup lang="ts">
import FooterBrand from '~/components/layout/AppFooter/FooterBrand.vue'
import FooterGroup from '~/components/layout/AppFooter/FooterGroup.vue'
import FooterLink from '~/components/layout/AppFooter/FooterLink.vue'
import FooterBottom from '~/components/layout/AppFooter/FooterBottom.vue'
import { FEATURE_MENU_COLUMNS, FEATURE_PAGES } from '~/data/features'
import { FOOTER_RESOURCES, footerCommunity } from '~/data/footer'
import type { FooterLink as FooterLinkData } from '~/data/footer'

// Site footer (#6758, design #6756 A): brand with install and stars, the
// feature groups of the «Features» menu in three columns (an accordion on
// phones), Resources and Community, then the bottom row.
const { t } = useI18n()
const localePath = useLocalePath()
const { discordUrl } = useRuntimeConfig().public

const side = computed(() => [
  { id: 'resources', title: t('footer.resources'), links: FOOTER_RESOURCES },
  { id: 'community', title: t('footer.community'), links: footerCommunity(discordUrl as string) },
])

function linkProps(link: FooterLinkData) {
  if ('href' in link) return { label: t(link.label), href: link.href }
  return link.localized
    ? { label: t(link.label), to: localePath(link.to) }
    : { label: t(link.label), to: link.to, enOnly: true }
}
</script>

<template>
  <footer class="ft">
    <div class="ft__inner">
      <div class="ft__grid">
        <FooterBrand />

        <nav class="ft__features" :aria-label="t('nav.features')">
          <div v-for="(column, i) in FEATURE_MENU_COLUMNS" :key="i" class="ft__column">
            <FooterGroup
              v-for="group in column"
              :id="`features-${group.id}`"
              :key="group.id"
              :title="t(`featureMenu.groups.${group.id}`)"
              :count="group.features.length"
              collapsible
            >
              <FooterLink
                v-for="id in group.features"
                :key="id"
                :label="FEATURE_PAGES[id].label"
                :to="FEATURE_PAGES[id].to"
                :is-new="FEATURE_PAGES[id].isNew"
                en-only
              />
            </FooterGroup>
          </div>
        </nav>

        <div class="ft__side">
          <FooterGroup v-for="list in side" :id="list.id" :key="list.id" :title="list.title">
            <FooterLink v-for="link in list.links" :key="link.label" v-bind="linkProps(link)" />
          </FooterGroup>
        </div>
      </div>

      <FooterBottom />
    </div>
  </footer>
</template>

<style scoped>
.ft {
  padding: 56px 0 0;
  border-top: 1px solid theme('colors.landing-border-subtle');
  background: theme('colors.section-mid');
}

.ft__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.ft__grid {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 170px;
  gap: 40px;
}

.ft__features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.ft__column > * + * {
  margin-top: 24px;
}

.ft__side > * + * {
  margin-top: 28px;
}

@media (max-width: 1023px) {
  .ft__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ft__side {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px;
  }

  .ft__side > * + * {
    margin-top: 0;
  }
}

@media (max-width: 639px) {
  .ft {
    padding-top: 40px;
  }

  .ft__inner {
    padding: 0 16px;
  }

  .ft__grid {
    gap: 32px;
  }

  .ft__features {
    display: block;
    border-bottom: 1px solid theme('colors.landing-border-subtle');
  }

  .ft__column > * + * {
    margin-top: 0;
  }

  .ft__side {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
}
</style>
