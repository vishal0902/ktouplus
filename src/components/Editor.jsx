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
import Text from "@tiptap/extension-text";


const TiptapEditor = () => {
  const contentRef = useRef(null);
  // State for title and content
  const [krutidevText, setKrutidevText] = useState("");
  const [unicodeText, setUnicodeText] = useState("");
  // const [loading, setLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState(false);
  const [isFirstFocus, setIsFirstFocus] = useState(true)



  const CustomText = Text.extend({
    addKeyboardShortcuts () {
      return{
        Tab: () => this.editor.commands.insertContent('\t'),
      }
    }
  })

  const editor = useEditor({
    extensions: [
      CustomText,
      StarterKit.configure({
        text: false,
        code: false
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph','table','TableCell','TableHeader','TableRow'], // Enable alignment for these elements
      }),
      Table.configure({
        resizable: true,
        // HTMLAttributes: { style: "border:1px solid black; border-collapse:collapse;"}

      }),
      TableRow.configure({
        resizable:true,
        // HTMLAttributes: { style: "border:1px solid black;"}
      }),
      TableHeader.configure({
        resizable:true,
        // HTMLAttributes: { style: "border:1px solid black;"}
      }),
      TableCell.configure({
        resizable:true,
        // HTMLAttributes: { style: "border:1px solid black;"}
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

 
  
  

  const handleCopy = () =>{
    const div = document.getElementById('outputDiv')
    const range= document.createRange()
    range.selectNode(div)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand('copy')
    window.getSelection().removeAllRanges();
    setCopyStatus(true)
  }


  const handleConvert = () => {
    // handleConvertDiv()
    setUnicodeText(convetToUncodeFullMarkup(krutidevText));
    console.log(krutidevText);
    setCopyStatus(false)
  };

  if (!editor) {
    return null;
  }


  
  return (
    <div className="shadow-xl grid  min-w-[80vw] min-h-[25vh] md:min-h-[50vh] items-center ">
    
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
          <pre>
          <div className="" onClick={() => editor?.commands.focus()}>
            <EditorContent
              spellCheck="false"
              className="tiptap-editor"
              editor={editor}
            
            />
          </div>
          </pre>

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
          <pre>
          <div id="outputDiv"  ref={contentRef} 
            className="div-editor bg-purple-500"
            dangerouslySetInnerHTML={{ __html: unicodeText }}>
          </div>
          </pre>

          <div className=" bg-purple-500 border-0">
            <button onClick={handleCopy}>
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
