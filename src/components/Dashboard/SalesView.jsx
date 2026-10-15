import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SalesView() {
  const { workspace, createSale, updateSale, deleteSale } = useWorkspace();
  const { isAr } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRep, setFilterRep] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // New Sale Form
  const [clientName, setClientName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [salesRepId, setSalesRepId] = useState('');
  const [packageValue, setPackageValue] = useState('4500');
  const [commissionAmount, setCommissionAmount] = useState('500');
  const [status, setStatus] = useState('approved');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!workspace) return null;

  const { sales, team, stats, salesLeaderboard, company } = workspace;
  const salesTeam = team.filter(m => m.type === 'sales');

  const defaultRepId = salesRepId || (salesTeam[0]?.id || '');

  const filteredSales = sales.filter(s => {
    if (filterRep !== 'all' && s.salesRepId !== filterRep) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  const handleCreateSale = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    setSubmitting(true);
    await createSale({
      clientName: clientName.trim(),
      contactPhone: contactPhone.trim(),
      salesRepId: defaultRepId,
      packageValue: Number(packageValue) || 0,
      commissionAmount: Number(commissionAmount) || company.defaultCommissionPerClient || 500,
      status,
      notes: notes.trim()
    });
    setSubmitting(false);
    setShowAddModal(false);
    setClientName('');
    setContactPhone('');
    setNotes('');
  };

  const getRep = (id) => {
    return team.find(m => m.id === id) || { nameAr: 'مسوق مبيعات', nameEn: 'Sales Rep', avatar: '🎯' };
  };

  const statusBadges = {
    pending: {
      labelAr: 'معلقة (بانتظار السداد)',
      labelEn: 'Pending Payment',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    },
    approved: {
      labelAr: 'معتمدة (جاهزة للصرف)',
      labelEn: 'Approved for Payout',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
    },
    paid: {
      labelAr: 'تم صرف العمولة',
      labelEn: 'Commission Paid',
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Top Header & Mobile Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💼</span>
            <span>{isAr ? 'المبيعات وعمولات المسوقين' : 'Sales & Commission Tracker'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mirqam-teal/20 text-mirqam-teal font-semibold">
              {sales.length} {isAr ? 'عميل' : 'clients'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr
              ? 'تتبع العملاء المستقطبين واحتساب وصرف عمولات فريق المبيعات لكل عميل جديد'
              : 'Track acquired clients and manage commission payouts per customer for sales reps'}
          </p>
        </div>

        <button
          onClick={() => {
            setSalesRepId(salesTeam[0]?.id || '');
            setShowAddModal(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs sm:text-sm font-semibold shadow-md shadow-mirqam-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>{isAr ? 'تسجيل عميل جديد +' : 'Add Acquired Client +'}</span>
        </button>
      </div>

      {/* KPI Stats Strip - 2x2 on Mobile, 4x1 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-[#122033] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي العملاء' : 'Total Acquired'}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{stats?.totalSales || 0}</span>
            <span className="text-xs text-mirqam-teal font-semibold">
              {stats?.progressPercent || 0}% {isAr ? 'من الهدف' : 'of goal'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#122033] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي قيمة الصفقات' : 'Total Deal Value'}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.totalRevenue || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">ر.س</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#122033] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي العمولات' : 'Total Commissions'}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-mirqam-teal">
              {(stats?.totalCommissions || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">ر.س</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#122033] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'العمولات المصروفة vs المعلقة' : 'Paid vs Pending'}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xs sm:text-sm font-bold text-emerald-500">
              {(stats?.paidCommissions || 0).toLocaleString()} ر.س
            </span>
            <span className="text-[11px] sm:text-xs text-amber-500 font-medium">
              {isAr ? `معلق: ${(stats?.pendingCommissions || 0).toLocaleString()} ر.س` : `Pending: ${(stats?.pendingCommissions || 0).toLocaleString()} SAR`}
            </span>
          </div>
        </div>
      </div>

      {/* Sales Reps Commission Leaderboard */}
      <div className="bg-white dark:bg-[#122033] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏆</span>
              <span>{isAr ? 'لوحة أداء وعمولات فريق المبيعات' : 'Sales Reps Commission Leaderboard'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'كل مسوق يُحاسب بالعمولة على عدد العملاء الذين يتم استقطابهم' : 'Reps are paid per client acquired'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {salesLeaderboard.map((rep, idx) => (
            <div
              key={rep.id}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{rep.avatar || '🎯'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isAr ? rep.nameAr : rep.nameEn}
                    </h4>
                    <span className="text-[10px] text-mirqam-teal font-medium">
                      {rep.commissionRate || 500} ر.س / {isAr ? 'عميل' : 'client'}
                    </span>
                  </div>
                </div>

                {idx === 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 shrink-0">
                    🥇 {isAr ? 'المتصدر' : 'Top Rep'}
                  </span>
                )}
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{isAr ? 'العملاء المستقطبين:' : 'Clients Acquired:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{rep.clientsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي العمولات:' : 'Total Commission:'}</span>
                  <span className="font-bold text-mirqam-teal">{rep.totalCommission.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {isAr ? 'تم الصرف:' : 'Paid:'} {rep.paidCommission.toLocaleString()} ر.س
                  </span>
                  <span className="text-amber-500">
                    {isAr ? 'معلق:' : 'Pending:'} {rep.pendingCommission.toLocaleString()} ر.س
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clients Acquisition Log Container */}
      <div className="bg-white dark:bg-[#122033] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Filters Top Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'سجل العملاء المستقطبين' : 'Acquired Clients Log'}
            </span>
            <span className="text-xs text-slate-400">({filteredSales.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by sales rep */}
            <select
              value={filterRep}
              onChange={(e) => setFilterRep(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">{isAr ? 'كل المسوقين' : 'All Sales Reps'}</option>
              {salesTeam.map(rep => (
                <option key={rep.id} value={rep.id}>
                  {isAr ? rep.nameAr : rep.nameEn}
                </option>
              ))}
            </select>

            {/* Filter by status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
              <option value="pending">{isAr ? 'معلقة' : 'Pending'}</option>
              <option value="approved">{isAr ? 'معتمدة' : 'Approved'}</option>
              <option value="paid">{isAr ? 'مدفوعة' : 'Paid'}</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Cards Layout (Visible on screens < 640px) */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              {isAr ? 'لا يوجد عملاء مسجلين وفق هذا التصنيف' : 'No clients found'}
            </div>
          ) : (
            filteredSales.map(sale => {
              const rep = getRep(sale.salesRepId);
              const badge = statusBadges[sale.status] || statusBadges.pending;

              return (
                <div key={sale.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sale.clientName}
                      </h4>
                      {sale.contactPhone && (
                        <div className="text-xs text-slate-400">{sale.contactPhone}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSale(sale.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                      <span>{rep.avatar}</span>
                      <span>{isAr ? rep.nameAr : rep.nameEn}</span>
                    </span>
                    <div className="text-end">
                      <span className="text-slate-500 dark:text-slate-400">{isAr ? 'العقد:' : 'Deal:'} </span>
                      <span className="font-semibold text-slate-800 dark:text-white">{sale.packageValue?.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{isAr ? 'العمولة:' : 'Commission:'}</span>
                      <span className="text-xs font-black text-mirqam-teal">{sale.commissionAmount?.toLocaleString()} ر.س</span>
                    </div>

                    <select
                      value={sale.status}
                      onChange={(e) => updateSale(sale.id, { status: e.target.value })}
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${badge.className} bg-transparent focus:outline-none`}
                    >
                      <option value="pending" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                        🟡 {isAr ? 'معلقة' : 'Pending'}
                      </option>
                      <option value="approved" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                        🔵 {isAr ? 'معتمدة' : 'Approved'}
                      </option>
                      <option value="paid" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                        🟢 {isAr ? 'تم الصرف' : 'Paid'}
                      </option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Table (Visible sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 text-start">{isAr ? 'العميل / المتجر' : 'Client / Store'}</th>
                <th className="px-4 py-3 text-start">{isAr ? 'المسوق المسؤول' : 'Sales Rep'}</th>
                <th className="px-4 py-3 text-start">{isAr ? 'قيمة العقد' : 'Deal Value'}</th>
                <th className="px-4 py-3 text-start">{isAr ? 'العمولة المستحقة' : 'Commission'}</th>
                <th className="px-4 py-3 text-start">{isAr ? 'حالة العمولة' : 'Payout Status'}</th>
                <th className="px-4 py-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    {isAr ? 'لا يوجد عملاء مسجلين وفق هذا التصنيف' : 'No clients found'}
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  const rep = getRep(sale.salesRepId);
                  const badge = statusBadges[sale.status] || statusBadges.pending;

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {sale.clientName}
                        </div>
                        {sale.contactPhone && (
                          <div className="text-[11px] text-slate-400">{sale.contactPhone}</div>
                        )}
                        {sale.notes && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">{sale.notes}</div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 font-medium">
                          <span>{rep.avatar || '🎯'}</span>
                          <span>{isAr ? rep.nameAr : rep.nameEn}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                        {sale.packageValue?.toLocaleString()} ر.س
                      </td>

                      <td className="px-4 py-3 font-bold text-mirqam-teal">
                        {sale.commissionAmount?.toLocaleString()} ر.س
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={sale.status}
                          onChange={(e) => updateSale(sale.id, { status: e.target.value })}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${badge.className} bg-transparent focus:outline-none cursor-pointer`}
                        >
                          <option value="pending" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                            🟡 {isAr ? 'معلقة' : 'Pending'}
                          </option>
                          <option value="approved" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                            🔵 {isAr ? 'معتمدة' : 'Approved'}
                          </option>
                          <option value="paid" className="text-slate-800 bg-white dark:bg-[#0E1A29]">
                            🟢 {isAr ? 'تم الصرف' : 'Paid'}
                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteSale(sale.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          title={isAr ? 'حذف السجل' : 'Delete'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Acquired Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#122033] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>{isAr ? 'تسجيل عميل جديد وتحديد العمولة' : 'Record Acquired Client'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'اسم العميل / المتجر / الشركة *' : 'Client / Store Name *'}
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={isAr ? 'مثال: متجر أصالة العود' : 'e.g., Asalah Oud Store'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'رقم التواصل / جوال العميل' : 'Contact Phone'}
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'المسوق المستقطب للعميل *' : 'Sales Representative *'}
                  </label>
                  <select
                    value={defaultRepId}
                    onChange={(e) => setSalesRepId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  >
                    {salesTeam.map(rep => (
                      <option key={rep.id} value={rep.id}>
                        {rep.avatar} {isAr ? rep.nameAr : rep.nameEn} ({rep.commissionRate || 500} ر.س)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'قيمة العقد / الباقة (ر.س) *' : 'Deal Value (SAR) *'}
                  </label>
                  <input
                    type="number"
                    value={packageValue}
                    onChange={(e) => setPackageValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'قيمة العمولة المستحقة (ر.س) *' : 'Commission (SAR) *'}
                  </label>
                  <input
                    type="number"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal font-bold text-mirqam-teal"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'حالة العمولة الأولية *' : 'Initial Payout Status *'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                >
                  <option value="pending">{isAr ? 'معلقة (بانتظار سداد العميل)' : 'Pending (Awaiting customer payment)'}</option>
                  <option value="approved">{isAr ? 'معتمدة (سدد العميل - جاهزة للصرف)' : 'Approved (Paid by customer - ready for payout)'}</option>
                  <option value="paid">{isAr ? 'تم صرف العمولة للمسوق فوراً' : 'Paid to sales rep immediately'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'ملاحظات إضافية' : 'Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'مثال: تم إغلاق الصفقة عبر المعرض' : 'e.g., Closed via exhibition'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs font-bold shadow-md shadow-mirqam-teal/20"
                >
                  {submitting ? (isAr ? 'جاري التسجيل...' : 'Saving...') : (isAr ? 'تسجيل العميل والعمولة' : 'Save Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
