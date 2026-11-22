// Footer links next to the feature groups (#6758, design #6756 A). The groups
// themselves come from FEATURE_MENU_COLUMNS, so the menu and the footer agree.
// `to`: a page of this site; `localized`: it has ru/es versions (localePath),
// otherwise it is English only and shows «EN» on the ru/es site.
// `href`: another site, opens in a new tab.
export type FooterLink =
  | { label: string, to: string, localized?: boolean }
  | { label: string, href: string }

export const FOOTER_RESOURCES: FooterLink[] = [
  { label: 'footer.links.docs', href: 'https://docs.buggregator.dev' },
  { label: 'footer.links.gettingStarted', href: 'https://docs.buggregator.dev/getting-started.html' },
  { label: 'footer.links.tips', to: '/tips' },
  { label: 'footer.links.releases', href: 'https://github.com/buggregator/server/releases' },
  { label: 'footer.links.trap', href: 'https://github.com/buggregator/trap' },
  { label: 'footer.links.plugin', href: 'https://plugins.jetbrains.com/plugin/26344-buggregator' },
]

// Discord's invite lives in runtime config.
export function footerCommunity(discordUrl: string): FooterLink[] {
  return [
    { label: 'footer.links.github', href: 'https://github.com/buggregator/server' },
    { label: 'footer.links.discord', href: discordUrl },
    { label: 'footer.links.bugs', href: 'https://github.com/buggregator/server/issues' },
    { label: 'footer.links.sponsors', to: '/sponsors', localized: true },
  ]
}

// «Catch the bug»: each click on the footer logo catches one more. The first
// clicks report the catch like an event in the app; the third ends the joke
// with the install command.
export const BUG_CATCH_FINAL = 3

export type BugCatchToast =
  | { kind: 'caught', count: number, line: number }
  | { kind: 'final', count: number, line: number }

export function bugCatchToast(count: number): BugCatchToast | null {
  if (count < 1) return null
  if (count < BUG_CATCH_FINAL) return { kind: 'caught', count, line: 40 + count }
  return { kind: 'final', count: BUG_CATCH_FINAL, line: 42 }
}
