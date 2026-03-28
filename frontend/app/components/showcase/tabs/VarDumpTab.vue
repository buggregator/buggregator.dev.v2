<script setup lang="ts">
import ValueDump from '~/shared/ui/value-dump/value-dump.vue'

// Real sf-dump HTML from Symfony VarDumper — rendered by ValueDump + callSfDump
const userDump = `<pre class=sf-dump id=sf-dump-900000001 data-indent-pad="  "><span class=sf-dump-note>App\\Models\\User</span> {<samp data-depth=1 class=sf-dump-expanded>
  +<span class=sf-dump-public title="Public property">id</span>: <span class=sf-dump-num>42</span>
  +<span class=sf-dump-public title="Public property">name</span>: "<span class=sf-dump-str title="8 characters">John Doe</span>"
  +<span class=sf-dump-public title="Public property">email</span>: "<span class=sf-dump-str title="16 characters">john@example.com</span>"
  +<span class=sf-dump-public title="Public property">email_verified_at</span>: "<span class=sf-dump-str>2024-01-15 09:23:11</span>"
  +<span class=sf-dump-public title="Public property">is_admin</span>: <span class=sf-dump-const>false</span>
  +<span class=sf-dump-public title="Public property">roles</span>: <span class=sf-dump-note>array:2</span> [<samp data-depth=2 class=sf-dump-compact>
    <span class=sf-dump-index>0</span> => "<span class=sf-dump-str>editor</span>"
    <span class=sf-dump-index>1</span> => "<span class=sf-dump-str>moderator</span>"
  </samp>]
  +<span class=sf-dump-public title="Public property">settings</span>: <span class=sf-dump-note>array:3</span> [<samp data-depth=2 class=sf-dump-compact>
    "<span class=sf-dump-key>theme</span>" => "<span class=sf-dump-str>dark</span>"
    "<span class=sf-dump-key>locale</span>" => "<span class=sf-dump-str>en</span>"
    "<span class=sf-dump-key>notifications</span>" => <span class=sf-dump-const>true</span>
  </samp>]
  +<span class=sf-dump-public title="Public property">created_at</span>: "<span class=sf-dump-str>2024-01-10 14:05:33</span>"
  +<span class=sf-dump-public title="Public property">updated_at</span>: "<span class=sf-dump-str>2024-03-28 11:42:07</span>"
</samp>}</pre>`

const orderDump = `<pre class=sf-dump id=sf-dump-900000002 data-indent-pad="  "><span class=sf-dump-note>array:5</span> [<samp data-depth=1 class=sf-dump-expanded>
  "<span class=sf-dump-key>product_id</span>" => <span class=sf-dump-num>42</span>
  "<span class=sf-dump-key>quantity</span>" => <span class=sf-dump-num>1</span>
  "<span class=sf-dump-key>total</span>" => <span class=sf-dump-num>29.99</span>
  "<span class=sf-dump-key>currency</span>" => "<span class=sf-dump-str title="3 characters">USD</span>"
  "<span class=sf-dump-key>user</span>" => <span class=sf-dump-note>array:3</span> [<samp data-depth=2 class=sf-dump-compact>
    "<span class=sf-dump-key>id</span>" => <span class=sf-dump-num>42</span>
    "<span class=sf-dump-key>name</span>" => "<span class=sf-dump-str>John Doe</span>"
    "<span class=sf-dump-key>email</span>" => "<span class=sf-dump-str>john@example.com</span>"
  </samp>]
</samp>]</pre>`

const dumps = [
  {
    label: 'ray()',
    time: '1s ago',
    source: 'app/Http/Controllers/UserController.php:42',
    type: 'App\\Models\\User',
    value: userDump,
  },
  {
    label: 'dump()',
    time: '3s ago',
    source: 'app/Services/OrderService.php:87',
    type: 'array:5',
    value: orderDump,
  },
]
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(dump, i) in dumps"
      :key="i"
      class="overflow-hidden border-l-[3px] bg-[#0f1117]"
      style="border-left-color: #06b6d4;"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-2.5 bg-[#0a0c10] border-b border-landing-border-subtle">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold" style="background: rgba(6,182,212,0.15); color: #22d3ee;">
            <span class="w-1.5 h-1.5 rounded-full" style="background: #06b6d4;" />
            {{ dump.label }}
          </span>
          <span class="font-mono text-[10px] text-on-dark-muted">{{ dump.type }}</span>
          <span class="font-mono text-[10px] text-on-dark-muted">· {{ dump.source }}</span>
        </div>
        <span class="font-mono text-xs text-on-dark-muted">{{ dump.time }}</span>
      </div>

      <!-- Dump content -->
      <div class="px-4 py-3">
        <ValueDump :value="dump.value" />
      </div>
    </div>
  </div>
</template>
