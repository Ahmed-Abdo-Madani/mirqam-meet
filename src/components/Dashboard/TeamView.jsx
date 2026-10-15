import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';

export default function TeamView() {
  const { workspace, addTeamMember } = useWorkspace();
  const { isAr } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [roleAr, setRoleAr] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [type, setType] = useState('sales'); // 'core' | 'sales'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [commissionRate, setCommissionRate] = useState('500');
  const [submitting, setSubmitting] = useState(false);

  if (!workspace) return null;

  const { team, tasks, sales } = workspace;
  const coreMembers = team.filter(m => m.type === 'core');
  const salesMembers = team.filter(m => m.type === 'sales');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    setSubmitting(true);
    await addTeamMember({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      roleAr: roleAr.trim() || (type === 'core' ? 'عضو أساسي' : 'مسوق مبيعات بالعمولة'),
      roleEn: roleEn.trim() || (type === 'core' ? 'Core Member' : 'Sales Representative'),
      type,
      phone: phone.trim(),
      email: email.trim(),
      commissionRate: type === 'sales' ? (Number(commissionRate) || 500) : undefined,
      avatar: type === 'core' ? '👔' : '🎯'
    });
    setSubmitting(false);
    setShowAddModal(false);
    setNameAr('');
    setNameEn('');
    setRoleAr('');
    setPhone('');
    setEmail('');
  };

  const getActiveTasksCount = (memberId) => {
    return tasks.filter(t => t.assignedTo === memberId && t.status !== 'completed').length;
  };

  const getMemberClientsCount = (memberId) => {
    return sales.filter(s => s.salesRepId === memberId).length;
  };

  const getMemberCommissions = (memberId) => {
    return sales
      .filter(s => s.salesRepId === memberId)
      .reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Header & Mobile Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👥</span>
            <span>{isAr ? 'دليل فريق عمل شركة مرقام' : 'Mirqam Team Directory'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr
              ? 'الهيكل الميداني: 3 موظفين رسميين في الإدارة والتقنية + فريق مبيعات نشط بنظام العمولات'
              : 'Company Structure: 3 Core Employees + Active Commission Sales Team'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs sm:text-sm font-semibold shadow-md shadow-mirqam-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>{isAr ? 'إضافة عضو جديد +' : 'Add Member +'}</span>
        </button>
      </div>

      {/* Section 1: The 3 Core Employees */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-mirqam-teal/20 text-mirqam-teal">
              👔
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'الفريق الأساسي والإداري (3 موظفين رسميين)' : 'Core Management Team (3 Official Employees)'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-mirqam-teal/30 text-teal-800 dark:text-mirqam-teal">
            {coreMembers.length} {isAr ? 'موظفين' : 'members'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {coreMembers.map(member => {
            const activeTasks = getActiveTasksCount(member.id);

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-[#122033] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-100 dark:border-slate-800">
                      {member.avatar || '👔'}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {isAr ? member.nameAr : member.nameEn}
                      </h4>
                      <p className="text-xs text-mirqam-teal font-medium mt-0.5">
                        {isAr ? member.roleAr : member.roleEn}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {isAr ? 'رسمي' : 'Official'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {member.email && (
                    <div className="flex items-center gap-1.5">
                      <span>✉️</span>
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-1.5">
                      <span>📱</span>
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span>{isAr ? 'المهام النشطة:' : 'Active Tasks:'}</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {activeTasks} {isAr ? 'مهام' : 'tasks'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Commission Sales Team */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/20 text-amber-500">
              🎯
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'فريق المبيعات المستقل (نظام العمولة لكل عميل)' : 'Commission Sales Team (Per Customer Acquired)'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300">
            {salesMembers.length} {isAr ? 'مسوقين' : 'sales reps'}
          </span>
        </div>

        {salesMembers.length === 0 ? (
          <div className="bg-white dark:bg-[#122033] p-6 sm:p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            <span className="text-3xl block mb-2">🎯</span>
            <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">
              {isAr ? 'لا يوجد مسوقين بالعمولة مسجلين حالياً' : 'No commission sales reps registered yet'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'يمكنك إضافة مسوقين وتحديد نسبة العمولة لكل عميل مستقطب عبر زر "إضافة عضو جديد +"'
                : 'You can add commission-based sales reps and define their rates via "Add Member +"'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {salesMembers.map(member => {
              const clients = getMemberClientsCount(member.id);
              const earnings = getMemberCommissions(member.id);
              const activeTasks = getActiveTasksCount(member.id);

              return (
                <div
                  key={member.id}
                  className="bg-white dark:bg-[#122033] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-100 dark:border-slate-800">
                        {member.avatar || '🎯'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isAr ? member.nameAr : member.nameEn}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {isAr ? member.roleAr : member.roleEn}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {isAr ? 'عمولات' : 'Commission'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isAr ? 'معدل العمولة لكل عميل:' : 'Commission Rate:'}</span>
                      <span className="font-bold text-mirqam-teal">{member.commissionRate || 500} ر.س</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isAr ? 'العملاء المستقطبين:' : 'Clients Acquired:'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{clients}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isAr ? 'إجمالي العمولات المستحقة:' : 'Total Commission:'}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{earnings.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>{isAr ? 'المهام المسندة:' : 'Assigned Tasks:'}</span>
                      <span>{activeTasks}</span>
                    </div>

                    {member.phone && (
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>💬</span>
                          <span>{isAr ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#122033] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>{isAr ? 'إضافة عضو جديد للفريق' : 'Add Team Member'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'الاسم (بالعربية) *' : 'Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: تركي السعد"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'الاسم (بالإنجليزية)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Turki Al-Saad"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'نوع العضوية في الشركة *' : 'Membership Type *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('sales')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      type === 'sales'
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🎯 {isAr ? 'مسوق مبيعات (عمولات)' : 'Commission Sales'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('core')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      type === 'core'
                        ? 'bg-mirqam-teal/20 text-mirqam-teal border-mirqam-teal/50'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    👔 {isAr ? 'موظف أساسي رسمي' : 'Core Employee'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'المسمى / الدور' : 'Role'}
                  </label>
                  <input
                    type="text"
                    value={roleAr}
                    onChange={(e) => setRoleAr(e.target.value)}
                    placeholder={type === 'core' ? 'مثال: مسؤول العمليات' : 'مسوق مبيعات'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>

                {type === 'sales' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {isAr ? 'معدل العمولة لكل عميل (ر.س)' : 'Commission per Client (SAR)'}
                    </label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'رقم الجوال' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@mirqam.sa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  />
                </div>
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
                  {submitting ? (isAr ? 'جاري الإضافة...' : 'Adding...') : (isAr ? 'إضافة العضو' : 'Save Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
