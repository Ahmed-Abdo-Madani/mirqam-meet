import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';

export default function GoalsView() {
  const { workspace, updateDirection } = useWorkspace();
  const { isAr } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [directionAr, setDirectionAr] = useState(workspace?.company?.directionAr || '');
  const [directionEn, setDirectionEn] = useState(workspace?.company?.directionEn || '');
  const [targetCustomers, setTargetCustomers] = useState(workspace?.company?.targetCustomers || 50);
  const [saving, setSaving] = useState(false);

  if (!workspace) return null;

  const { company, stats } = workspace;
  const currentSales = stats?.totalSales || 0;
  const target = company?.targetCustomers || 50;
  const progressPercent = Math.min(100, Math.round((currentSales / target) * 100));
  const remaining = Math.max(0, target - currentSales);

  const handleSaveDirection = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateDirection({
      directionAr,
      directionEn,
      targetCustomers: Number(targetCustomers) || 50
    });
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Strategic Direction Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mirqam-navy via-[#122033] to-[#0A1420] text-white p-4 sm:p-6 md:p-8 border border-slate-700/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-mirqam-teal/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-mirqam-teal/20 text-mirqam-teal border border-mirqam-teal/30">
                {company.quarter || 'Q4 2026'} • {isAr ? 'بوصلة وتوجه الشركة' : 'Strategic Direction'}
              </span>
              <span className="text-xs text-white/60">
                {isAr ? 'سجل تجاري:' : 'CR:'} {company.cr}
              </span>
            </div>

            {!isEditing ? (
              <p className="text-base sm:text-lg md:text-xl font-medium text-slate-100 leading-relaxed pt-2">
                "{isAr ? company.directionAr : company.directionEn}"
              </p>
            ) : (
              <form onSubmit={handleSaveDirection} className="space-y-3 pt-3">
                <div>
                  <label className="block text-xs text-white/80 mb-1">
                    {isAr ? 'التوجه العام (بالعربية):' : 'General Direction (Arabic):'}
                  </label>
                  <textarea
                    value={directionAr}
                    onChange={(e) => setDirectionAr(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-sm text-white focus:outline-none focus:border-mirqam-teal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/80 mb-1">
                    {isAr ? 'التوجه العام (بالإنجليزية):' : 'General Direction (English):'}
                  </label>
                  <textarea
                    value={directionEn}
                    onChange={(e) => setDirectionEn(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-sm text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-xs text-white/80 mb-1">
                    {isAr ? 'هدف العملاء المستهدف:' : 'Target Customers Goal:'}
                  </label>
                  <input
                    type="number"
                    value={targetCustomers}
                    onChange={(e) => setTargetCustomers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-sm text-white focus:outline-none focus:border-mirqam-teal"
                    min="1"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs font-semibold shadow transition-all"
                  >
                    {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التوجه' : 'Save Direction')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setDirectionAr(company.directionAr);
                setDirectionEn(company.directionEn);
                setTargetCustomers(company.targetCustomers);
                setIsEditing(true);
              }}
              className="self-start px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{isAr ? 'تعديل التوجه' : 'Edit Direction'}</span>
            </button>
          )}
        </div>

        {/* Primary Milestone Progress Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-white">
                {isAr ? '🎯 الهدف الفصلي الأساسي: استقطاب العملاء' : '🎯 Primary Goal: Client Acquisition'}
              </span>
              <span className="text-xs text-mirqam-teal font-medium">
                ({currentSales} {isAr ? 'من أصل' : 'of'} {target} {isAr ? 'عميل' : 'clients'})
              </span>
            </div>
            <div className="text-xs text-white/80 flex items-center justify-between sm:justify-end gap-2">
              <span>{isAr ? `متبقي ${remaining} عميل لتحقيق الهدف` : `${remaining} clients remaining`}</span>
              <span className="text-mirqam-teal font-bold text-sm">{progressPercent}%</span>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 sm:h-3.5 overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-mirqam-teal to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Operational Focus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Card 1: Client Acquisition */}
        <div className="bg-white dark:bg-[#122033] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-mirqam-teal/20 text-mirqam-teal">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-mirqam-teal/30 text-teal-800 dark:text-mirqam-teal">
              {progressPercent}%
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isAr ? 'استقطاب العملاء والمبيعات' : 'Client Acquisition & Sales'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            {isAr ? 'المسوقون يحصلون على عمولة لكل متجر أو عميل مستقطب' : 'Commission-based sales reps per acquired client'}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentSales}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">
              {isAr ? `الهدف: ${target} عميل` : `Target: ${target} clients`}
            </span>
          </div>
        </div>

        {/* Card 2: Operations & Quality */}
        <div className="bg-white dark:bg-[#122033] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/30 text-blue-800 dark:text-blue-300">
              96%
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isAr ? 'جودة الخدمة واستقرار العمليات' : 'Service Delivery & Quality'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            {isAr ? 'تسليم المشاريع ودعم العملاء عبر فريق العمل الأساسي' : 'Delivery & client support managed by core team'}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              96%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">
              {isAr ? 'رضا ممتاز' : 'Top Rating'}
            </span>
          </div>
        </div>

        {/* Card 3: Financial Settlement & Commissions */}
        <div className="bg-white dark:bg-[#122033] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300">
              {stats?.paidCommissions || 0} ر.س
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isAr ? 'تسوية العمولات وصرف المستحقات' : 'Commission Payout & Settlements'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            {isAr ? 'صرف مستحقات المسوقين أولاً بأول لتعزيز الحافز' : 'Swift commission payout per client acquired'}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.totalCommissions || 0).toLocaleString()} <span className="text-xs font-normal">ر.س</span>
            </span>
            <span className="text-xs text-amber-500 font-medium">
              {isAr ? `معلق: ${(stats?.pendingCommissions || 0).toLocaleString()} ر.س` : `Pending: ${(stats?.pendingCommissions || 0).toLocaleString()} SAR`}
            </span>
          </div>
        </div>
      </div>

      {/* Operational Highlights Banner - Clear Contrast in Dark and Light */}
      <div className="bg-slate-100/90 dark:bg-[#122033] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>
            {isAr ? 'هيكل الفريق الحالي: 3 موظفين رسميين أساسيين + فريق مبيعات بالعمولة نشط.' : 'Current Team: 3 Core Employees + Active Commission Sales Reps.'}
          </span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-white">
          <span>
            {isAr ? `المهام العاجلة: ${stats?.urgentTasks || 0}` : `Urgent: ${stats?.urgentTasks || 0}`}
          </span>
          <span>•</span>
          <span>
            {isAr ? `المهام المكتملة: ${stats?.completedTasks || 0}` : `Completed: ${stats?.completedTasks || 0}`}
          </span>
        </div>
      </div>
    </div>
  );
}
