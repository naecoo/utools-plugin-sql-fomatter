function setup() {
  let fontSize = 14;

  // setup editor
  const editor = window.ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.setShowPrintMargin(false);
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    wrap: true,
  });
  const SqlMode = ace.require("ace/mode/sql").Mode;
  editor.session.setMode(new SqlMode());
  updateFontSize(0);

  // setup event
  const error = document.querySelector("#error");
  const cursor = document.querySelector("#cursor");
  const tabWidth = document.querySelector("#tabWidth");
  const language = document.querySelector("#language");
  const keywordCase = document.querySelector("#keywordCase");
  document.querySelector("#format").addEventListener("click", format);
  document.querySelector("#compress").addEventListener("click", compress);
  document.querySelector("#copy").addEventListener("click", copy);
  document.querySelector("#clear").addEventListener("click", clear);
  document.querySelectorAll(".font").forEach((el) => {
    el.addEventListener("click", (e) => {
      updateFontSize(Number(e.target.dataset.step));
    });
  });
  [tabWidth, language, keywordCase].forEach((el) => {
    el.addEventListener("change", format);
  });
  document.body.addEventListener("mousedown", updateCursorPosition, true);
  document.body.addEventListener("keydown", updateCursorPosition, true);

  function updateFontSize(step = 0) {
    if (typeof step !== "number" || isNaN(step)) return;

    fontSize = Math.min(Math.max(fontSize + step, 12), 24);
    editor.setFontSize(fontSize);
  }

  function updateCursorPosition() {
    const { row, column } = editor.getCursorPosition();
    cursor.innerText = `Ln ${row + 1}, Col ${column + 1}`;
  }

  function format() {
    try {
      error.style.display = "none";

      const config = {
        tabWidth: tabWidth.value,
        language: language.options[language.selectedIndex].value,
        keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
        dialect: window.sqlFormatter[language],
      };

      const formatedContent = window.sqlFormatter.format(
        editor.getValue(),
        config
      );

      editor.setValue(formatedContent);
      editor.clearSelection();
    } catch (e) {
      console.error(e);
      error.innerHTML = `
<h3>格式化错误</h3>
<p><strong>${e.message}</strong></p>
<p>调用栈:</p>
<pre>${e.stack.toString()}</pre>
`;
      error.style.display = "block";
    }
  }

  const re1 = /(\s){1,}/g;
  const re2 = /\n|\t|\b|\t|\r|\v/g;
  function compress() {
    const config = {
      language: language.options[language.selectedIndex].value,
      keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
      dialect: window.sqlFormatter[language],
      tabWidth: 1,
      denseOperators: true,
    };
    const content = window.sqlFormatter.format(editor.getValue(), config);
    const compressValue = content.replace(re1, " ").replace(re2, "").trim();
    editor.setValue(compressValue);
    editor.clearSelection();
  }

  function copy() {
    if (!window.utools) return;

    const content = editor.getValue();
    window.utools.copyText(content);
  }

  function clear() {
    editor.setValue("");
    editor.clearSelection();
  }
}

window.addEventListener("DOMContentLoaded", setup);
