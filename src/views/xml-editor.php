<div class="h-full relative pt-4">
  <div id="editor" class="absolute inset-0 h-full"></div>
</div>

<script>
  window.aceEditorInstance = ace.edit("editor", {
    mode: "ace/mode/xml",
    theme: "ace/theme/chrome",
    fontSize: "16px"
  });

  window.aceEditorInstance.setValue(window.xmlData, 1);

  window.aceEditorInstance.getSession().on("change", () => {
    window.xmlData = window.aceEditorInstance.getValue();
  });

  function applyTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = isDark ? "ace/theme/monokai" : "ace/theme/chrome";
    window.aceEditorInstance.setTheme(theme);
  }
  applyTheme();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", applyTheme);
</script>
