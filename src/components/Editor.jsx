// CreateBlog.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useRef, useState } from "react";
import convetToUncodeFullMarkup from "../utils/convert";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Table from "@tiptap/extension-table";
import "../App.css";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

const TiptapEditor = () => {
  // State for title and content
  const [krutidevText, setKrutidevText] = useState("");
  const [unicodeText, setUnicodeText] = useState("");
  // const [loading, setLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState(false);
  const [isFirstFocus, setIsFirstFocus] = useState(true)
  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        transformPastedHTML(html) {
          console.log("Original Pasted HTML:", html); // Debugging

          // Replace Unicode characters used by MS Word for backticks
          return html
            .replace(/[\u2018\u2019]/g, "'") // Curly single quotes → straight
            .replace(/[\u201C\u201D]/g, '"') // Curly double quotes → straight
            .replace(/`/g, "&#96;") // Preserve backticks as HTML entities
            .replace(/<meta[^>]*>/gi, ""); // Remove any Word metadata
        },
      }),
      // {
      //   name: 'indent',
      //   addCommands() {
      //   return {
      //     indent: () => ({ commands }) => {
      //       return commands.setNode('paragraph', { indent: 1 });
      //     },
      //     outdent: () => ({ commands }) => {
      //       return commands.setNode('paragraph', { indent: -1 });
      //     },
      //   };
      // },
      // addKeyboardShortcuts() {
      //   return {
      //     'Tab': () => this.editor.commands.indent(),
      //     'Shift-Tab': () => this.editor.commands.outdent(),
      //   };
      // },
      // },

      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph','table','TableCell','TableHeader','TableRow'], // Enable alignment for these elements
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { style: "border:1px solid black; border-collapse:collapse;"}

      }),
      TableRow.configure({
        HTMLAttributes: { style: "border:1px solid black;"}
      }),
      TableHeader.configure({
        HTMLAttributes: { style: "border:1px solid black;"}
      }),
      TableCell.configure({
        HTMLAttributes: { style: "border:1px solid black;"}
      }),
    ],
    injectCSS: {},
    content:";gk¡ Øqrhnso VsDLV isLV@Vkbi djsa---",
    onFocus: ({ editor }) => {
      if (isFirstFocus || editor.getHTML().toString()==="<p>;gk¡ Øqrhnso VsDLV isLV@Vkbi djsa---</p>") {
        console.log(editor.getHTML())
        editor.commands.clearContent(true) // Clears content on first focus
        setIsFirstFocus(false)

      }
    },
    onBlur : ({editor})=>{
      const msg = editor.getHTML().toString();
      console.log(msg)
      if(msg==="<p></p>"){
        editor.commands.setContent(";gk¡ Øqrhnso VsDLV isLV@Vkbi djsa---")
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setKrutidevText(html);
    },
  });

  const contentRef = useRef(null);

  const copyToClipboard = () => {
    if (!contentRef.current) return;

    try {
      // Clone content to modify without changing original
      const tempDiv = contentRef.current.cloneNode(true);
      document.body.appendChild(tempDiv); // Attach to DOM temporarily

      // Preserve spaces and tabs in text nodes
      const traverseAndReplace = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.nodeValue = node.nodeValue.replace(/ /g, "\u00A0").replace(/\t/g, "\u00A0\u00A0\u00A0\u00A0");
        } else {
          node.childNodes.forEach(traverseAndReplace);
        }
      };

      traverseAndReplace(tempDiv);

      // Create a Range and select the modified content
      const range = document.createRange();
      range.selectNodeContents(tempDiv); // Select the entire content

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Copy selected content
      document.execCommand("copy");

      // Cleanup: Remove tempDiv from the DOM
      document.body.removeChild(tempDiv);
      selection.removeAllRanges();

      alert("Copied successfully! Try pasting into Word or Gmail.");
    } catch (err) {
      console.error("Copy failed", err);
      alert("Failed to copy.");
    }
  };


  const handleConvert = () => {
    // handleConvertDiv()
    setUnicodeText(convetToUncodeFullMarkup(krutidevText));
    console.log(krutidevText);
    setCopyStatus(false)
  };

  if (!editor) {
    return null;
  }

  const handlePaste = async ({editor}) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      editor.commands.setContent(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
      alert("Could not access clipboard. Please allow clipboard permissions.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(unicodeText.toString());
      setCopyStatus(true);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
      alert("Could not access clipboard. Please allow clipboard permissions.");
    }
  };



  // function handleConvertDiv(){

  //   if (!myDiv.current) return;

    
  //     let htmlContent = myDiv.current.innerHTML;

  //     // Preserve white spaces only inside text nodes
  //     htmlContent = htmlContent.replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

  //     // Wrap content in a <div> to ensure full structure (including tables)
  //     const wrappedHtml = `<div>${htmlContent}</div>`;
  //     setKrutidevText(wrappedHtml)
  //     // Create a Blob with HTML data
  //     const blob = new Blob([wrappedHtml], { type: "text/html" });
  //     const clipboardItem = new ClipboardItem({ "text/html": blob });
  //     setKrutidevText(clipboardItem)
  //     console.log(clipboardItem[1])
  //     // Copy to clipboard
  //     // await navigator.clipboard.write([clipboardItem]);

  //     // alert("Copied successfully!");
  // }
  
  return (
    <div className="shadow-xl grid  min-w-[80vw] min-h-[25vh] md:min-h-[50vh] items-center ">
      
      {/* <div ref={myDiv} contentEditable className="min-h-[50vh] w-full border border-black text-justify">
      </div> */}
      
      {/* Title */}
      <div
        className="bg-gradient-to-r to-purple-500 from-black 100%       
         rounded-t-md  text-center text-2xl text-gray-200 md:text-4xl md:p-5 p-3">
        Krutidev to Unicode
      </div>

      {/* conversion window */}
      <div className="grid md:grid-cols-10 md:gap-0 gap-2 ">
        {/* textarea for krutidev */}

        <div className="md:col-span-4 border border-y-0 border-purple-400">
          <div className="" onClick={() => editor?.commands.focus()}>
            <EditorContent
              spellCheck="false"
              className="tiptap-editor"
              editor={editor}
            
            />
          </div>

          <div className=" bg-purple-500 border-0">
              <button
                onClick={() => {
                  setCopyStatus(false);
                  setKrutidevText("");
                  setUnicodeText("");
                }}>
                <span>Clear</span>
              </button>
          </div>
        </div>

        {/* Button & loader for conversion action */}
        <div className="md:col-span-2 grid bg-purple-500 justify-center items-center ">
          <button onClick={handleConvert}>Convert</button>
        </div>

        
    {/* Unicode window */}
        <div className="md:col-span-4 border border-y-0 border-purple-400">
          <div ref={contentRef}
            className="div-editor ProseMirror bg-purple-500"
            dangerouslySetInnerHTML={{ __html: unicodeText }}>
          </div>

          <div className=" bg-purple-500 border-0">
            <button onClick={copyToClipboard}>
              {copyStatus ? <span>Copied &#10004;</span> : <span>Copy</span>}
            </button>
          </div>
        </div>
      </div>

      {/* End of conversion window  */}

      {/* Footer starts here */}
      <div className="bg-gradient-to-r from-purple-500  to-black   rounded-b-md text-center text-gray-300 text-sm md:text-base p-4 font-cursive ">
        Copyright &copy; 2025. All rights reserved.
      </div>
    </div>
  );
};
export default TiptapEditor;
