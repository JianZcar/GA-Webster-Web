<div class="h-full relative pt-4">
  <div id="editor" class="absolute inset-0 h-full"></div>
</div>

<script>
  window.aceEditorInstance = ace.edit("editor", {
    mode: "ace/mode/xml",
    theme: "ace/theme/chrome",
    fontSize: "16px"
  });

  // Log changes
  window.aceEditorInstance.getSession().on("change", () => {
    console.log(editor.getValue());
  });

  // Function to apply theme based on dark mode
  function applyTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = isDark ? "ace/theme/monokai" : "ace/theme/chrome";
    window.aceEditorInstance.setTheme(theme);
  }

  // Initial theme application
  applyTheme();

  // Optional: Listen for system dark/light mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", applyTheme);
</script>
