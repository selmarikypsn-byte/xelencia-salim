import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Euro, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  CheckCircle, 
  User,
  FileText,
  Download,
  ShieldCheck,
  Plus,
  Star,
  Trophy,
  Target,
  Zap,
  RefreshCw,
  Timer
} from "lucide-react";

// Mock data avec historique pour comparaisons
const mockStatsHistory = {
  current: {
    totalHours: 156,
    monthlyHours: 32,
    totalEarnings: 2340,
    monthlyEarnings: 480,
    activeStudents: 12,
    completedSessions: 89
  },
  previous: {
    monthlyHours: 28,
    monthlyEarnings: 420,
    activeStudents: 10,
    completedSessions: 76
  }
};

const mockStudents = [
  {
    id: 1,
    name: "Emma Dubois",
    hoursCompleted: 15,
    lastSession: "2024-01-15",
    subject: "Mathématiques",
    level: "3ème",
    avatar: "/placeholder.svg",
    rating: 4.8,
    totalSessions: 18
  },
  {
    id: 2,
    name: "Lucas Martin",
    hoursCompleted: 8,
    lastSession: "2024-01-12",
    subject: "Physique",
    level: "Terminale",
    avatar: "/placeholder.svg",
    rating: 4.6,
    totalSessions: 12
  },
  {
    id: 3,
    name: "Sophie Bernard",
    hoursCompleted: 22,
    lastSession: "2024-01-10",
    subject: "Mathématiques",
    level: "1ère",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalSessions: 28
  }
];

const mockSessions = [
  {
    id: 1,
    student: "Emma Dubois",
    studentId: 1,
    subject: "Mathématiques",
    date: "2024-01-15",
    duration: 60,
    status: "completed",
    validated: true,
    otpSent: false,
    rating: 5,
    notes: "Excellent progrès en algèbre"
  },
  {
    id: 2,
    student: "Lucas Martin",
    studentId: 2,
    subject: "Physique",
    date: "2024-01-12",
    duration: 90,
    status: "pending",
    validated: false,
    otpSent: true,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    rating: null,
    notes: ""
  }
];

const mockPayslips = [
  { id: 1, month: "Décembre 2023", amount: 520, status: "paid", nextPayment: "2024-02-15" },
  { id: 2, month: "Novembre 2023", amount: 480, status: "paid", nextPayment: "2024-01-15" },
  { id: 3, month: "Octobre 2023", amount: 445, status: "paid", nextPayment: "2023-12-15" }
];

const mockMonthlyStats = [
  { month: "Jan 2024", hours: 32, earnings: 480, sessions: 15 },
  { month: "Déc 2023", hours: 35, earnings: 520, sessions: 18 },
  { month: "Nov 2023", hours: 28, earnings: 420, sessions: 14 },
  { month: "Oct 2023", hours: 30, earnings: 445, sessions: 16 },
  { month: "Sep 2023", hours: 25, earnings: 380, sessions: 12 },
  { month: "Août 2023", hours: 20, earnings: 300, sessions: 10 }
];

const TeacherDashboard = () => {
  const [sessions, setSessions] = useState(mockSessions);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({
    subject: "",
    duration: 60,
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer pour mettre à jour l'expiration des OTP
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculatePercentage = (current: number, previous: number): string => {
    if (previous === 0) return "0";
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const generateOTPForSession = () => {
    if (!selectedStudent) return;
    
    const newSession = {
      id: Date.now(),
      student: selectedStudent.name,
      studentId: selectedStudent.id,
      subject: sessionDetails.subject,
      date: sessionDetails.date,
      duration: typeof sessionDetails.duration === 'string' ? parseInt(sessionDetails.duration) : sessionDetails.duration,
      status: "pending",
      validated: false,
      otpSent: true,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      rating: null,
      notes: sessionDetails.notes
    };
    
    setSessions([...sessions, newSession]);
    setSelectedStudent(null);
    setSessionDetails({
      subject: "",
      duration: 60,
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });
  };

  const resendOTP = (sessionId) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) }
        : session
    ));
  };

  const validateSession = (sessionId, rating = 5) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, validated: true, status: "completed", rating }
        : session
    ));
  };

  const isOTPExpired = (expiry) => {
    return expiry && currentTime > expiry;
  };

  const getTimeRemaining = (expiry: Date) => {
    if (!expiry) return null;
    const remaining = expiry.getTime() - currentTime.getTime();
    if (remaining <= 0) return null;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDisplayStats = () => {
    if (selectedPeriod === "current") {
      return mockStatsHistory.current;
    }
    return mockMonthlyStats.find(m => m.month === selectedPeriod) || mockStatsHistory.current;
  };

  const displayStats = getDisplayStats();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord professeur</h1>
          <p className="text-muted-foreground">Gérez vos cours et suivez vos revenus</p>
          
          <div className="mt-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Mois actuel</SelectItem>
                {mockMonthlyStats.map((stat) => (
                  <SelectItem key={stat.month} value={stat.month}>
                    {stat.month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview with Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heures ce mois</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {selectedPeriod === "current" ? mockStatsHistory.current.monthlyHours : (displayStats as any).hours}h
              </div>
              {selectedPeriod === "current" && (
                <div className="flex items-center space-x-1">
                  {parseFloat(calculatePercentage(mockStatsHistory.current.monthlyHours, mockStatsHistory.previous.monthlyHours)) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p className={`text-xs ${parseFloat(calculatePercentage(mockStatsHistory.current.monthlyHours, mockStatsHistory.previous.monthlyHours)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculatePercentage(mockStatsHistory.current.monthlyHours, mockStatsHistory.previous.monthlyHours)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Total: {mockStatsHistory.current.totalHours}h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {selectedPeriod === "current" ? mockStatsHistory.current.monthlyEarnings : (displayStats as any).earnings}€
              </div>
              {selectedPeriod === "current" && (
                <div className="flex items-center space-x-1">
                  {parseFloat(calculatePercentage(mockStatsHistory.current.monthlyEarnings, mockStatsHistory.previous.monthlyEarnings)) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p className={`text-xs ${parseFloat(calculatePercentage(mockStatsHistory.current.monthlyEarnings, mockStatsHistory.previous.monthlyEarnings)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculatePercentage(mockStatsHistory.current.monthlyEarnings, mockStatsHistory.previous.monthlyEarnings)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Total: {mockStatsHistory.current.totalEarnings}€</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Élèves actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedPeriod === "current" ? mockStatsHistory.current.activeStudents : (displayStats as any).activeStudents || 0}</div>
              {selectedPeriod === "current" && (
                <div className="flex items-center space-x-1">
                  {parseFloat(calculatePercentage(mockStatsHistory.current.activeStudents, mockStatsHistory.previous.activeStudents)) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p className={`text-xs ${parseFloat(calculatePercentage(mockStatsHistory.current.activeStudents, mockStatsHistory.previous.activeStudents)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculatePercentage(mockStatsHistory.current.activeStudents, mockStatsHistory.previous.activeStudents)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">étudiants suivis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séances validées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedPeriod === "current" ? mockStatsHistory.current.completedSessions : (displayStats as any).sessions}
              </div>
              {selectedPeriod === "current" && (
                <div className="flex items-center space-x-1">
                  {parseFloat(calculatePercentage(mockStatsHistory.current.completedSessions, mockStatsHistory.previous.completedSessions)) >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <p className={`text-xs ${parseFloat(calculatePercentage(mockStatsHistory.current.completedSessions, mockStatsHistory.previous.completedSessions)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculatePercentage(mockStatsHistory.current.completedSessions, mockStatsHistory.previous.completedSessions)}%
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">séances terminées</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions">Séances</TabsTrigger>
            <TabsTrigger value="students">Élèves</TabsTrigger>
            <TabsTrigger value="earnings">Revenus</TabsTrigger>
            <TabsTrigger value="payroll">Fiches de paie</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Séances à valider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{session.student}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.subject} - {session.duration} min
                          </p>
                          <p className="text-sm text-muted-foreground">{session.date}</p>
                          {session.validated && session.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-sm text-yellow-600">{session.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.validated ? (
                          <div className="space-y-1">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Validée
                            </Badge>
                            {session.notes && (
                              <p className="text-xs text-muted-foreground max-w-48 truncate">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {session.otpSent ? (
                              <div className="space-y-1">
                                {isOTPExpired(session.otpExpiry) ? (
                                  <div className="space-y-1">
                                    <Badge variant="destructive">OTP Expiré</Badge>
                                    <Button 
                                      onClick={() => resendOTP(session.id)} 
                                      size="sm" 
                                      variant="outline"
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Renvoyer
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                      <Timer className="h-3 w-3 mr-1" />
                                      OTP Envoyé
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">
                                      Expire dans: {getTimeRemaining(session.otpExpiry)}
                                    </p>
                                    <Button 
                                      onClick={() => validateSession(session.id)} 
                                      size="sm"
                                    >
                                      Valider
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">En attente</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mes élèves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.level}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-sm">{student.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Heures complétées:</span>
                          <span className="font-medium">{student.hoursCompleted}h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Séances totales:</span>
                          <span className="font-medium">{student.totalSessions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dernière séance:</span>
                          <span className="font-medium">{student.lastSession}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Matière:</span>
                          <span className="font-medium">{student.subject}</span>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Programmer une séance
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouvelle séance - {student.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject">Matière</Label>
                              <Select 
                                value={sessionDetails.subject} 
                                onValueChange={(value) => setSessionDetails({...sessionDetails, subject: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une matière" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                                  <SelectItem value="Physique">Physique</SelectItem>
                                  <SelectItem value="Chimie">Chimie</SelectItem>
                                  <SelectItem value="SVT">SVT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="duration">Durée (minutes)</Label>
                              <Select 
                                value={sessionDetails.duration.toString()} 
                                onValueChange={(value) => setSessionDetails({...sessionDetails, duration: parseInt(value)})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="60">60 minutes</SelectItem>
                                  <SelectItem value="90">90 minutes</SelectItem>
                                  <SelectItem value="120">120 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                value={sessionDetails.date}
                                onChange={(e) => setSessionDetails({...sessionDetails, date: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="notes">Notes préliminaires</Label>
                              <Textarea
                                id="notes"
                                placeholder="Objectifs de la séance..."
                                value={sessionDetails.notes}
                                onChange={(e) => setSessionDetails({...sessionDetails, notes: e.target.value})}
                              />
                            </div>
                            
                            <Button 
                              onClick={generateOTPForSession} 
                              className="w-full"
                              disabled={!sessionDetails.subject}
                            >
                              <ShieldCheck className="h-4 w-4 mr-1" />
                              Générer OTP et Créer la séance
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gamification Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Statistiques & Récompenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Points totaux</span>
                      </div>
                      <span className="font-bold text-2xl text-yellow-600">2,450</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Objectif mensuel</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">32/40h</div>
                        <Progress value={80} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Série en cours</span>
                      </div>
                      <span className="font-bold text-green-600">7 jours</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Badges obtenus</h4>
                      <div className="flex space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">Expert Math</Badge>
                        <Badge className="bg-blue-100 text-blue-800">Mentor</Badge>
                        <Badge className="bg-green-100 text-green-800">Assidu</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Evolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution des revenus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMonthlyStats.slice(0, 4).map((stat, index) => (
                      <div key={stat.month} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div>
                          <span className="font-medium">{stat.month}</span>
                          <p className="text-sm text-muted-foreground">{stat.hours}h - {stat.sessions} séances</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">{stat.earnings}€</span>
                          {index > 0 && (
                            <div className="flex items-center">
                              {stat.earnings > mockMonthlyStats[index + 1].earnings ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                              <span className={`text-xs ml-1 ${stat.earnings > mockMonthlyStats[index + 1].earnings ? 'text-green-500' : 'text-red-500'}`}>
                                {((stat.earnings - mockMonthlyStats[index + 1].earnings) / mockMonthlyStats[index + 1].earnings * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par matière et performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Distribution des revenus</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Mathématiques</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Physique</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                          </div>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Chimie</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '10%'}}></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Notes moyennes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Mathématiques</span>
                        <div className="flex items-center space-x-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= 4.8 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm ml-1">4.8</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Physique</span>
                        <div className="flex items-center space-x-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= 4.6 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm ml-1">4.6</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Chimie</span>
                        <div className="flex items-center space-x-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-3 w-3 ${star <= 4.9 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm ml-1">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Taux de satisfaction</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">96%</div>
                        <div className="text-sm text-green-700">Élèves satisfaits</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">89%</div>
                        <div className="text-sm text-blue-700">Taux de rétention</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Payroll Tab */}
          <TabsContent value="payroll" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mes fiches de paie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPayslips.map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{payslip.month}</h4>
                        <p className="text-sm text-muted-foreground">Montant: {payslip.amount}€</p>
                        <p className="text-sm text-blue-600 font-medium">
                          Prochain virement: {payslip.nextPayment}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={payslip.status === 'paid' ? 'default' : 'secondary'} className={payslip.status === 'paid' ? 'bg-green-100 text-green-800' : ''}>
                          {payslip.status === 'paid' ? 'Payé' : 'En attente'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Prochain virement prévu</h4>
                        <p className="text-sm text-blue-700">Basé sur vos heures du mois en cours</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">480€</div>
                        <div className="text-sm text-blue-700">15 Mars 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;