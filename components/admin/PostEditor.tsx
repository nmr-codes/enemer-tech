"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react"

const lowlight = createLowlight(common)

interface PostEditorProps {
  content: string
  onChange: (html: string) => void
}

export function PostEditor({ content, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Override codeBlock to use Lowlight instead
      }),
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt("Enter link URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-background dark:bg-neutral-900">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("bold") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("italic") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("code") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("heading", { level: 1 }) ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("heading", { level: 2 }) ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("heading", { level: 3 }) ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("bulletList") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("orderedList") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("blockquote") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
            editor.isActive("link") ? "text-brand bg-neutral-200 dark:bg-neutral-800" : ""
          }`}
          title="Hyperlink"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="editor-content-area">
        <EditorContent
          editor={editor}
          className="p-4 min-h-[350px] prose dark:prose-invert max-w-none focus:outline-none dark:text-neutral-200"
        />
      </div>
    </div>
  )
}
