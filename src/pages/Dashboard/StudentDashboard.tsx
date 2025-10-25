import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, CreditCard, Star, BookOpen, Download, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data
const mockProfile = {
  id: 123,
  firstName: "Alex",
  lastName: "Martin",
  level: "Licence",
  balance: 6.5,
  desiredSubjects: ["Mathématiques", "Anglais"],
};

// Sessions par mois
const mockSessionsByMonth = {
  "2025-09": { count: 8, hours: 8.0 },
  "2025-08": { count: 4, hours: 4.0 },
  "2025-07": { count: 6, hours: 6.0 },
  "2025-06": { count: 3, hours: 3.0 },
};

// OTP sessions reçues du professeur
const mockOTPSessions = [
  { 
    id: 1, 
    teacher: "Marie Dubois", 
    subject: "Mathématiques", 
    date: "2025-09-20", 
    time: "18:00",
    duration: 60, 
    otp: "8794", 
    cost: 15.0,
    status: "pending",
    generated_at: "2025-09-20 19:05"
  },
  { 
    id: 2, 
    teacher: "John Smith", 
    subject: "Anglais", 
    date: "2025-09-18", 
    time: "19:30",
    duration: 90, 
    otp: "5621", 
    cost: 22.5,
    status: "validated",
    rating: 5,
    validated_at: "2025-09-18 21:05"
  }
];

const mockTeachersStats = {
  "Marie Dubois": { 
    globalRating: 4.7, 
    totalSessions: 156, 
    studentSessions: 8,
    lastSession: "2025-09-20", 
    studentRating: 4.8,
    subject: "Mathématiques"
  },
  "John Smith": { 
    globalRating: 4.3, 
    totalSessions: 203, 
    studentSessions: 6,
    lastSession: "2025-09-18", 
    studentRating: 4.2,
    subject: "Anglais"
  },
};

const mockUpcoming = [
  { id: 1, date: "2025-09-22", subject: "Mathématiques", teacher: "Marie Dubois", time: "18:00", duration: 60 },
  { id: 2, date: "2025-09-26", subject: "Anglais", teacher: "John Smith", time: "19:30", duration: 60 },
];

const mockHistory = [
  { id: 1, date: "2025-09-15", subject: "Mathématiques", teacher: "Marie Dubois", duration: 60, rating: 5, cost: 15.0 },
  { id: 2, date: "2025-09-10", subject: "Anglais", teacher: "John Smith", duration: 90, rating: 4, cost: 22.5 },
];

// Historique billing (achats de packs et recharges)
const mockBilling = [
  { id: 1, date: "2025-09-01", type: "pack", description: "Pack 10h Premium", amount: 89.90, hours: 10, status: "paid" },
  { id: 2, date: "2025-08-15", type: "recharge", description: "Recharge rapide 5h", amount: 45.00, hours: 5, status: "paid" },
  { id: 3, date: "2025-08-02", type: "pack", description: "Pack Standard 5h", amount: 39.90, hours: 5, status: "paid" },
];

// Packs disponibles
const mockPackages = [
  { id: 1, name: "Pack Découverte", hours: 3, price: 29.90, popular: false },
  { id: 2, name: "Pack Standard", hours: 10, price: 89.90, popular: true },
  { id: 3, name: "Pack Premium", hours: 20, price: 169.90, popular: false }
];

function fmtPercent(oldVal, newVal) {
  if (oldVal === 0) return newVal === 0 ? 0 : 100;
  return Math.round(((newVal - oldVal) / Math.abs(oldVal)) * 100);
}

export default function StudentDashboard() {
  // UI state
  const [selectedMonth, setSelectedMonth] = useState("2025-09");
  const [showMonths, setShowMonths] = useState(false);
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [validatingOTP, setValidatingOTP] = useState(null);
  const [pendingRating, setPendingRating] = useState(0);

  // Data
  const profile = mockProfile;
  const sessionsByMonth = mockSessionsByMonth;
  const teachersStats = mockTeachersStats;
  const upcoming = mockUpcoming;
  const history = mockHistory;
  const billing = mockBilling;
  const otpSessions = mockOTPSessions;
  const packages = mockPackages;

  // Derive month list (sorted desc)
  const months = useMemo(() => {
    return Object.keys(sessionsByMonth).sort((a, b) => (a < b ? 1 : -1));
  }, [sessionsByMonth]);

  // KPI calculations
  const currentMonthData = sessionsByMonth[selectedMonth] || { count: 0, hours: 0 };
  const prevMonthKey = months[months.indexOf(selectedMonth) + 1] || null;
  const prevMonthData = prevMonthKey ? sessionsByMonth[prevMonthKey] : { count: 0, hours: 0 };
  const sessionCountPct = fmtPercent(prevMonthData.count, currentMonthData.count);

  // Balance comparison (mock - should come from billing history)
  const balancePrev = 8.0;
  const balancePct = fmtPercent(balancePrev, profile.balance);

  useEffect(() => {
    if (!months.includes(selectedMonth) && months.length) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  // Handlers
  const handleValidateOTP = async (sessionId) => {
    if (pendingRating === 0) {
      alert("Vous devez noter la séance avant de valider l'OTP !");
      return;
    }

    try {
      // API call to validate OTP and deduct balance
      // const response = await validateSession(sessionId, pendingRating);
      
      // Mock: Update session status and deduct from balance
      console.log(`Validating session ${sessionId} with rating ${pendingRating}`);
      
      // Reset states
      setValidatingOTP(null);
      setPendingRating(0);
      
      alert(`Séance validée avec succès ! Note: ${pendingRating}/5. Votre solde a été débité.`);
    } catch (error) {
      alert("Erreur lors de la validation. Veuillez réessayer.");
    }
  };

  const handleRecharge = (amount) => {
    // API call to recharge balance
    alert(`Recharge de ${amount}h initiée (demo)`);
  };

  const handleBuyPack = (pack) => {
    // API call to buy pack
    alert(`Achat du ${pack.name} (${pack.hours}h - ${pack.price}€) initié (demo)`);
  };

  const downloadInvoice = (item) => {
    // Generate and download invoice
    alert(`Téléchargement de la facture ${item.id} (demo)`);
  };

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Espace étudiant</h1>
        <p className="text-muted-foreground">Suivez vos séances et gérez votre solde</p>
      </div>

      {/* KPI overview - Séances et Solde uniquement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Nombre de séances */}
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Séances ({selectedMonth})</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold">{currentMonthData.count}</div>
                <p className="text-xs text-muted-foreground">Séances ce mois</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${sessionCountPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sessionCountPct >= 0 ? `+${sessionCountPct}%` : `${sessionCountPct}%`}
                </div>
                <p className="text-xs text-muted-foreground">vs mois précédent</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => setShowMonths(!showMonths)}>
                {showMonths ? 'Masquer' : 'Tous les mois'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedMonth(months[0])}>
                Dernier mois
              </Button>
            </div>

            {showMonths && (
              <div className="mt-4 space-y-2 text-sm">
                {months.map((m) => (
                  <div key={m} className={`flex items-center justify-between p-2 border rounded ${m === selectedMonth ? 'bg-muted' : ''}`}>
                    <div>
                      <div className="font-medium">{m}</div>
                      <div className="text-xs text-muted-foreground">
                        {sessionsByMonth[m].count} séances · {sessionsByMonth[m].hours}h
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setSelectedMonth(m)}>Voir</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solde */}
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{profile.balance}h</div>
           {/* <p className="text-xs text-muted-foreground">
              {balancePct >= 0 ? `+${balancePct}%` : `${balancePct}%`} vs mois précédent
            </p>*/}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => handleRecharge(5)}>
                Recharger 5h
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleRecharge(10)}>
                Recharger 10h
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <div className="text-sm">Auto-recharge</div>
              </div>
              <Switch checked={autoRecharge} onCheckedChange={setAutoRecharge} />
            </div>
            {autoRecharge && (
              <p className="text-xs text-muted-foreground mt-2">
                Auto-recharge de 5h quand le solde &lt; 2h
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="otp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="otp">Validation OTP</TabsTrigger>
          <TabsTrigger value="teachers">Mes Professeurs</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Section OTP - PRIORITAIRE */}
        <TabsContent value="otp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Séances à valider (OTP du professeur)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {otpSessions.filter(s => s.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Aucune séance en attente de validation</p>
                </div>
              ) : (
                otpSessions
                  .filter(s => s.status === "pending")
                  .map((session) => (
                    <div key={session.id} className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{session.teacher.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{session.subject}</h4>
                            <p className="text-sm text-muted-foreground">avec {session.teacher}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.date} à {session.time} • {session.duration} min
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">En attente</Badge>
                          <p className="text-sm font-medium mt-1">Coût: {session.cost}€</p>
                        </div>
                      </div>

                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          OTP généré par le professeur le {session.generated_at}
                        </AlertDescription>
                      </Alert>

                      <div className="bg-white p-3 rounded border mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Code OTP:</span>
                          <div className="font-mono text-2xl font-bold text-blue-600">
                            {session.otp}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium mb-2 block">
                          ⭐ Noter cette séance (obligatoire avant validation):
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 cursor-pointer ${
                                star <= pendingRating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                              onClick={() => setPendingRating(star)}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {pendingRating > 0 ? `${pendingRating}/5` : "Cliquez pour noter"}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => handleValidateOTP(session.id)}
                        disabled={pendingRating === 0}
                      >
                        {pendingRating === 0 ? "Notez d'abord la séance" : `Valider la séance (${session.cost}€ sera débité)`}
                      </Button>
                    </div>
                  ))
              )}

{/* Séances passées du mois sélectionné */}
              {otpSessions.filter(s => s.status === "validated").length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      Séances passées ({selectedMonth})
                    </h3>
                    <Badge variant="outline">
                      {otpSessions.filter(s => s.status === "validated").length} séance(s)
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {otpSessions
                      .filter(s => s.status === "validated")
                      .map((session) => (
                        <div key={session.id} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{session.subject} - {session.teacher}</h4>
                              <p className="text-sm text-muted-foreground">
                                {session.date} à {session.time} • Validée le {session.validated_at}
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                Coût débité: {session.cost}€
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= session.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="default">Validée</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      💡 Utilisez le sélecteur de mois en haut pour voir les séances des autres mois
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Professeurs*/}
        <TabsContent value="teachers" className="space-y-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Statistiques de mes professeurs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {Object.entries(teachersStats).map(([name, stats]) => {
                                      // Heures complétées (à partir des séances validées pour ce prof)
                                      const validated = otpSessions.filter(
                                        (s: any) => s.status === "validated" && s.teacher === name
                                      );
                                      const totalMinutes = validated.reduce(
                                        (acc: number, s: any) => acc + (s.duration ?? 0),
                                        0
                                      );
                                      const hoursCompleted = totalMinutes / 60;
                                      const hoursLabel = Number.isInteger(hoursCompleted)
                                        ? `${hoursCompleted}h`
                                        : `${hoursCompleted.toFixed(1)}h`;
        
                                      return (
                                        <div key={name} className="p-4 border rounded-lg">
                                          <div className="grid gap-4 md:grid-cols-2">
                                            {/* Bloc gauche : Pdp + KPIs */}
                                            <div className="p-4 border rounded-lg">
                                              <div className="flex items-center gap-3 mb-4">
                                                <Avatar>
                                                  <AvatarFallback>
                                                    {name.split(" ").map((n) => n[0]).join("")}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <h4 className="font-medium">{name}</h4>
                                                  <p className="text-sm text-muted-foreground">{stats.subject}</p>
                                                </div>
                                              </div>
        
                                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div>
                                                  <p className="text-2xl font-bold text-yellow-500">{stats.globalRating}</p>
                                                  <p className="text-xs text-muted-foreground">Note globale</p>
                                                </div>
                                                <div>
                                                  <p className="text-2xl font-bold text-blue-500">{stats.studentRating}</p>
                                                  <p className="text-xs text-muted-foreground">Votre note</p>
                                                </div>
                                                <div>
                                                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                                                  <p className="text-xs text-muted-foreground">Séances totales</p>
                                                </div>
                                                <div>
                                                  <p className="text-2xl font-bold text-green-500">{stats.studentSessions}</p>
                                                  <p className="text-xs text-muted-foreground">Vos séances</p>
                                                </div>
                                              </div>
                                            </div>
        
                                            {/* Bloc droit : Résumé compact */}
                                            <div className="p-4 border rounded-lg bg-muted/30">
                                              <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-sm text-muted-foreground">Heures complétées</span>
                                                  <span className="font-semibold">{hoursLabel}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <span className="text-sm text-muted-foreground">Dernière séance</span>
                                                  <span className="font-semibold">
                                                    {new Date(`${stats.lastSession}T00:00:00`).toLocaleDateString("fr-FR")}
                                                  </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <span className="text-sm text-muted-foreground">Matière</span>
                                                  <span className="font-semibold">{stats.subject}</span>
                                                </div>
                                                  <div className="flex items-center justify-between">
                                                  <span className="text-sm text-muted-foreground">Votre note</span>
                                                  <span className="font-semibold">{stats.studentRating}/5</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
        

        {/* Section Billing */}
        <TabsContent value="billing" className="space-y-6">
          {/* Packs disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Acheter des heures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {packages.map((pack) => (
                  <div key={pack.id} className={`p-4 border-2 rounded-lg relative ${
                    pack.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    {pack.popular && (
                      <Badge className="absolute -top-2 left-4 bg-blue-500">
                        Populaire
                      </Badge>
                    )}
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">{pack.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-blue-600">{pack.hours}h</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold">{pack.price}€</span>
                        <p className="text-sm text-muted-foreground">
                          {(pack.price / pack.hours).toFixed(2)}€/heure
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={pack.popular ? "default" : "outline"}
                        onClick={() => handleBuyPack(pack)}
                      >
                        Acheter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recharge rapide */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <h3 className="col-span-full text-lg font-medium mb-2">Recharge rapide</h3>
                {[2, 5, 10, 15].map((hours) => (
                  <Button 
                    key={hours} 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => handleRecharge(hours)}
                  >
                    <span className="text-2xl font-bold">{hours}h</span>
                    <span className="text-sm">{(hours * 8.99).toFixed(2)}€</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historique billing */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des achats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billing.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        item.type === 'pack' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.date} • {item.hours}h ajoutées
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold">{item.amount}€</p>
                        <Badge variant="default">Payé</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => downloadInvoice(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      
      </Tabs>
    </div>
    </Layout>
  );
}