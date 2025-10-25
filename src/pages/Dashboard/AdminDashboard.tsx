import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Euro,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  UserCheck,
  GraduationCap,
  CreditCard,
  FileText,
  Search,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Send,
  Calculator,
  Target,
  BarChart3,
  DollarSign,
  Bell,
  Plus,
  Mail,
  Zap,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  Eye,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* -------------------- MOCKS -------------------- */

const mockData = {
  globalStats: {
    totalUsers: { current: 1247, previous: 1198, change: 4.1 },
    activeTeachers: { current: 89, previous: 85, change: 4.7 },
    activeParents: { current: 445, previous: 432, change: 3.0 },
    activeStudents: { current: 892, previous: 847, change: 5.3 },
    monthlyRevenue: { current: 45670, previous: 42340, change: 7.9 },
    totalSessions: { current: 2156, previous: 2034, change: 6.0 },
    strugglingStudents: { current: 23, previous: 18, change: 27.8 },
    monthlyCharges: { current: 18420, previous: 17250, change: 6.8 },
    profitBeforeTax: { current: 27250, previous: 25090, change: 8.6 },
    profitAfterTax: { current: 20438, previous: 18818, change: 8.6 },
    pendingValidations: { current: 12, previous: 8, change: 50.0 },
    globalAlerts: { current: 5, previous: 3, change: 66.7 },
  },
};

// Utilisateurs
const mockUsers = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    role: "teacher",
    status: "active",
    joinDate: "2024-01-15",
    avatar: "/placeholder.svg",
    subjects: ["Mathématiques", "Physique"],
    studentsCount: 12,
    averageRating: 4.8,
    hourlyRate: 15,
    phone: "06 12 34 56 78",
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@email.com",
    role: "parent",
    status: "active",
    joinDate: "2024-01-10",
    avatar: "/placeholder.svg",
    children: ["Emma Martin", "Tom Martin"],
    phone: "06 87 65 43 21",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    email: "sophie.bernard@email.com",
    role: "teacher",
    status: "pending",
    joinDate: "2024-01-20",
    avatar: "/placeholder.svg",
    subjects: ["Français", "Histoire"],
    studentsCount: 0,
    averageRating: 0,
    hourlyRate: 14,
    phone: "07 11 22 33 44",
  },
  {
    id: 4,
    name: "Lucas Petit",
    email: "lucas.petit@email.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-05",
    avatar: "/placeholder.svg",
    level: "Terminale",
    subjects: ["Mathématiques", "Physique"],
    averageGrade: 2.3,
    currentTeacher: null,
  },
];

// Élèves en difficulté (existant)
const mockStrugglingStudents = [
  {
    id: 1,
    name: "Lucas Petit",
    teacher: "Marie Dubois",
    subject: "Mathématiques",
    averageGrade: 2.3,
    lastSession: "2024-01-10",
    alertLevel: "high",
    sessionsCount: 8,
    email: "lucas.petit@email.com",
    parentContact: "Jean Petit",
  },
  {
    id: 2,
    name: "Emma Leroy",
    teacher: "Jean Laurent",
    subject: "Physique",
    averageGrade: 2.7,
    lastSession: "2024-01-12",
    alertLevel: "medium",
    sessionsCount: 6,
    email: "emma.leroy@email.com",
    parentContact: "Marie Leroy",
  },
];

// ALERTES globales
const mockAlerts = [
  {
    id: 1,
    type: "critical",
    title: "Paiement en retard",
    description: "5 paiements en attente depuis plus de 7 jours",
    timestamp: "2024-01-15 09:30",
    read: false,
    actionRequired: true,
  },
  {
    id: 2,
    type: "warning",
    title: "Professeur indisponible",
    description: "Marie Dubois a signalé une indisponibilité pour la semaine",
    timestamp: "2024-01-14 16:45",
    read: true,
    actionRequired: false,
  },
];

// CHARGES
const mockCharges = [
  { id: 1, name: "Salaires professeurs", amount: 12500, category: "Personnel", editable: true },
  { id: 2, name: "Charges sociales", amount: 3750, category: "Personnel", editable: true },
  { id: 3, name: "Hébergement plateforme", amount: 450, category: "Technique", editable: true },
  { id: 4, name: "Marketing", amount: 1200, category: "Commercial", editable: true },
  { id: 5, name: "Assurance", amount: 520, category: "Administratif", editable: true },
];

// ATTRIBUTION
const mockAttribution = [
  {
    id: 1,
    student: { id: 4, name: "Lucas Petit", level: "Terminale", subjects: ["Mathématiques"] },
    currentTeacher: { id: 1, name: "Marie Dubois" },
    subject: "Mathématiques",
    matchScore: 85,
    status: "active",
    startDate: "2024-01-01",
    availableTeachers: [
      {
        id: 1,
        name: "Marie Dubois",
        rating: 4.8,
        matchScore: 85,
        specialties: ["Mathématiques", "Physique"],
      },
      {
        id: 3,
        name: "Paul Durand",
        rating: 4.6,
        matchScore: 78,
        specialties: ["Mathématiques", "Statistiques"],
      },
    ],
  },
  {
    id: 2,
    student: { id: 5, name: "Emma Martin", level: "1ère", subjects: ["Physique"] },
    currentTeacher: null,
    subject: "Physique",
    status: "pending",
    priority: "high",
    availableTeachers: [
      {
        id: 1,
        name: "Marie Dubois",
        rating: 4.8,
        matchScore: 92,
        specialties: ["Mathématiques", "Physique"],
      },
      {
        id: 6,
        name: "Jean Laurent",
        rating: 4.5,
        matchScore: 88,
        specialties: ["Physique", "Chimie"],
      },
    ],
  },
];

// NOUVEAU : Séances passées (pour Qualité + Paie) — MOCK
// status: 'validated' uniquement
const mockCompletedSessions = [
  // élève, prof, matière, date, durée (min), note, coût, teacherHourlyRate
  {
    id: 1001,
    student: "Lucas Petit",
    teacher: "Marie Dubois",
    subject: "Mathématiques",
    date: "2025-09-09",
    duration: 60,
    rating: 2,
    cost: 12,
    teacherHourlyRate: 15,
  },
  {
    id: 1002,
    student: "Emma Martin",
    teacher: "Jean Laurent",
    subject: "Physique",
    date: "2025-09-08",
    duration: 90,
    rating: 4,
    cost: 18,
    teacherHourlyRate: 16,
  },
  {
    id: 1003,
    student: "Tom Martin",
    teacher: "Sophie Bernard",
    subject: "Français",
    date: "2025-09-05",
    duration: 60,
    rating: 1,
    cost: 12,
    teacherHourlyRate: 14,
  },
  {
    id: 1004,
    student: "Nina Duval",
    teacher: "Paul Durand",
    subject: "Mathématiques",
    date: "2025-08-30",
    duration: 120,
    rating: 5,
    cost: 24,
    teacherHourlyRate: 15,
  },
];

// NOUVEAU : Professeurs à note globale basse (< 3) — MOCK
const mockLowRatedTeachers = [
  { id: 91, name: "Alex Moreau", subject: "Histoire", globalRating: 2.4, sessions: 21 },
  { id: 92, name: "Claire Robert", subject: "Chimie", globalRating: 2.8, sessions: 9 },
];

// NOUVEAU : Séries mensuelles pour Comptabilité/Analytics — MOCK
const mockMonthlyFinance = [
  { month: "2025-06", revenue: 40200, charges: 16200 },
  { month: "2025-07", revenue: 41850, charges: 17000 },
  { month: "2025-08", revenue: 43500, charges: 17650 },
  { month: "2025-09", revenue: 45670, charges: 18420 },
];

/* -------------------- UI UTILS -------------------- */

const ChangeIndicator = ({ change, isReverse = false }: { change: number; isReverse?: boolean }) => {
  const isPositive = isReverse ? change < 0 : change > 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className={`flex items-center text-sm ${colorClass}`}>
      <Icon className="h-3 w-3 mr-1" />
      <span>{Math.abs(change).toFixed(1)}%</span>
    </div>
  );
};

const EditModal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* -------------------- MAIN -------------------- */

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("attribution");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Comptabilité : filtre période
  const [periodGranularity, setPeriodGranularity] = useState<"month" | "quarter" | "year">("month");
  const [periodFrom, setPeriodFrom] = useState("2025-06");
  const [periodTo, setPeriodTo] = useState("2025-09");

  // États pour modals/edits
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingCharge, setEditingCharge] = useState<any>(null);
  const [showAttributionModal, setShowAttributionModal] = useState<any>(null);
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [newCharge, setNewCharge] = useState({ name: "", amount: "", category: "" });
  const [charges, setCharges] = useState(mockCharges);
  const [users, setUsers] = useState(mockUsers);
  const [attributions, setAttributions] = useState(mockAttribution);

  // Comptabilité : données filtrées
  const filteredFinance = useMemo(() => {
    const toNum = (s: string) => Number(s.replace("-", ""));
    const from = toNum(periodFrom);
    const to = toNum(periodTo);
    const rows = mockMonthlyFinance.filter((r) => {
      const n = toNum(r.month);
      return n >= from && n <= to;
    });
    return rows.map((r) => ({ ...r, net: r.revenue - r.charges }));
  }, [periodFrom, periodTo]);

  // Analytics : top matières (à partir des sessions mock)
  const subjectAgg = useMemo(() => {
    const map: Record<string, { hours: number; count: number }> = {};
    mockCompletedSessions.forEach((s) => {
      if (!map[s.subject]) map[s.subject] = { hours: 0, count: 0 };
      map[s.subject].hours += s.duration / 60;
      map[s.subject].count += 1;
    });
    return Object.entries(map).map(([subject, v]) => ({
      subject,
      hours: Number(v.hours.toFixed(1)),
      count: v.count,
    }));
  }, []);

  const contextualStats = getContextualStats(activeTab);

  // Filtres Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  /* ---------- Actions ---------- */

  function getContextualStats(tab: string) {
    const data = mockData.globalStats;
    switch (tab) {
      case "attribution":
        return [
          { title: "Attributions actives", value: 156, change: 8.2, icon: Target, color: "text-blue-600" },
          { title: "En attente", value: 23, change: -15.3, icon: Clock, color: "text-orange-600" },
          { title: "Taux de matching", value: "87%", change: 5.4, icon: Percent, color: "text-green-600" },
          { title: "Profs disponibles", value: data.activeTeachers.current, change: data.activeTeachers.change, icon: GraduationCap, color: "text-purple-600" },
        ];
      case "users":
        return [
          { title: "Total utilisateurs", value: data.totalUsers.current, change: data.totalUsers.change, icon: Users, color: "text-blue-600" },
          { title: "Professeurs", value: data.activeTeachers.current, change: data.activeTeachers.change, icon: GraduationCap, color: "text-green-600" },
          { title: "Parents", value: data.activeParents.current, change: data.activeParents.change, icon: UserCheck, color: "text-purple-600" },
          { title: "En attente validation", value: 12, change: 25.0, icon: Clock, color: "text-orange-600" },
        ];
      case "quality":
        return [
          { title: "Séances < 3★", value: mockCompletedSessions.filter((s) => s.rating < 3).length, change: 12.5, icon: AlertTriangle, color: "text-red-600", isReverse: true },
          { title: "Profs < 3★", value: mockLowRatedTeachers.length, change: 0.0, icon: Bell, color: "text-red-500", isReverse: true },
          { title: "Taux amélioration", value: "73%", change: 12.8, icon: TrendingUp, color: "text-green-600" },
          { title: "Séances mensuelles", value: mockData.globalStats.totalSessions.current, change: mockData.globalStats.totalSessions.change, icon: Clock, color: "text-purple-600" },
        ];
      case "accounting":
        return [
          { title: "CA du mois", value: `${mockData.globalStats.monthlyRevenue.current}€`, change: mockData.globalStats.monthlyRevenue.change, icon: Euro, color: "text-green-600" },
          { title: "Charges totales", value: `${mockData.globalStats.monthlyCharges.current}€`, change: mockData.globalStats.monthlyCharges.change, icon: Calculator, color: "text-orange-600", isReverse: true },
          { title: "Résultat avant impôts", value: `${mockData.globalStats.profitBeforeTax.current}€`, change: mockData.globalStats.profitBeforeTax.change, icon: BarChart3, color: "text-blue-600" },
          { title: "Résultat après impôts", value: `${mockData.globalStats.profitAfterTax.current}€`, change: mockData.globalStats.profitAfterTax.change, icon: DollarSign, color: "text-purple-600" },
        ];
      case "payroll":
        return [
          { title: "Fiches générées", value: 89, change: 4.7, icon: FileText, color: "text-blue-600" },
          { title: "Fiches envoyées", value: 76, change: 8.6, icon: Send, color: "text-green-600" },
          { title: "Masse salariale", value: "12,500€", change: 6.8, icon: Euro, color: "text-purple-600" },
          { title: "Charges sociales", value: "3,750€", change: 6.8, icon: Calculator, color: "text-orange-600" },
        ];
      case "analytics":
        return [
          { title: "CA période", value: `${filteredFinance.reduce((s, r) => s + r.revenue, 0).toLocaleString()}€`, change: 7.1, icon: Euro, color: "text-green-600" },
          { title: "Charges période", value: `${filteredFinance.reduce((s, r) => s + r.charges, 0).toLocaleString()}€`, change: 5.3, icon: Calculator, color: "text-orange-600", isReverse: true },
          { title: "Résultat période", value: `${filteredFinance.reduce((s, r) => s + (r.revenue - r.charges), 0).toLocaleString()}€`, change: 9.2, icon: BarChart3, color: "text-blue-600" },
          { title: "Matières actives", value: subjectAgg.length, change: 3.2, icon: BookOpen, color: "text-purple-600" },
        ];
      default:
        return [
          { title: "Total utilisateurs", value: data.totalUsers.current, change: data.totalUsers.change, icon: Users, color: "text-blue-600" },
          { title: "CA mensuel", value: `${data.monthlyRevenue.current}€`, change: data.monthlyRevenue.change, icon: Euro, color: "text-green-600" },
          { title: "Séances totales", value: data.totalSessions.current, change: data.totalSessions.change, icon: Clock, color: "text-purple-600" },
          { title: "Alertes", value: data.globalAlerts.current, change: data.globalAlerts.change, icon: Bell, color: "text-red-600", isReverse: true },
        ];
    }
  }

  const saveUser = (userData: any) => {
    if (editingUser?.id) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...userData, id: editingUser.id } : u)));
    } else {
      setUsers([...users, { ...userData, id: Date.now() }]);
    }
    setEditingUser(null);
  };

  const deleteUser = (userId: number) => setUsers(users.filter((u) => u.id !== userId));

  const addCharge = () => {
    if (newCharge.name && newCharge.amount && newCharge.category) {
      setCharges([
        ...charges,
        {
          id: Date.now(),
          ...newCharge,
          amount: parseFloat(newCharge.amount as unknown as string),
          editable: true,
        },
      ]);
      setNewCharge({ name: "", amount: "", category: "" });
      setShowChargeForm(false);
    }
  };

  const updateCharge = (chargeData: any) => {
    setCharges(charges.map((c) => (c.id === editingCharge.id ? { ...chargeData, id: editingCharge.id } : c)));
    setEditingCharge(null);
  };

  const deleteCharge = (chargeId: number) => setCharges(charges.filter((c) => c.id !== chargeId));

  const assignTeacher = (studentId: number, teacherId: number, attributionId: number) => {
    setAttributions(
      attributions.map((attr) =>
        attr.id === attributionId
          ? {
              ...attr,
              currentTeacher: { id: teacherId, name: attr.availableTeachers.find((t: any) => t.id === teacherId)?.name },
              status: "active",
            }
          : attr
      )
    );
    setShowAttributionModal(null);
  };

  /* -------------------- RENDER -------------------- */

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord ERP - Mode Gestionnaire</h1>
          <p className="text-muted-foreground">Gestion complète de la plateforme éducative</p>

          {/* Alertes globales */}
          <div className="mt-4">
            <div className="flex items-center justify-between bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium">5 alertes nécessitent votre attention</span>
              </div>
              <Button variant="outline" size="sm">
                Voir toutes les alertes
              </Button>
            </div>
          </div>
        </div>

        {/* Stats contextuelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contextualStats.map((stat: any, index: number) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color || "text-primary"}`}>
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </div>
                {stat.change !== undefined && <ChangeIndicator change={stat.change} isReverse={stat.isReverse} />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="users">Comptes</TabsTrigger>
            <TabsTrigger value="quality">Qualité</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="sessions">Séances</TabsTrigger>
            <TabsTrigger value="accounting">Comptabilité</TabsTrigger>
            <TabsTrigger value="payroll">Paie</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Attribution */}
          <TabsContent value="attribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Attribution Professeur/Étudiant
                </CardTitle>
                <div className="flex space-x-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle attribution
                  </Button>
                  <Button variant="outline">Matching automatique</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attributions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {item.student.name} - {item.student.level}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.subject}</p>
                        {item.currentTeacher ? (
                          <p className="text-sm text-green-600">
                            Professeur: {item.currentTeacher.name}
                            {item.matchScore && <span className="ml-2 text-blue-600">(Score: {item.matchScore}%)</span>}
                          </p>
                        ) : (
                          <p className="text-sm text-orange-600">En attente d'attribution</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          {item.availableTeachers?.slice(0, 2).map((teacher: any) => (
                            <Badge key={teacher.id} variant="outline" className="text-xs">
                              {teacher.name} ({teacher.matchScore}%)
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.status === "active" ? "default" : "outline"}>
                          {item.status === "active" ? "Actif" : "En attente"}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setShowAttributionModal(item)}>
                          {item.status === "active" ? "Modifier" : "Attribuer"}
                        </Button>
                        {item.status === "active" && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comptes */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion avancée des comptes
                </CardTitle>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="parent">Parents</SelectItem>
                      <SelectItem value="teacher">Professeurs</SelectItem>
                      <SelectItem value="student">Étudiants</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setEditingUser({})}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer compte
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Inscrit: {user.joinDate}</span>
                            {user.phone && <span>Tel: {user.phone}</span>}
                          </div>
                          {user.subjects && <p className="text-sm text-blue-600">Matières: {user.subjects.join(", ")}</p>}
                          {user.role === "teacher" && (
                            <p className="text-sm">
                              Élèves: {user.studentsCount} | Note: {user.averageRating}/5 | Taux: {user.hourlyRate}€/h
                            </p>
                          )}
                          {user.role === "student" && (
                            <p className="text-sm">Niveau: {user.level} | Moyenne: {user.averageGrade}/5</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === "teacher" ? "default" : user.role === "parent" ? "secondary" : "outline"}>
                          {user.role === "teacher" ? "Professeur" : user.role === "parent" ? "Parent" : "Étudiant"}
                        </Badge>
                        <Badge variant={user.status === "active" ? "default" : "outline"}>
                          {user.status === "active" ? "Actif" : "En attente"}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {user.status === "pending" && (
                          <Button size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Qualité (ex-Alternants) */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Séances à faible note ({"<"} 3★)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCompletedSessions
                    .filter((s) => s.rating < 3)
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium">
                            {s.subject} — {s.student}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {s.date} • {s.duration} min • Prof: {s.teacher}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{s.rating}/5</Badge>
                          <Button size="sm" variant="outline">
                            Plan d’aide
                          </Button>
                          <Button size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Contacter parent
                          </Button>
                        </div>
                      </div>
                    ))}
                  {mockCompletedSessions.filter((s) => s.rating < 3).length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune séance concernée pour le moment.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  Professeurs à faible note globale ({"<"} 3★)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLowRatedTeachers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{t.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{t.name}</h4>
                          <p className="text-sm text-muted-foreground">{t.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">{t.globalRating}/5</Badge>
                        <Badge variant="outline">{t.sessions} séances</Badge>
                        <Button size="sm" variant="outline">
                          Coaching
                        </Button>
                        <Button size="sm">Contacter</Button>
                      </div>
                    </div>
                  ))}
                  {mockLowRatedTeachers.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucun professeur concerné.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alertes */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Centre d'alertes globales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start justify-between p-4 border rounded-lg ${
                        !alert.read ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant={
                              alert.type === "critical"
                                ? "destructive"
                                : alert.type === "warning"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {alert.type === "critical"
                              ? "Critique"
                              : alert.type === "warning"
                              ? "Attention"
                              : "Info"}
                          </Badge>
                          {!alert.read && <Badge variant="default">Nouveau</Badge>}
                        </div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Traiter
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ignorer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Séances OTP (placeholder) */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Supervision des séances OTP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Gestion des séances avec validation OTP...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comptabilité — période + charges + résumé + graphique */}
          <TabsContent value="accounting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Gestion des charges
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={periodGranularity}
                    onValueChange={(v: "month" | "quarter" | "year") => setPeriodGranularity(v)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensuel</SelectItem>
                      <SelectItem value="quarter">Trimestriel</SelectItem>
                      <SelectItem value="year">Annuel</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Période : du ... au ... (AA-MM simplifié) */}
                  <Input
                    type="month"
                    value={periodFrom}
                    onChange={(e) => setPeriodFrom(e.target.value)}
                    className="w-36"
                  />
                  <span className="text-sm text-muted-foreground">au</span>
                  <Input
                    type="month"
                    value={periodTo}
                    onChange={(e) => setPeriodTo(e.target.value)}
                    className="w-36"
                  />

                  <Button onClick={() => setShowChargeForm(true)} size="sm" className="ml-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter charge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showChargeForm && (
                  <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                    <h5 className="font-medium mb-3">Nouvelle charge</h5>
                    <div className="space-y-3">
                      <Input
                        placeholder="Nom de la charge"
                        value={newCharge.name}
                        onChange={(e) => setNewCharge({ ...newCharge, name: e.target.value })}
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Montant"
                          type="number"
                          value={newCharge.amount}
                          onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                        />
                        <Select
                          value={newCharge.category}
                          onValueChange={(value) => setNewCharge({ ...newCharge, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Personnel">Personnel</SelectItem>
                            <SelectItem value="Technique">Technique</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Administratif">Administratif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={addCharge} size="sm">
                          <Save className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                        <Button onClick={() => setShowChargeForm(false)} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {charges.map((charge) => (
                    <div
                      key={charge.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h5 className="font-medium">{charge.name}</h5>
                        <p className="text-sm text-muted-foreground">{charge.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{charge.amount}€</span>
                        {charge.editable && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setEditingCharge(charge)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteCharge(charge.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Résumé + Graphique */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-green-600" />
                    Chiffre d'affaires (période)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {filteredFinance.reduce((s, r) => s + r.revenue, 0).toLocaleString()}€
                  </div>
                  <ChangeIndicator change={mockData.globalStats.monthlyRevenue.change} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-orange-600" />
                    Total charges (période)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {filteredFinance.reduce((s, r) => s + r.charges, 0).toLocaleString()}€
                  </div>
                  <ChangeIndicator change={mockData.globalStats.monthlyCharges.change} isReverse />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Résultat net (période)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredFinance.reduce((s, r) => s + r.net, 0).toLocaleString()}€
                  </div>
                  <ChangeIndicator change={mockData.globalStats.profitAfterTax.change} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Évolution CA / Charges / Résultat
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredFinance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="CA" />
                    <Line type="monotone" dataKey="charges" name="Charges" />
                    <Line type="monotone" dataKey="net" name="Résultat" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paie : génération de brouillons depuis mock sessions */}
          <TabsContent value="payroll" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gestion des fiches de paie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Génération de brouillons de fiches de paie à partir des séances réalisées (mock). Vous pourrez plus tard
                  brancher la DB temps réel.
                </p>

                {/* Agrégation par professeur */}
                <div className="space-y-3">
                  {Object.entries(
                    mockCompletedSessions.reduce((acc: any, s) => {
                      if (!acc[s.teacher]) acc[s.teacher] = { hours: 0, amount: 0, rate: s.teacherHourlyRate };
                      acc[s.teacher].hours += s.duration / 60;
                      acc[s.teacher].amount += (s.duration / 60) * s.teacherHourlyRate;
                      return acc;
                    }, {})
                  ).map(([teacher, v]: any) => {
                    const employerChargesRate = 0.42; // mock charges patronales 42%
                    const employerCharges = v.amount * employerChargesRate;
                    const totalCost = v.amount + employerCharges;

                    return (
                      <div key={teacher} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{teacher}</h4>
                          <p className="text-sm text-muted-foreground">
                            {v.hours.toFixed(1)}h @ {v.rate}€/h — Brut: {v.amount.toFixed(2)}€ — Charges:{" "}
                            {employerCharges.toFixed(2)}€
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Coût total: {totalCost.toFixed(2)}€</Badge>
                          <Button size="sm" onClick={() => console.log("Brouillon fiche de paie pour", teacher, v)}>
                            Rédiger la fiche (brouillon)
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export PDF
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics détaillées */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance financière (période)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredFinance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="CA" />
                    <Bar dataKey="charges" name="Charges" />
                    <Bar dataKey="net" name="Résultat" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matières — heures complétées</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAgg}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" name="Heures" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MODALS */}
        <EditModal
          isOpen={!!showAttributionModal}
          onClose={() => setShowAttributionModal(null)}
          title={`Attribution pour ${showAttributionModal?.student?.name || ""}`}
        >
          {showAttributionModal && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Informations de l'élève</h4>
                <p>
                  <strong>Nom:</strong> {showAttributionModal.student.name}
                </p>
                <p>
                  <strong>Niveau:</strong> {showAttributionModal.student.level}
                </p>
                <p>
                  <strong>Matière:</strong> {showAttributionModal.subject}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Professeurs disponibles</h4>
                <div className="space-y-3">
                  {showAttributionModal.availableTeachers?.map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h5 className="font-medium">{teacher.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Note: {teacher.rating}/5 | Spécialités: {teacher.specialties.join(", ")}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">Score de compatibilité: {teacher.matchScore}%</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => assignTeacher(showAttributionModal.student.id, teacher.id, showAttributionModal.id)}
                      >
                        Attribuer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </EditModal>

        <EditModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={editingUser?.id ? "Modifier l'utilisateur" : "Créer un utilisateur"}
        >
          {editingUser && <UserForm user={editingUser} onSave={saveUser} onCancel={() => setEditingUser(null)} />}
        </EditModal>

        <EditModal isOpen={!!editingCharge} onClose={() => setEditingCharge(null)} title="Modifier la charge">
          {editingCharge && <ChargeForm charge={editingCharge} onSave={updateCharge} onCancel={() => setEditingCharge(null)} />}
        </EditModal>
      </div>
    </Layout>
  );
};

/* -------------------- FORMS -------------------- */

const UserForm = ({ user, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "parent",
    phone: user.phone || "",
    subjects: user.subjects?.join(", ") || "",
    hourlyRate: user.hourlyRate || "",
    level: user.level || "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({
      ...formData,
      subjects: formData.subjects ? formData.subjects.split(", ") : [],
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate as unknown as string) : null,
      status: user.status || "active",
      joinDate: user.joinDate || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rôle</label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="teacher">Professeur</SelectItem>
              <SelectItem value="student">Étudiant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </div>

      {formData.role === "teacher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Matières (séparées par virgule)</label>
            <Input
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              placeholder="Mathématiques, Physique"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Taux horaire (€)</label>
            <Input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            />
          </div>
        </div>
      )}

      {formData.role === "student" && (
        <div>
          <label className="block text-sm font-medium mb-1">Niveau</label>
          <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6ème">6ème</SelectItem>
              <SelectItem value="5ème">5ème</SelectItem>
              <SelectItem value="4ème">4ème</SelectItem>
              <SelectItem value="3ème">3ème</SelectItem>
              <SelectItem value="2nde">2nde</SelectItem>
              <SelectItem value="1ère">1ère</SelectItem>
              <SelectItem value="Terminale">Terminale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex space-x-2 pt-4">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </form>
  );
};

const ChargeForm = ({ charge, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: charge.name || "",
    amount: charge.amount?.toString() || "",
    category: charge.category || "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount as unknown as string),
      editable: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom de la charge</label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Montant (€)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personnel">Personnel</SelectItem>
              <SelectItem value="Technique">Technique</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Administratif">Administratif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default AdminDashboard;
