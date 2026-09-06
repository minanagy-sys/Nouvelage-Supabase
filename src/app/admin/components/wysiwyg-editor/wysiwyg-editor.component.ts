import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrl: './wysiwyg-editor.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygEditorComponent),
      multi: true
    }
  ]
})
export class WysiwygEditorComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Start writing...';
  @Input() minHeight: string = '400px';

  content: string = '';
  showImageUrlDialog: boolean = false;
  showLinkDialog: boolean = false;
  showTableDialog: boolean = false;
  showColorPicker: boolean = false;
  showBgColorPicker: boolean = false;
  imageUrl: string = '';
  linkUrl: string = '';
  linkText: string = '';
  tableRows: number = 3;
  tableCols: number = 3;
  selectedColor: string = '#000000';
  selectedBgColor: string = '#ffffff';
  selectedFontSize: string = '16px';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.content = value || '';
    this.updateEditorContent();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onContentChange(event: any): void {
    const newContent = event.target.innerHTML;
    this.content = newContent;
    this.onChange(newContent);
    this.onTouched();
  }

  execCommand(command: string, value: string | null = null): void {
    document.execCommand(command, false, value || undefined);
    this.updateContent();
  }

  formatBlock(tag: string): void {
    document.execCommand('formatBlock', false, tag);
    this.updateContent();
  }

  insertImage(): void {
    this.showImageUrlDialog = true;
  }

  confirmInsertImage(): void {
    if (this.imageUrl) {
      document.execCommand('insertImage', false, this.imageUrl);
      this.updateContent();
    }
    this.showImageUrlDialog = false;
    this.imageUrl = '';
  }

  insertLink(): void {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      this.linkText = selection.toString();
    }
    this.showLinkDialog = true;
  }

  confirmInsertLink(): void {
    if (this.linkUrl) {
      const link = `<a href="${this.linkUrl}" target="_blank">${this.linkText || this.linkUrl}</a>`;
      document.execCommand('insertHTML', false, link);
      this.updateContent();
    }
    this.showLinkDialog = false;
    this.linkUrl = '';
    this.linkText = '';
  }

  cancelDialog(): void {
    this.showImageUrlDialog = false;
    this.showLinkDialog = false;
    this.imageUrl = '';
    this.linkUrl = '';
    this.linkText = '';
  }

  insertHtml(html: string): void {
    document.execCommand('insertHTML', false, html);
    this.updateContent();
  }

  private updateContent(): void {
    const editor = document.querySelector('.wysiwyg-content') as HTMLElement;
    if (editor) {
      this.content = editor.innerHTML;
      this.onChange(this.content);
    }
  }

  private updateEditorContent(): void {
    setTimeout(() => {
      const editor = document.querySelector('.wysiwyg-content') as HTMLElement;
      if (editor && editor.innerHTML !== this.content) {
        editor.innerHTML = this.content;
      }
    }, 0);
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        document.execCommand('insertImage', false, base64);
        this.updateContent();
      };
      reader.readAsDataURL(file);
    }
  }

  // Color picker methods
  openColorPicker(): void {
    this.showColorPicker = true;
    this.showBgColorPicker = false;
  }

  openBgColorPicker(): void {
    this.showBgColorPicker = true;
    this.showColorPicker = false;
  }

  applyTextColor(): void {
    document.execCommand('foreColor', false, this.selectedColor);
    this.updateContent();
    this.showColorPicker = false;
  }

  applyBgColor(): void {
    document.execCommand('backColor', false, this.selectedBgColor);
    this.updateContent();
    this.showBgColorPicker = false;
  }

  // Font size
  applyFontSize(): void {
    document.execCommand('fontSize', false, '7');
    const fontElements = document.querySelectorAll('font[size="7"]');
    fontElements.forEach((el: any) => {
      el.removeAttribute('size');
      el.style.fontSize = this.selectedFontSize;
    });
    this.updateContent();
  }

  // Table insertion
  insertTable(): void {
    this.showTableDialog = true;
  }

  confirmInsertTable(): void {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < this.tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < this.tableCols; j++) {
        tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table><p><br></p>';
    document.execCommand('insertHTML', false, tableHTML);
    this.updateContent();
    this.showTableDialog = false;
  }

  // Quote block
  insertQuote(): void {
    const quote = '<blockquote style="border-left: 4px solid var(--gold); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #666;">Quote text here</blockquote><p><br></p>';
    document.execCommand('insertHTML', false, quote);
    this.updateContent();
  }

  // Code block
  insertCodeBlock(): void {
    const code = '<pre style="background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto;"><code>Code here</code></pre><p><br></p>';
    document.execCommand('insertHTML', false, code);
    this.updateContent();
  }

  // Horizontal rule
  insertHR(): void {
    document.execCommand('insertHorizontalRule');
    this.updateContent();
  }
}
