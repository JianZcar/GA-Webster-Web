<!DOCTYPE html>
<html lang="en" class="h-full">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GAxWebster</title>
  <?php include_once(__DIR__ . '/../includes/imports.php'); ?>
</head>

<body class="h-full m-0 p-0">
  <div
    x-data="{
      current: 'roadedit',
      opacity: 100,
      switching: false,
      syncTab() {
        try {
          const p = $refs.iframe?.contentWindow?.location?.pathname?.split('/')?.[1] || 'roadedit';
          if (p && p !== this.current) {
            this.current = p;
          }
        } catch (_) {}
      },
      setTab(tab) {
        if (this.switching || tab === this.current) return;
        this.switching = true;
        this.opacity = 0;

        setTimeout(() => {
          this.current = tab;
        }, 100); 

        setTimeout(() => this.switching = false, 600);
      }
    }"
    class="h-full flex flex-col">

    <!-- Tabs -->
    <div class="flex px-4 pt-4 gap-4 text-sm">
      <button
        class="px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-100"
        :class="{ 'font-bold border-b-2 border-black': current === 'roadedit' }"
        @click="setTab('roadedit')">
        Road Editor
      </button>
      <button
        class="px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-100"
        :class="{ 'font-bold border-b-2 border-black': current === 'about' }"
        @click="setTab('about')">
        About
      </button>
    </div>

    <!-- Iframe -->
    <div class="h-full w-full" :class="{ 'p-4': current === 'roadedit' }">
      <iframe
        x-ref="iframe"
        :src="`/${current}`"
        class="h-full w-full rounded-lg transition-opacity duration-100"
        :class="{ 'border-2 border-slate-500/50 shadow-md': current === 'roadedit' }"
        :style="`opacity: ${opacity / 100}`"
        @load="setTimeout(() => opacity = 100, 10); syncTab()"></iframe>
    </div>

  </div>
</body>

</html>
