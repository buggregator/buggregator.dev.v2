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
  content: string
  contentHighlight: string
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
      query_by: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,content',
      highlight_full_fields: 'content',
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
      const highlights = hit.highlights || []
      const contentHl = highlights.find((h: any) => h.field === 'content')

      const breadcrumbs: string[] = []
      if (doc['hierarchy.lvl1']) breadcrumbs.push(doc['hierarchy.lvl1'])
      if (doc['hierarchy.lvl2']) breadcrumbs.push(doc['hierarchy.lvl2'])
      if (doc['hierarchy.lvl3']) breadcrumbs.push(doc['hierarchy.lvl3'])

      return {
        url: doc.url || '',
        title: breadcrumbs[breadcrumbs.length - 1] || doc['hierarchy.lvl1'] || '',
        breadcrumbs,
        content: doc.content || '',
        contentHighlight: contentHl?.snippet || '',
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
            <!-- Loading -->
            <div
              v-if="isLoading && !results.length"
              class="search-empty"
            >
              Searching...
            </div>

            <!-- No results -->
            <div
              v-else-if="query && !results.length && !isLoading"
              class="search-empty"
            >
              No results for "{{ query }}"
            </div>

            <!-- Hint -->
            <div
              v-else-if="!query"
              class="search-empty"
            >
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
              <!-- Breadcrumbs -->
              <div class="search-hit__breadcrumbs">
                <template
                  v-for="(crumb, ci) in hit.breadcrumbs"
                  :key="ci"
                >
                  <span v-if="ci > 0" class="search-hit__separator">›</span>
                  <span>{{ crumb }}</span>
                </template>
              </div>

              <!-- Content preview with highlighting -->
              <div
                v-if="hit.contentHighlight"
                class="search-hit__content"
                v-html="hit.contentHighlight"
              />
            </a>
          </div>

          <!-- Footer -->
          <div class="search-footer">
            <span class="search-footer__hint">
              <kbd>↑</kbd> <kbd>↓</kbd> to navigate
            </span>
            <span class="search-footer__hint">
              <kbd>↵</kbd> to open
            </span>
            <span class="search-footer__hint">
              <kbd>esc</kbd> to close
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
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
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 10vh;
}
.search-modal {
  width: 100%; max-width: 680px;
  max-height: 75vh;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex; flex-direction: column;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.5);
  margin: 0 16px;
}

/* ─── Search header ─── */
.search-header {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
.search-header__icon {
  width: 18px; height: 18px; color: #6366f1; flex-shrink: 0;
}
.search-header__input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 15px; color: #e2e8f0; font-family: inherit;
}
.search-header__input::placeholder { color: #64748b; }
.search-header__close {
  flex-shrink: 0; cursor: pointer; background: none; border: none;
}
.search-header__close kbd {
  font-size: 11px; padding: 2px 6px; border-radius: 4px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #64748b; font-family: inherit;
}

/* ─── Results ─── */
.search-results {
  flex: 1; overflow-y: auto; padding: 8px;
}
.search-empty {
  padding: 32px 16px; text-align: center;
  color: #64748b; font-size: 14px;
}

/* ─── Hit ─── */
.search-hit {
  display: block; padding: 12px 14px; border-radius: 8px;
  cursor: pointer; text-decoration: none; color: inherit;
  transition: background 0.1s ease;
  border: 1px solid transparent;
}
.search-hit:hover,
.search-hit--selected {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(99, 102, 241, 0.3);
}
.search-hit__breadcrumbs {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
  font-size: 13px; font-weight: 500; color: #e2e8f0;
  margin-bottom: 4px;
}
.search-hit__separator {
  color: #475569; font-size: 12px;
}
.search-hit__content {
  font-size: 13px; line-height: 1.6; color: #94a3b8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.search-hit__content mark {
  background: rgba(99, 102, 241, 0.25);
  color: #a5b4fc;
  padding: 1px 2px;
  border-radius: 2px;
}

/* ─── Footer ─── */
.search-footer {
  display: flex; align-items: center; gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}
.search-footer__hint {
  font-size: 12px; color: #475569;
}
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
