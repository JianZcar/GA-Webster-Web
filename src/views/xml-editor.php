<div class="h-full relative pt-4" x-data>
  <!-- Tabs -->
  <div class="tabs tabs-border">
    <input type="radio" name="xml-tabs" class="tab" aria-label="Tab 1"
      :checked="!('active' in window) || window.active === 'tab1'"
      @change="window.active = 'tab1'; window.aceEditorInstance.setValue(window.tabs[window.active], -1)" />
    <input type="radio" name="xml-tabs" class="tab" aria-label="Tab 2"
      :checked="window.active === 'tab2'"
      @change="window.active = 'tab2'; window.aceEditorInstance.setValue(window.tabs[window.active], -1)" />
    <input type="radio" name="xml-tabs" class="tab" aria-label="Tab 3"
      :checked="window.active === 'tab3'"
      @change="window.active = 'tab3'; window.aceEditorInstance.setValue(window.tabs[window.active], -1)" />
  </div>

  <!-- Editor -->
  <div id="editor" class="absolute inset-0 h-full"></div>
</div>

<script>
  if (typeof window.tabs === 'undefined') {
    window.tabs = {
      tab1: '<note><to>Tab 1</to></note>',
      tab2: '<note><to>Tab 2</to></note>',
      tab3: '<note><to>Tab 3</to></note>',
    };
  }

  if (typeof window.active === 'undefined') {
    window.active = 'tab1';
  }

  window.aceEditorInstance = ace.edit("editor", {
    mode: "ace/mode/xml",
    theme: "ace/theme/chrome",
    fontSize: "16px"
  });

  window.aceEditorInstance.setValue(window.tabs[window.active], -1);

  // Sync changes
  window.aceEditorInstance.getSession().on("change", () => {
    window.tabs[window.active] = window.aceEditorInstance.getValue();
  });

  // Auto theme
  window.applyTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.aceEditorInstance.setTheme(isDark ? "ace/theme/monokai" : "ace/theme/chrome");
  };

  window.applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", applyTheme);
</script>
