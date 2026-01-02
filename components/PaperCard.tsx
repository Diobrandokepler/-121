
import React from 'react';
import { Paper } from '../types';

interface PaperCardProps {
  paper: Paper;
  onDelete: (id: string) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
          {paper.category}
        </span>
        <button 
          onClick={() => onDelete(paper.id)}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="删除论文"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
        {paper.title}
      </h3>
      
      <p className="text-sm text-slate-500 mb-4 italic">
        {paper.authors || "未知作者"}
      </p>
      
      {paper.aiSummary && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-700 leading-relaxed border-l-4 border-indigo-400">
          <p className="font-semibold text-xs text-indigo-600 uppercase mb-1">AI 摘要</p>
          {paper.aiSummary}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {paper.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <span className="text-[11px] text-slate-400">
          添加于 {new Date(paper.dateAdded).toLocaleDateString('zh-CN')}
        </span>
        {paper.url && (
          <a 
            href={paper.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            查看原文
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
