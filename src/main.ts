import { format, FormatOptionsWithLanguage } from "sql-formatter";
import "./style.css";

window.addEventListener("load", () => {
  const contentRef = document.querySelector("#content")! as HTMLTextAreaElement;
  const formatBtn = document.querySelector("#format")!;
  const copyBtn = document.querySelector("#copy")!;
  const clearBtn = document.querySelector("#clear")!;

  let content = "";

  const options: FormatOptionsWithLanguage = {
    language: "mysql",
    tabWidth: 2,
    useTabs: false,
    keywordCase: "upper",
  };

  contentRef.addEventListener("input", () => {
    content = contentRef.value;
  });

  formatBtn.addEventListener("click", () => {
    try {
      content = format(content, options);
    } catch (e) {
      console.warn(e);
    }
    
    contentRef.value = content;
  });

  copyBtn.addEventListener("click", () => {
    utools.copyText(content);
  });

  clearBtn.addEventListener("click", () => {
    content = "";
    contentRef.value = content;
  });
});
