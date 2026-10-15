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
      current: 96,
      category: 'quality',
      status: 'active'
    },
    {
      id: 'goal-3',
      titleAr: 'تسوية وصرف عمولات المبيعات فور التحصيل',
      titleEn: 'Sales Commission Payout Rate',
      target: 100,
      unit: '%',
      current: 90,
      category: 'finance',
      status: 'active'
    }
  ],
  team: [
    // 3 Official Main Employees
    {
      id: 'emp-1',
      nameAr: 'أحمد',
      nameEn: 'Ahmed',
      roleAr: 'المدير التنفيذي والعمليات',
      roleEn: 'Managing Director & Operations',
      type: 'core',
      email: 'ahmed@mirqam.sa',
      phone: '+966 50 123 4567',
      avatar: '👔',
      isOfficial: true
    },
    {
      id: 'emp-2',
      nameAr: 'طارق',
      nameEn: 'Tariq',
      roleAr: 'التقنية والمنتجات الرقمية',
      roleEn: 'Tech Lead & Digital Products',
      type: 'core',
      email: 'tariq@mirqam.sa',
      phone: '+966 50 234 5678',
      avatar: '💻',
      isOfficial: true
    },
    {
      id: 'emp-3',
      nameAr: 'سارة',
      nameEn: 'Sara',
      roleAr: 'المالية والإدارة العامة',
      roleEn: 'Finance & General Admin',
      type: 'core',
      email: 'sara@mirqam.sa',
      phone: '+966 50 345 6789',
      avatar: '📊',
      isOfficial: true
    },
    // Commission-based Sales Team (Paid per customer acquired)
    {
      id: 'sales-1',
      nameAr: 'خالد المنصور',
      nameEn: 'Khaled Al-Mansour',
      roleAr: 'مسوق مبيعات (عمولات)',
      roleEn: 'Sales Representative (Commission)',
      type: 'sales',
      email: 'khaled@mirqam.sa',
      phone: '+966 55 111 2233',
      commissionRate: 500, // SAR per customer
      avatar: '🎯',
      isOfficial: false
    },
    {
      id: 'sales-2',
      nameAr: 'ريم العتيبي',
      nameEn: 'Reem Al-Otaibi',
      roleAr: 'مسوقة مبيعات (عمولات)',
      roleEn: 'Sales Representative (Commission)',
      type: 'sales',
      email: 'reem@mirqam.sa',
      phone: '+966 55 222 3344',
      commissionRate: 500,
      avatar: '⭐',
      isOfficial: false
    },
    {
      id: 'sales-3',
      nameAr: 'فهد الدوسري',
      nameEn: 'Fahad Al-Dossari',
      roleAr: 'مسوق مبيعات (عمولات)',
      roleEn: 'Sales Representative (Commission)',
      type: 'sales',
      email: 'fahad@mirqam.sa',
      phone: '+966 55 333 4455',
      commissionRate: 500,
      avatar: '🚀',
      isOfficial: false
    }
  ],
  tasks: [
    {
      id: 'task-101',
      title: 'مراجعة عقود 5 عملاء جدد مع القسم المالي',
      titleEn: 'Review contracts for 5 new onboarded clients with finance',
      assignedTo: 'emp-3', // سارة
      priority: 'urgent',
      status: 'in_progress',
      dueDate: '2026-10-18',
      createdAt: '2026-10-14'
    },
    {
      id: 'task-102',
      title: 'تطوير صفحة الهبوط والحملة الترويجية لقطاع التجزئة',
      titleEn: 'Develop retail landing page and promotional campaign',
      assignedTo: 'emp-2', // طارق
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2026-10-20',
      createdAt: '2026-10-13'
    },
    {
      id: 'task-103',
      title: 'التواصل مع 15 متجر مستهدف في الرياض',
      titleEn: 'Outreach to 15 targeted retail stores in Riyadh',
      assignedTo: 'sales-1', // خالد
      priority: 'urgent',
      status: 'todo',
      dueDate: '2026-10-17',
      createdAt: '2026-10-15'
    },
    {
      id: 'task-104',
      title: 'إغلاق الصفقة مع سلسلة متاجر الواحة',
      titleEn: 'Close package deal with Al-Waha Store Chain',
      assignedTo: 'sales-2', // ريم
      priority: 'urgent',
      status: 'in_progress',
      dueDate: '2026-10-16',
      createdAt: '2026-10-14'
    },
    {
      id: 'task-105',
      title: 'اعتماد خطة التوسع والتقرير المالي الأسبوعي',
      titleEn: 'Approve weekly expansion roadmap and financial statement',
      assignedTo: 'emp-1', // أحمد
      priority: 'normal',
      status: 'completed',
      dueDate: '2026-10-15',
      createdAt: '2026-10-12'
    }
  ],
  sales: [
    {
      id: 'sale-201',
      clientName: 'متجر دار الأناقة',
      clientNameEn: 'Dar Al-Anaqah Store',
      contactPhone: '+966 50 999 1122',
      salesRepId: 'sales-1', // خالد
      packageValue: 4500,
      commissionAmount: 500,
      status: 'paid', // 'pending' | 'approved' | 'paid'
      notes: 'تم توقيع العقد وتسديد الفاتورة وصرف العمولة للمسوق',
      date: '2026-10-10'
    },
    {
      id: 'sale-202',
      clientName: 'سوبرماركت الرائد',
      clientNameEn: 'Al-Raed Supermarket',
      contactPhone: '+966 50 888 2233',
      salesRepId: 'sales-1', // خالد
      packageValue: 6000,
      commissionAmount: 600,
      status: 'paid',
      notes: 'باقة سنوية متكاملة',
      date: '2026-10-11'
    },
    {
      id: 'sale-203',
      clientName: 'مقهى البن الراقي',
      clientNameEn: 'Al-Bunn Boutique Cafe',
      contactPhone: '+966 50 777 3344',
      salesRepId: 'sales-2', // ريم
      packageValue: 3500,
      commissionAmount: 500,
      status: 'approved',
      notes: 'تم اعتماد السداد، جاهزة لصرف العمولة في الدفعة القادمة',
      date: '2026-10-13'
    },
    {
      id: 'sale-204',
      clientName: 'مؤسسة أفق التقنية',
      clientNameEn: 'Ofuq Tech Est.',
      contactPhone: '+966 50 666 4455',
      salesRepId: 'sales-2', // ريم
      packageValue: 5000,
      commissionAmount: 500,
      status: 'paid',
      notes: 'تم الصرف بنجاح',
      date: '2026-10-12'
    },
    {
      id: 'sale-205',
      clientName: 'معارض صدى الأثاث',
      clientNameEn: 'Sada Furniture Showrooms',
      contactPhone: '+966 50 555 5566',
      salesRepId: 'sales-3', // فهد
      packageValue: 7500,
      commissionAmount: 750,
      status: 'pending',
      notes: 'العميل بانتظار تفعيل الحساب لإتمام التحويل البنكي',
      date: '2026-10-14'
    }
  ]
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
  const totalSales = db.sales.length;
  const totalRevenue = db.sales.reduce((sum, s) => sum + (Number(s.packageValue) || 0), 0);
  const totalCommissions = db.sales.reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
  const paidCommissions = db.sales
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + (Number(s.commissionAmount) || 0), 0);
  const pendingCommissions = totalCommissions - paidCommissions;

  const totalTasks = db.tasks.length;
  const completedTasks = db.tasks.filter(t => t.status === 'completed').length;
  const urgentTasks = db.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  // Sales rep leaderboard
  const salesRepsStats = db.team
    .filter(member => member.type === 'sales')
    .map(rep => {
      const repSales = db.sales.filter(s => s.salesRepId === rep.id);
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
  const updatedGoals = db.goals.map(g => {
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
  const index = db.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  db.tasks[index] = { ...db.tasks[index], ...updates };
  saveDatabase();
  return { updatedTask: db.tasks[index], workspace: getWorkspace() };
}

export function deleteTask(taskId) {
  const db = loadDatabase();
  db.tasks = db.tasks.filter(t => t.id !== taskId);
  saveDatabase();
  return getWorkspace();
}

export function createSale(saleData) {
  const db = loadDatabase();
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
  const index = db.sales.findIndex(s => s.id === saleId);
  if (index === -1) return null;
  db.sales[index] = { ...db.sales[index], ...updates };
  saveDatabase();
  return { updatedSale: db.sales[index], workspace: getWorkspace() };
}

export function deleteSale(saleId) {
  const db = loadDatabase();
  db.sales = db.sales.filter(s => s.id !== saleId);
  saveDatabase();
  return getWorkspace();
}

export function addTeamMember(memberData) {
  const db = loadDatabase();
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
