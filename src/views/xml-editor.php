<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>XML Editor</title>
  <style>
    #editor {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>

<h2>XML Editor (Monaco)</h2>
<div id="editor"></div>

<!-- Load Monaco Editor -->
<script src="https://unpkg.com/monaco-editor@latest/min/vs/loader.js"></script>
<script>
  require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    monaco.editor.create(document.getElementById('editor'), {
      value: `<note>
  <to>User</to>
  <from>ChatGPT</from>
  <heading>Reminder</heading>
  <body>Don't forget to try Monaco!</body>
</note>`,
      language: 'xml',
      theme: 'vs-light',
      automaticLayout: true
    });
  });
</script>

</body>
</html>
