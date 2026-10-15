import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'mirqam_db.json');

const INITIAL_DATA = {
  company: {
    nameAr: 'شركة مرقام التجارية',
    nameEn: 'Mirqam Company Commercial',
    cr: '7055011105',
    directionAr: 'التركيز خلال هذا الربع على التوسع السريع واستقطاب 50 عميل جديد في قطاع التجزئة والشركات الناشئة مع تقديم حلول رقمية وتسويقية متكاملة.',
    directionEn: 'Focus this quarter on scaling rapidly and acquiring 50 new clients in retail & startups while delivering high-impact digital and marketing solutions.',
    targetCustomers: 50,
    quarter: 'Q4 2026',
    defaultCommissionPerClient: 500
  },
  meetingRoomConfig: {
    permanentRoomId: 'mirqam-team',
    permanentRoomName: 'غرفة مرقام الدائمة (Team Daily Huddle)'
  },
  goals: [
    {
      id: 'goal-1',
      titleAr: 'استقطاب العملاء الجدد للربع الحالي',
      titleEn: 'Acquire New Clients (Quarter Target)',
      target: 50,
      unit: 'عميل / Client',
      category: 'sales',
      status: 'active'
    },
    {
      id: 'goal-2',
      titleAr: 'نسبة رضا وجودة خدمة العملاء',
      titleEn: 'Customer Satisfaction & Delivery Rate',
      target: 95,
      unit: '%',
      current: 100,
      category: 'quality',
      status: 'active'
    },
    {
      id: 'goal-3',
      titleAr: 'تسوية وصرف عمولات المبيعات فور التحصيل',
      titleEn: 'Sales Commission Payout Rate',
      target: 100,
      unit: '%',
      current: 100,
      category: 'finance',
      status: 'active'
    }
  ],
  team: [
    // 3 Official Main Employees
    {
      id: 'emp-1',
      nameAr: 'مشاري ابو هليبة',
      nameEn: 'Meshari Abu Hulaiba',
      roleAr: 'إداري',
      roleEn: 'Administrative Officer',
      type: 'core',
      email: 'meshari@mirqam.sa',
      phone: '',
      avatar: '👔',
      isOfficial: true
    },
    {
      id: 'emp-2',
      nameAr: 'وليد عطية',
      nameEn: 'Waleed Atiah',
      roleAr: 'إداري',
      roleEn: 'Administrative Officer',
      type: 'core',
      email: 'waleed@mirqam.sa',
      phone: '',
      avatar: '👔',
      isOfficial: true
    },
    {
      id: 'emp-3',
      nameAr: 'أحمد عبد القادر',
      nameEn: 'Ahmed Abdulqader',
      roleAr: 'مطور برمجيات',
      roleEn: 'Software Developer',
      type: 'core',
      email: 'ahmed@mirqam.sa',
      phone: '',
      avatar: '💻',
      isOfficial: true
    }
  ],
  tasks: [],
  sales: []
};

// In-memory cache + file sync
let dbCache = null;

function loadDatabase() {
  if (dbCache) return dbCache;
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(content);
    } else {
      dbCache = JSON.parse(JSON.stringify(INITIAL_DATA));
      saveDatabase();
    }
  } catch (err) {
    console.error('[DB] Failed reading db file, using initial data:', err.message);
    dbCache = JSON.parse(JSON.stringify(INITIAL_DATA));
  }
  return dbCache;
}

export function resetToProductionData() {
  dbCache = JSON.parse(JSON.stringify(INITIAL_DATA));
  saveDatabase();
  return getWorkspace();
}

function saveDatabase() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed saving db file:', err.message);
  }
}

export function getWorkspace() {
  const db = loadDatabase();
  
  // Calculate dynamic stats
  const totalSales = (db.sales || []).length;
  const totalRevenue = (db.sales || []).reduce((sum, s) => sum + (Number(s.packageValue) || 0), 0);
  const totalCommissions = (db.sales || []).reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
  const paidCommissions = (db.sales || [])
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
  const pendingCommissions = totalCommissions - paidCommissions;

  const totalTasks = (db.tasks || []).length;
  const completedTasks = (db.tasks || []).filter(t => t.status === 'completed').length;
  const urgentTasks = (db.tasks || []).filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  // Sales rep leaderboard
  const salesRepsStats = (db.team || [])
    .filter(member => member.type === 'sales')
    .map(rep => {
      const repSales = (db.sales || []).filter(s => s.salesRepId === rep.id);
      const repTotalClients = repSales.length;
      const repTotalCommission = repSales.reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
      const repPaidCommission = repSales.filter(s => s.status === 'paid').reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
      const repPendingCommission = repTotalCommission - repPaidCommission;
      return {
        ...rep,
        clientsCount: repTotalClients,
        totalCommission: repTotalCommission,
        paidCommission: repPaidCommission,
        pendingCommission: repPendingCommission
      };
    })
    .sort((a, b) => b.clientsCount - a.clientsCount);

  // Update dynamic goal-1 (target customers) with real count
  const updatedGoals = (db.goals || []).map(g => {
    if (g.id === 'goal-1') {
      return { ...g, current: totalSales, target: db.company.targetCustomers || 50 };
    }
    return g;
  });

  return {
    ...db,
    goals: updatedGoals,
    stats: {
      totalSales,
      targetCustomers: db.company.targetCustomers || 50,
      progressPercent: Math.min(100, Math.round((totalSales / (db.company.targetCustomers || 50)) * 100)),
      totalRevenue,
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      totalTasks,
      completedTasks,
      urgentTasks
    },
    salesLeaderboard: salesRepsStats
  };
}

export function updateCompanyDirection(updates) {
  const db = loadDatabase();
  db.company = { ...db.company, ...updates };
  saveDatabase();
  return getWorkspace();
}

export function createTask(taskData) {
  const db = loadDatabase();
  if (!db.tasks) db.tasks = [];
  const newTask = {
    id: `task-${Date.now()}`,
    title: taskData.title,
    titleEn: taskData.titleEn || taskData.title,
    description: taskData.description || '',
    assignedTo: taskData.assignedTo || 'emp-1',
    priority: taskData.priority || 'medium', // urgent, medium, normal
    status: 'todo', // todo, in_progress, completed
    dueDate: taskData.dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0]
  };
  db.tasks.unshift(newTask);
  saveDatabase();
  return { newTask, workspace: getWorkspace() };
}

export function updateTask(taskId, updates) {
  const db = loadDatabase();
  if (!db.tasks) db.tasks = [];
  const index = db.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  db.tasks[index] = { ...db.tasks[index], ...updates };
  saveDatabase();
  return { updatedTask: db.tasks[index], workspace: getWorkspace() };
}

export function deleteTask(taskId) {
  const db = loadDatabase();
  if (!db.tasks) db.tasks = [];
  db.tasks = db.tasks.filter(t => t.id !== taskId);
  saveDatabase();
  return getWorkspace();
}

export function createSale(saleData) {
  const db = loadDatabase();
  if (!db.sales) db.sales = [];
  const newSale = {
    id: `sale-${Date.now()}`,
    clientName: saleData.clientName,
    clientNameEn: saleData.clientNameEn || saleData.clientName,
    contactPhone: saleData.contactPhone || '',
    salesRepId: saleData.salesRepId,
    packageValue: Number(saleData.packageValue) || 0,
    commissionAmount: Number(saleData.commissionAmount) || db.company.defaultCommissionPerClient || 500,
    status: saleData.status || 'pending', // pending, approved, paid
    notes: saleData.notes || '',
    date: saleData.date || new Date().toISOString().split('T')[0]
  };
  db.sales.unshift(newSale);
  saveDatabase();
  return { newSale, workspace: getWorkspace() };
}

export function updateSale(saleId, updates) {
  const db = loadDatabase();
  if (!db.sales) db.sales = [];
  const index = db.sales.findIndex(s => s.id === saleId);
  if (index === -1) return null;
  db.sales[index] = { ...db.sales[index], ...updates };
  saveDatabase();
  return { updatedSale: db.sales[index], workspace: getWorkspace() };
}

export function deleteSale(saleId) {
  const db = loadDatabase();
  if (!db.sales) db.sales = [];
  db.sales = db.sales.filter(s => s.id !== saleId);
  saveDatabase();
  return getWorkspace();
}

export function addTeamMember(memberData) {
  const db = loadDatabase();
  if (!db.team) db.team = [];
  const newMember = {
    id: `${memberData.type === 'core' ? 'emp' : 'sales'}-${Date.now()}`,
    nameAr: memberData.nameAr,
    nameEn: memberData.nameEn || memberData.nameAr,
    roleAr: memberData.roleAr,
    roleEn: memberData.roleEn || memberData.roleAr,
    type: memberData.type || 'sales', // 'core' | 'sales'
    email: memberData.email || '',
    phone: memberData.phone || '',
    commissionRate: memberData.type === 'sales' ? (Number(memberData.commissionRate) || 500) : undefined,
    avatar: memberData.avatar || (memberData.type === 'core' ? '👔' : '🎯'),
    isOfficial: memberData.type === 'core'
  };
  db.team.push(newMember);
  saveDatabase();
  return { newMember, workspace: getWorkspace() };
}
