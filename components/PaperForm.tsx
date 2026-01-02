
import React, { useState, useRef } from 'react';
import { analyzePaper } from '../services/geminiService';
import { Paper } from '../types';

interface PaperFormProps {
  onAdd: (paper: Paper) => void;
  onClose: () => void;
}

const PaperForm: React.FC<PaperFormProps> = ({ onAdd, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    url: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const analysisInput = formData.abstract || formData.title;
      const aiData = await analyzePaper(analysisInput, imagePreview || undefined);
      
      const newPaper: Paper = {
        id: crypto.randomUUID(),
        title: aiData.title || formData.title || "无标题论文",
        authors: aiData.authors || formData.authors,
        abstract: formData.abstract,
        category: aiData.category || "未分类",
        tags: aiData.tags || [],
        url: formData.url,
        dateAdded: new Date().toISOString(),
        aiSummary: aiData.aiSummary,
        status: 'analyzed'
      };
      
      onAdd(newPaper);
      onClose();
    } catch (error) {
      console.error("AI 分析失败", error);
      alert("论文分析失败。请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">添加新论文</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">论文标题 (若使用 AI 分析可不填)</label>
            <input 
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="例如: Attention Is All You Need"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">摘要 / 内容片段</label>
            <textarea 
              rows={4}
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="粘贴摘要或相关文本，以便 AI 进行智能分类..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">论文截图 / 参考图片 (可选)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600">
                    <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500">点击上传图片</span>
                    <p className="pl-1 text-slate-500">或拖拽至此</p>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">论文链接</label>
            <input 
              type="url"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="https://arxiv.org/abs/..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              disabled={loading || (!formData.title && !formData.abstract && !imagePreview)}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  分析中...
                </>
              ) : "添加并 AI 分类"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaperForm;
