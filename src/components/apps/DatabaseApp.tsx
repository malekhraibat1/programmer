import { useState } from 'react';
import { DATABASE_TABLES } from '../../data/initialData.ts';
import { DatabaseTable } from '../../types/index.ts';
import { sound } from '../../utils/audio.ts';
import { Database, Play, Plus, Search, RefreshCw, KeyRound, HardDrive } from 'lucide-react';

export function DatabaseApp() {
  const [tables, setTables] = useState<DatabaseTable[]>(DATABASE_TABLES);
  const [activeTableIdx, setActiveTableIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'sql' | 'tables' | 'redis'>('tables');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM projects_ecosystem ORDER BY id ASC;');
  const [searchQuery, setSearchQuery] = useState('');
  const [queryOutput, setQueryOutput] = useState<Record<string, unknown>[] | null>(null);
  const [isInserting, setIsInserting] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});

  const currentTable = tables[activeTableIdx];

  // Redis simulated cache
  const [redisKeys, setRedisKeys] = useState([
    { key: 'session:user_token:99', ttl: 3580, type: 'HASH', size: '1.2 KB' },
    { key: 'cache:skills:matrix', ttl: 86400, type: 'JSON', size: '4.8 KB' },
    { key: 'rate_limit:ip:192.168.1.1', ttl: 42, type: 'INT', size: '64 B' },
    { key: 'queue:deploy_jobs:pending', ttl: -1, type: 'LIST', size: '820 B' },
  ]);

  const handleRunSql = () => {
    sound.playExecute();
    // Simulate query filtering
    if (sqlQuery.toLowerCase().includes('commit')) {
      setActiveTableIdx(1);
      setQueryOutput(tables[1].records);
    } else if (sqlQuery.toLowerCase().includes('skill')) {
      setActiveTableIdx(2);
      setQueryOutput(tables[2].records);
    } else {
      setActiveTableIdx(0);
      setQueryOutput(tables[0].records);
    }
    sound.playSuccess();
  };

  const handleInsertRecord = () => {
    if (!newRowData['title'] && !newRowData['skill'] && !newRowData['message']) {
      // fallback dummy field
      newRowData['title'] = 'New Project Engine';
    }

    const newRecord: Record<string, unknown> = {
      id: currentTable.records.length + 1,
      ...newRowData,
      status: 'Active',
      deployments: 1,
      branch: 'main',
      verified: 'true',
    };

    const updatedTables = [...tables];
    updatedTables[activeTableIdx] = {
      ...currentTable,
      rowCount: currentTable.rowCount + 1,
      records: [newRecord, ...currentTable.records],
    };

    setTables(updatedTables);
    setIsInserting(false);
    setNewRowData({});
    sound.playSuccess();
  };

  const filteredRecords = currentTable.records.filter((rec) => {
    if (!searchQuery) return true;
    return Object.values(rec).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full bg-[#080d17] text-slate-200 text-xs font-mono select-none">
      {/* Top App Header with Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-100">DevCore SQL & Cache Vault</span>
          <span className="text-slate-500 text-[11px]">| PostgreSQL 16 + Redis</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              sound.playClick(600);
              setActiveTab('tables');
            }}
            className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>الجداول (Tables)</span>
          </button>
          <button
            onClick={() => {
              sound.playClick(600);
              setActiveTab('sql');
            }}
            className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>محرر SQL</span>
          </button>
          <button
            onClick={() => {
              sound.playClick(600);
              setActiveTab('redis');
            }}
            className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'redis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>مخزن الكاش (Redis)</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === 'tables' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Table List & Tools */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {tables.map((tbl, idx) => (
                <button
                  key={tbl.name}
                  onClick={() => {
                    sound.playClick(600);
                    setActiveTableIdx(idx);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors border ${
                    activeTableIdx === idx
                      ? 'bg-slate-800 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{tbl.name}</span>
                  <span className="mr-1.5 text-[10px] text-slate-500">({tbl.records.length})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="بحث في السجلات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-slate-200 w-32 sm:w-40"
                />
              </div>
              <button
                onClick={() => setIsInserting(true)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سجل</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="flex-1 overflow-auto p-3">
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
              <table className="w-full text-right border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                    {currentTable.columns.map((col) => (
                      <th key={col} className="p-2.5 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecords.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-900/60 transition-colors text-slate-200"
                    >
                      {currentTable.columns.map((col) => (
                        <td key={col} className="p-2.5 tabular-nums">
                          {String(row[col] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SQL Query Runner Tab */}
      {activeTab === 'sql' && (
        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-[11px]">محرر استعلامات SQL الفوري:</span>
              <button
                onClick={handleRunSql}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors text-xs"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>تنفيذ الاستعلام (Execute Query)</span>
              </button>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full h-24 bg-slate-900/60 border border-slate-800 rounded p-2.5 text-amber-200 font-mono text-xs outline-none resize-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-auto flex flex-col">
            <span className="text-slate-400 text-[11px] mb-2 font-bold">نتائج الاستعلام:</span>
            {queryOutput ? (
              <pre className="text-amber-100 text-[11px] font-mono leading-relaxed">
                {JSON.stringify(queryOutput, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-600 text-center my-auto">
                اضغط "تنفيذ الاستعلام" لمعاينة النتائج
              </div>
            )}
          </div>
        </div>
      )}

      {/* Redis Cache Tab */}
      {activeTab === 'redis' && (
        <div className="flex-1 p-3 overflow-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span>مخزن الذاكرة السريعة (In-Memory Key/Value Cache)</span>
            <span className="text-emerald-400 font-mono">Hit Ratio: 98.4% • Memory: 18.2 MB</span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
            <table className="w-full text-right border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <th className="p-2.5">المفتاح (Cache Key)</th>
                  <th className="p-2.5">النوع (Type)</th>
                  <th className="p-2.5">زمن البقاء (TTL)</th>
                  <th className="p-2.5">الحجم (Size)</th>
                  <th className="p-2.5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {redisKeys.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 text-slate-200">
                    <td className="p-2.5 text-cyan-300">{item.key}</td>
                    <td className="p-2.5 text-amber-400">{item.type}</td>
                    <td className="p-2.5 tabular-nums text-slate-400">
                      {item.ttl === -1 ? 'دائم (No Expire)' : `${item.ttl} ثانية`}
                    </td>
                    <td className="p-2.5 tabular-nums text-slate-400">{item.size}</td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => {
                          sound.playClick(400);
                          setRedisKeys(redisKeys.filter((_, i) => i !== idx));
                        }}
                        className="text-rose-400 hover:text-rose-300 text-[10px]"
                      >
                        تفريغ (Flush)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insert Record Modal */}
      {isInserting && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl">
            <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إدراج سجل جديد في {currentTable.name}</span>
            </h4>
            <div className="space-y-2 mb-4">
              {currentTable.columns.slice(1, 4).map((col) => (
                <div key={col}>
                  <label className="text-[10px] text-slate-400 block mb-1">{col}:</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setNewRowData({ ...newRowData, [col]: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInserting(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleInsertRecord}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
              >
                حفظ وإدراج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
