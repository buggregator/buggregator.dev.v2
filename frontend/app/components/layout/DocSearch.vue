<script setup lang="ts">
const config = useRuntimeConfig()

const isOpen = ref(false)
const query = ref('')
const results = ref<SearchHit[]>([])
const isLoading = ref(false)
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)

interface SearchHit {
  url: string
  title: string
  breadcrumbs: string[]
  contentHighlight: string
  htmlContent: string
  contentType: string
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const typesenseUrl = computed(() => {
  const host = config.public.typesenseHost as string
  const port = Number(config.public.typesensePort)
  const protocol = config.public.typesenseProtocol as string
  const portStr = (protocol === 'https' && port === 443) || (protocol === 'http' && port === 80) ? '' : `:${port}`
  return `${protocol}://${host}${portStr}`
})

const open = () => {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
  results.value = []
  selectedIndex.value = 0
}

const search = async (q: string) => {
  if (!q.trim()) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const params = new URLSearchParams({
      q,
      query_by: 'hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,content',
      include_fields: 'url,content,content_type,html_content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3',
      highlight_full_fields: 'content,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3',
      highlight_start_tag: '<mark>',
      highlight_end_tag: '</mark>',
      per_page: '20',
      prioritize_exact_match: 'false',
    })

    const res = await fetch(
      `${typesenseUrl.value}/collections/${config.public.typesenseCollection}/documents/search?${params}`,
      { headers: { 'X-TYPESENSE-API-KEY': config.public.typesenseSearchKey as string } },
    )

    if (!res.ok) throw new Error(`Search failed: ${res.status}`)

    const data = await res.json()

    results.value = (data.hits || []).map((hit: any) => {
      const doc = hit.document
      const hl = hit.highlights || []

      const getHl = (field: string) => hl.find((h: any) => h.field === field)?.snippet || ''
      const contentHl = getHl('content')

      const crumbs: string[] = []
      const lvl0 = doc['hierarchy.lvl0']
      if (lvl0 && lvl0 !== 'Buggregator docs') crumbs.push(lvl0)
      if (doc['hierarchy.lvl1']) crumbs.push(getHl('hierarchy.lvl1') || doc['hierarchy.lvl1'])
      if (doc['hierarchy.lvl2']) crumbs.push(getHl('hierarchy.lvl2') || doc['hierarchy.lvl2'])
      if (doc['hierarchy.lvl3']) crumbs.push(getHl('hierarchy.lvl3') || doc['hierarchy.lvl3'])

      const title = doc['hierarchy.lvl3'] || doc['hierarchy.lvl2'] || doc['hierarchy.lvl1'] || lvl0 || ''

      return {
        url: doc.url || '',
        title,
        breadcrumbs: crumbs,
        contentHighlight: contentHl,
        htmlContent: doc.html_content || '',
        contentType: doc.content_type || 'text',
      } as SearchHit
    })

    selectedIndex.value = 0
  } catch (err) {
    console.error('[Search]', err)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Highlight search terms inside HTML content.
 */
function highlightHtml(html: string, q: string): string {
  if (!q.trim() || !html) return html
  const terms = q.trim().split(/\s+/).filter(t => t.length > 1)
  if (!terms.length) return html
  const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return html.replace(/>([^<]+)</g, (_, text) => {
    return '>' + text.replace(pattern, '<mark>$1</mark>') + '<'
  })
}

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => search(query.value), 200)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
    scrollToSelected()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    scrollToSelected()
  } else if (e.key === 'Enter' && results.value[selectedIndex.value]) {
    e.preventDefault()
    navigateTo(results.value[selectedIndex.value].url)
  } else if (e.key === 'Escape') {
    close()
  }
}

const scrollToSelected = () => {
  nextTick(() => {
    const el = resultsRef.value?.querySelector(`[data-index="${selectedIndex.value}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  })
}

const navigateTo = (url: string) => {
  close()
  window.open(url, '_blank')
}

// Global keyboard shortcut
const handleGlobalKey = (e: KeyboardEvent) => {
  const el = e.target as HTMLElement
  if (el.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return
  if ((e.key?.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
    e.preventDefault()
    open()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey))
</script>

<template>
  <!-- Trigger button -->
  <button
    class="search-btn"
    aria-label="Search docs"
    @click="open"
  >
    <svg class="search-btn__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <path stroke-linecap="round" d="m21 21-4.3-4.3" />
    </svg>
    <span class="search-btn__text">Search</span>
    <span class="search-btn__keys">
      <kbd>⌘</kbd><kbd>K</kbd>
    </span>
  </button>

  <!-- Modal overlay -->
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="isOpen"
        class="search-overlay"
        @click.self="close"
      >
        <div class="search-modal">
          <!-- Search input -->
          <div class="search-header">
            <svg class="search-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path stroke-linecap="round" d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              class="search-header__input"
              type="text"
              placeholder="Search documentation..."
              autocomplete="off"
              @input="onInput"
              @keydown="onKeydown"
            />
            <button
              class="search-header__close"
              @click="close"
            >
              <kbd>esc</kbd>
            </button>
          </div>

          <!-- Results -->
          <div
            ref="resultsRef"
            class="search-results"
          >
            <div v-if="isLoading && !results.length" class="search-empty">
              Searching...
            </div>

            <div v-else-if="query && !results.length && !isLoading" class="search-empty">
              No results for "{{ query }}"
            </div>

            <div v-else-if="!query" class="search-empty">
              Type to search documentation
            </div>

            <!-- Result items -->
            <a
              v-for="(hit, i) in results"
              :key="hit.url + i"
              :href="hit.url"
              target="_blank"
              rel="noopener"
              class="search-hit"
              :class="{ 'search-hit--selected': i === selectedIndex }"
              :data-index="i"
              @click.prevent="navigateTo(hit.url)"
              @mouseenter="selectedIndex = i"
            >
              <!-- Breadcrumbs path -->
              <div class="search-hit__crumbs">
                <span class="search-hit__icon">#</span>
                <template
                  v-for="(crumb, ci) in hit.breadcrumbs"
                  :key="ci"
                >
                  <span v-if="ci > 0" class="search-hit__sep">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </span>
                  <span class="search-hit__crumb" v-html="crumb" />
                </template>
              </div>

              <!-- Rich HTML excerpt -->
              <div
                v-if="hit.htmlContent"
                class="search-hit__excerpt"
                :class="{ 'search-hit__excerpt--code': hit.contentType === 'code' }"
              >
                <div class="search-hit__excerpt-inner" v-html="highlightHtml(hit.htmlContent, query)" />
                <div class="search-hit__excerpt-fade" />
              </div>

              <!-- Fallback: Typesense highlighted snippet -->
              <div
                v-else-if="hit.contentHighlight"
                class="search-hit__content"
                v-html="hit.contentHighlight"
              />
            </a>
          </div>

          <!-- Footer -->
          <div class="search-footer">
            <span class="search-footer__hint">
              <kbd>↑</kbd> <kbd>↓</kbd> navigate
            </span>
            <span class="search-footer__hint">
              <kbd>↵</kbd> open
            </span>
            <span class="search-footer__hint">
              <kbd>esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* ─── Trigger button ─── */
.search-btn {
  display: flex; align-items: center; gap: 6px; padding: 0 8px; height: 32px;
  border-radius: 8px; background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4); font-size: 13px;
  cursor: pointer; transition: all 0.15s ease;
}
.search-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.15);
}
.search-btn__icon { width: 15px; height: 15px; flex-shrink: 0; }
.search-btn__text { font-size: 13px; }
.search-btn__keys { display: none; }
@media (min-width: 768px) {
  .search-btn__keys { display: flex; align-items: center; gap: 2px; margin-left: 4px; }
}
.search-btn__keys kbd {
  font-size: 11px; padding: 1px 4px; border-radius: 3px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: inherit; color: rgba(255, 255, 255, 0.25);
}

/* ─── Modal ─── */
.search-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 8vh;
}
.search-modal {
  width: 100%; max-width: 750px; max-height: 82vh; margin: 0 16px;
  background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; display: flex; flex-direction: column;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.5);
}

/* ─── Search header ─── */
.search-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
.search-header__icon { width: 18px; height: 18px; color: #6366f1; flex-shrink: 0; }
.search-header__input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 15px; color: #e2e8f0; font-family: inherit;
}
.search-header__input::placeholder { color: #64748b; }
.search-header__close { flex-shrink: 0; cursor: pointer; background: none; border: none; }
.search-header__close kbd {
  font-size: 11px; padding: 2px 6px; border-radius: 4px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #64748b; font-family: inherit;
}

/* ─── Results ─── */
.search-results { flex: 1; overflow-y: auto; padding: 8px; }
.search-empty { padding: 32px 16px; text-align: center; color: #64748b; font-size: 14px; }

/* ─── Hit ─── */
.search-hit {
  display: block; padding: 10px 14px; border-radius: 8px;
  cursor: pointer; text-decoration: none; color: inherit;
  transition: all 0.1s ease; border: 2px solid transparent;
  margin-bottom: 4px;
}
.search-hit:hover,
.search-hit--selected {
  background: rgba(255, 255, 255, 0.04);
  border-color: #6366f1;
}

/* ─── Breadcrumbs ─── */
.search-hit__crumbs {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
  font-size: 13px; color: #94a3b8; margin-bottom: 6px; line-height: 1.4;
}
.search-hit__icon {
  color: #6366f1; font-weight: 600; opacity: 0.6; margin-right: 2px;
}
.search-hit--selected .search-hit__icon { opacity: 1; }
.search-hit__sep {
  color: #475569; display: flex; align-items: center; opacity: 0.5;
}
.search-hit__crumb { white-space: nowrap; }
.search-hit__crumb:last-child { font-weight: 600; color: #e2e8f0; }
.search-hit__crumbs mark {
  background: rgba(99, 102, 241, 0.25); color: #a5b4fc;
  padding: 1px 2px; border-radius: 2px;
}

/* ─── Plain text content (fallback) ─── */
.search-hit__content {
  font-size: 13px; line-height: 1.6; color: #94a3b8;
  overflow: hidden; display: -webkit-box;
  -webkit-line-clamp: 3; -webkit-box-orient: vertical;
}
.search-hit__content mark {
  background: rgba(99, 102, 241, 0.25); color: #a5b4fc;
  padding: 1px 2px; border-radius: 2px;
}

/* ─── Rich HTML excerpt ─── */
.search-hit__excerpt {
  position: relative; max-height: 100px; overflow: hidden;
  pointer-events: none; transition: max-height 0.15s ease;
}
.search-hit--selected .search-hit__excerpt { max-height: 180px; }

.search-hit__excerpt-inner {
  font-size: 0.8rem !important; line-height: 1.5 !important;
  color: #94a3b8; opacity: 0.55; transition: opacity 0.15s ease;
}
.search-hit--selected .search-hit__excerpt-inner { opacity: 1; }

/* Highlight matches in excerpts */
.search-hit__excerpt-inner mark {
  background: rgba(99, 102, 241, 0.3) !important; color: #a5b4fc !important;
  padding: 1px 3px; border-radius: 2px;
}

/* Code blocks in excerpts */
.search-hit__excerpt-inner pre {
  margin: 0 !important; padding: 8px 12px !important;
  border-radius: 6px !important; font-size: 12px !important;
  line-height: 1.5 !important; overflow: hidden !important;
  background: rgba(0, 0, 0, 0.3) !important;
}
.search-hit__excerpt-inner code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
}

/* Inline code in text results */
.search-hit__excerpt-inner :not(pre) > code {
  background: rgba(0, 0, 0, 0.2) !important;
  padding: 2px 5px !important; border-radius: 3px !important;
}

.search-hit__excerpt-inner p { margin: 0 !important; }
.search-hit__excerpt-inner ul,
.search-hit__excerpt-inner ol { margin: 0 !important; padding-left: 1.2em !important; }
.search-hit__excerpt-inner li { font-size: 0.8rem !important; line-height: 1.5 !important; }
.search-hit__excerpt-inner a { color: #a5b4fc; text-decoration: none; }
.search-hit__excerpt-inner table { font-size: 0.75rem !important; border-collapse: collapse; width: 100%; }
.search-hit__excerpt-inner th,
.search-hit__excerpt-inner td { padding: 4px 8px !important; border: 1px solid rgba(255, 255, 255, 0.08); }

/* Code excerpt extra styling */
.search-hit__excerpt--code .search-hit__excerpt-inner { opacity: 0.7; }
.search-hit--selected .search-hit__excerpt--code .search-hit__excerpt-inner { opacity: 1; }

/* Fade gradient at bottom */
.search-hit__excerpt-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 24px;
  background: linear-gradient(transparent, #1e293b); pointer-events: none;
}
.search-hit:hover .search-hit__excerpt-fade,
.search-hit--selected .search-hit__excerpt-fade {
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.04));
}

/* ─── Footer ─── */
.search-footer {
  display: flex; align-items: center; gap: 16px;
  padding: 10px 16px; border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
.search-footer__hint { font-size: 12px; color: #475569; }
.search-footer__hint kbd {
  font-size: 11px; padding: 1px 4px; border-radius: 3px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748b; font-family: inherit; margin-right: 2px;
}

/* ─── Transition ─── */
.search-fade-enter-active { transition: opacity 0.15s ease; }
.search-fade-leave-active { transition: opacity 0.1s ease; }
.search-fade-enter-from,
.search-fade-leave-to { opacity: 0; }
</style>
