import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from '@/components/Tiptap/extensions/FontSize';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import ImageResize from 'tiptap-extension-resize-image';
import Image from '@tiptap/extension-image';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, 
  MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft, 
  MdFormatAlignCenter, MdFormatAlignRight, 
  MdTextFields, MdFormatColorText, MdAdd, MdAddPhotoAlternate, 
  MdTableChart, MdUndo, MdRedo, MdCode, MdVisibility } from 'react-icons/md';
import { GrBlockQuote } from "react-icons/gr";
import { BiCodeBlock } from "react-icons/bi";
import { FaYoutube } from "react-icons/fa6"
import { Divider, Tooltip, MenuItem, Select, TextareaAutosize } from '@mui/material';
import useLanguage from '@/hooks/useLanguage';
import Upload from '../utils/Upload';
import { Dialog, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TiptapEditor = ({ content, onChange }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#000000');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [heading, setHeading] = useState('paragraph');
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content || '<p>Start typing here...</p>');
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [files, setFiles] = useState(null);

  const { lang } = useLanguage();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5] }), // รองรับ H1 - H5
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
      Blockquote,
      CodeBlock,
      Table.configure({ resizable: true }), // เปิดให้ปรับขนาดตาราง
      TableRow,
      TableCell,
      TableHeader,
      Image,
      ImageResize,
    ],
    content: editorContent || '<p>Start typing here...</p>',
    onUpdate: ({ editor }) => {
      if (!isHtmlMode) {
        onChange(editor.getHTML());
        setHtmlContent(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    setEditorContent(content); // ✅ อัปเดตค่าทุกครั้งที่เปลี่ยนภาษา
    if (editor) {
        editor.commands.setContent(content, false); // ✅ รีเซ็ตค่าตามภาษาใหม่
    }
  }, [content]);

  // ตรวจสอบ Heading ปัจจุบันเมื่อมีการเปลี่ยนแปลง selection
  useEffect(() => {
    if (!editor) return;

    const updateHeadingState = () => {
      if (editor.isActive("paragraph")) {
        setHeading("paragraph");
      } else {
        for (let level = 1; level <= 5; level++) {
          if (editor.isActive("heading", { level })) {
            setHeading(`h${level}`);
            return;
          }
        }
      }
    };

    editor.on("selectionUpdate", updateHeadingState);

    return () => {
      editor.off("selectionUpdate", updateHeadingState);
    };
  }, [editor]);

  useEffect(() => {
    if (files && files.url) {
      editor.chain().focus().setImage({ src: files.url }).run();
    }
  }, [files, editor]);

  if (!editor) return null;

  // อัปโหลดรูปภาพไปที่ Firebase Storage
  const handleImageUpload = (image) => {
    console.log('image', image);
    if (image && image.length > 0) {
      setFiles(image[0]); // เก็บค่าภาพที่อัปโหลด
    }
  };

  console.log('files', files);

  const handleImageDialogOpen = () => {
    setFiles(null);
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
  };

  // เปลี่ยน Heading
  const handleHeadingChange = (value) => {
    console.log(value);
    console.log(editor.isActive('heading'));
    setHeading(value);
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(value.replace("h", "")) }).run();
    }
  };

  // Toggle HTML Mode
  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // กลับมาเป็น WYSIWYG และอัปเดตเนื้อหา
      editor.commands.setContent(htmlContent);
    }
    setIsHtmlMode(!isHtmlMode);
  };

  return (
    <div className="editor-wrapper">
      {/* Toolbar */}
      <div className="toolbar items-center bg-gray-100 w-full dark:bg-gray-700 dark:text-white">
        <Tooltip title={lang["undo"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <MdUndo />
          </button>
        </Tooltip>
        <Tooltip title={lang["redo"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <MdRedo />
          </button>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Heading Dropdown */}
        <Select
          value={heading}
          onChange={(e) => handleHeadingChange(e.target.value)}
          sx={{ height: "30px", minHeight: "30px" }} // ปรับความสูงของ Select
        >
          <MenuItem value="paragraph">
            <p style={{ fontSize: "16px", margin: 0 }}>Paragraph</p>
          </MenuItem>
          {[1, 2, 3, 4, 5].map((level) => (
            <MenuItem key={level} value={`h${level}`}>
              <span style={{ fontSize: `${24 - level * 2}px`, fontWeight: "bold", margin: 0 }}>
                Heading {level}
              </span>
            </MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem />

        {/* Text Align */}
        <Tooltip title={lang["alignleft"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}>
            <MdFormatAlignLeft />
          </button>
        </Tooltip>
        <Tooltip title={lang["aligncenter"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}>
            <MdFormatAlignCenter />
          </button>
        </Tooltip>
        <Tooltip title={lang["alignright"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}>
            <MdFormatAlignRight />
          </button>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Font Style Buttons */}
        <Tooltip title={lang["bold"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
            <MdFormatBold />
          </button>
        </Tooltip>
        <Tooltip title={lang["italic"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
            <MdFormatItalic />
          </button>
        </Tooltip>
        <Tooltip title={lang["underline"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>
            <MdFormatUnderlined />
          </button>
        </Tooltip>

        {/* Font Size Dropdown */}
        <Tooltip title={lang["fontsize"]} placement="bottom" arrow>
          <select
            className="text-sm rounded-xl bg-white px-2 py-0.5 text-black dark:bg-gray-900 dark:text-white"
            onChange={(e) => {
              setFontSize(e.target.value);
              editor.chain().focus().setFontSize(e.target.value).run();
            }}
            value={fontSize}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
        </Tooltip>

        {/* Font Size Increment/Decrement */}
        <Tooltip title={lang["decreasefontsize"]} placement="bottom" arrow>
          <button onClick={() => {
            const newSize = `${parseInt(fontSize) - 1}px`;
            setFontSize(newSize);
            editor.chain().focus().setFontSize(newSize).run();
          }}>A−</button>
        </Tooltip>

        <Tooltip title={lang["increasefontsize"]} placement="bottom" arrow>
          <button onClick={() => {
            const newSize = `${parseInt(fontSize) + 1}px`;
            setFontSize(newSize);
            editor.chain().focus().setFontSize(newSize).run();
          }}>A+</button>
        </Tooltip>

        {/* Font Color Picker */}
        <Tooltip title={lang["fontcolor"]} placement="bottom" arrow>
          <input
            type="color"
            onChange={(e) => {
              setFontColor(e.target.value);
              editor.chain().focus().setColor(e.target.value).run();
            }}
            value={fontColor}
            className="color-picker"
          />
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Bullet List */}
        <Tooltip title={lang["bulletlist"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>
            <MdFormatListBulleted />
          </button>
        </Tooltip>

        {/* Ordered List */}
        <Tooltip title={lang["numberlist"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>
            <MdFormatListNumbered />
          </button>
        </Tooltip>

        {/* Create Table */}
        <Tooltip title={lang["table"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <MdTableChart />
          </button>
        </Tooltip>

        <Tooltip title={lang["youtube"]} placement="bottom" arrow>
          <button onClick={() => alert('Embed Youtube!')}><FaYoutube /></button>
        </Tooltip>
        {/* Upload Image */}
        <Tooltip title={lang["upload"]} placement="bottom" arrow>
          <label htmlFor="upload-image">
            <button
              onClick={handleImageDialogOpen}
            >
              <MdAddPhotoAlternate />
            </button>
          </label>
        </Tooltip>
        <Tooltip title={lang["blockquote"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()}><GrBlockQuote /></button>
        </Tooltip>
        <Tooltip title={lang["codeblock"]} placement="bottom" arrow>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}><BiCodeBlock /></button>
        </Tooltip>

        <Tooltip title={isHtmlMode ? "Switch to WYSIWYG Mode" : "Edit HTML Code"} placement="bottom" arrow>
          <button onClick={toggleHtmlMode}>
            {isHtmlMode ? <MdVisibility /> : <MdCode />}
          </button>
        </Tooltip>
      </div>

      {/* Toggle ระหว่าง WYSIWYG และ HTML Mode */}
      <div className="editor-container bg-white text-black">
        {isHtmlMode ? (
          <TextareaAutosize
            className="html-editor w-full p-2 border border-gray-300 rounded"
            minRows={10}
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
          />
        ) : (
          <EditorContent editor={editor} className="tiptap w-full" />
        )}
      </div>
      <Dialog
        open={openImageDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleImageDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Upload 
          handleCloseForm={handleImageDialogClose}
          setFiles={(image) => handleImageUpload(image)}
          newUpload={!files}
        />
      </Dialog>
    </div>
  );
};

export default TiptapEditor;
