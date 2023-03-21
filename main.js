let editor = null;
let theme = "light";

function setupEditor() {
  editor = window.ace.edit("editor");

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

  setFontSize();
  switchTheme();

  // todo:
  editor.on("selectionChange", () => {
    console.log("input");
  });
}

function switchTheme() {
  if (theme === "light") {
    editor.setTheme("ace/theme/monokai");
    theme = "dark";
  } else {
    editor.setTheme("");
    theme = "light";
  }
}

function setFontSize(size = 14) {
  editor.setFontSize(size);
}

function setupEvent() {
  document.querySelector("#format").addEventListener("click", format);
  document.querySelector("#compress").addEventListener("click", compress);
  document.querySelector("#copy").addEventListener("click", copy);
  document.querySelector("#clear").addEventListener("click", clear);
}

function format() {
  const content = editor.getValue();
  const formatedContent = window.sqlFormatter.format(content);
  editor.setValue(formatedContent);
  editor.clearSelection();
}

function compress() {
  const content = editor.getValue();
  const compressValue = content
    .replace(/(\s){1,}/g, " ")
    .replace(/\\n|\\t|\\b/g, "")
    .trim();
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

window.addEventListener("load", () => {
  setupEditor();
  setupEvent();
});
