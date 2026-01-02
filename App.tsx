
import React, { useState, useEffect, useMemo } from 'react';
import { Paper, ViewMode } from './types';
import PaperCard from './components/PaperCard';
import PaperForm from './components/PaperForm';
import StatsBoard from './components/StatsBoard';

const App: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIBRARY);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('scholarflow_papers');
    if (saved) {
      try {
        setPapers(JSON.parse(saved));
      } catch (e) {
        console.error("加载论文失败", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scholarflow_papers', JSON.stringify(papers));
  }, [papers]);

  const categories = useMemo(() => {
    const cats = new Set(papers.map(p => p.category));
    return ['全部', ...Array.from(cats)].sort();
  }, [papers]);

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.authors.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [papers, searchQuery, selectedCategory]);

  const addPaper = (paper: Paper) => {
    setPapers(prev => [paper, ...prev]);
  };

  const deletePaper = (id: string) => {
    if (confirm("确定要删除这篇论文吗？")) {
      setPapers(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.827c.097-.033.202-.033.298 0l5.443 1.9c.759.265.759 1.351 0 1.615l-5.443 1.9a.45.45 0 01-.298 0l-5.443-1.9c-.759-.265-.759-1.351 0-1.615l5.443-1.9zM6.713 9.634l.45-1.96.539.188a1.85 1.85 0 011.148 1.415l.13.52a.45.45 0 00.126.233l.23.23c.24.24.5.426.77.564.27.137.561.206.87.206.31 0 .6-.07.87-.206.27-.138.53-.324.77-.564l.23-.23a.45.45 0 00.126-.233l.13-.52a1.85 1.85 0 011.148-1.415l.539-.188.45 1.96c.106.46-.226.903-.702.903H7.415c-.476 0-.808-.443-.702-.903z"/><path fillRule="evenodd" d="M4.594 7.236l4.944 1.73a1.45 1.45 0 00.924 0l4.944-1.73A1.45 1.45 0 0015.415 6H4.585a1.45 1.45 0 000 1.236zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
            论文助手
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">ScholarFlow AI 管理系统</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setViewMode(ViewMode.LIBRARY)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === ViewMode.LIBRARY ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            论文库
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.ANALYTICS)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === ViewMode.ANALYTICS ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            统计分析
          </button>
        </nav>

        <div className="mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">技术支持</h4>
            <p className="text-[11px] text-slate-300 mb-3">采用 Gemini 3 Flash 驱动的智能学术处理引擎。</p>
            <a href="https://ai.google.dev" target="_blank" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300">了解更多 &rarr;</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {viewMode === ViewMode.LIBRARY ? "论文文献库" : "知识看板"}
            </h2>
            <p className="text-slate-500 mt-1">更智能地组织您的学术阅读工作流。</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowForm(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              添加论文
            </button>
          </div>
        </header>

        {viewMode === ViewMode.LIBRARY ? (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <input 
                  type="text"
                  placeholder="搜索标题、作者或关键字..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filteredPapers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredPapers.map(paper => (
                  <PaperCard key={paper.id} paper={paper} onDelete={deletePaper} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">您的文献库空空如也</h3>
                <p className="text-slate-500 mt-2 max-w-xs">通过手动添加或使用 AI 智能分析工具来开始收录您的第一篇论文。</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  添加第一篇论文
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <StatsBoard papers={papers} />
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">智能洞察</h3>
              <p className="text-slate-600 leading-relaxed">
                论文助手 (ScholarFlow) 利用先进的大语言模型自动为您的研究文献分类。
                我们的 AI 会分析摘要的语义内容，从而确定最合适的学科门类和相关关键词，为您节省繁琐的手动标注和归档时间。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-emerald-600 font-bold text-lg mb-1">98%</div>
                  <div className="text-xs text-emerald-800 font-semibold uppercase">分类准确率</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-blue-600 font-bold text-lg mb-1">&lt; 3秒</div>
                  <div className="text-xs text-blue-800 font-semibold uppercase">平均分析速度</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-purple-600 font-bold text-lg mb-1">∞</div>
                  <div className="text-xs text-purple-800 font-semibold uppercase">科研无限潜能</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <PaperForm onAdd={addPaper} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default App;
