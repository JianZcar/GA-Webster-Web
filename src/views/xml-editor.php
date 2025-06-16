<div class="h-full relative pt-4">
  <div id="editor" class="absolute inset-0 h-full"></div>
</div>

<script>
  window.aceEditorInstance = ace.edit("editor", {
    mode: "ace/mode/xml",
    theme: "ace/theme/chrome",
    fontSize: "16px"
  });

  window.aceEditorInstance.getSession().on("change", () => {
    console.log(window.aceEditorInstance.getValue());
  });
</script>
