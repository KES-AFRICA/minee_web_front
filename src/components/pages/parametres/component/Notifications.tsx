import { useState, useEffect } from "react";
import {
  Calculator,
  CheckCircle,
  Database,
  Info,
  Lightbulb,
  TriangleAlert,
  Bell,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "critical" | "inventory" | "valuation";
  assetId?: string;
  date: Date;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: "1",
        title: "Nouvel actif enregistré",
        message:
          "Transformateur HT/MT SN-4521 ajouté à l'inventaire du poste de Douala Est",
        type: "inventory",
        assetId: "TR-4521-2023",
        date: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
      },
      {
        id: "2",
        title: "Alerte de maintenance",
        message:
          "Maintenance préventive requise pour le disjoncteur DB-784. Planification nécessaire sous 48h.",
        type: "warning",
        assetId: "DJ-784-2021",
        date: new Date(Date.now() - 1000 * 60 * 120),
        read: false,
      },
      {
        id: "3",
        title: "Valorisation terminée",
        message:
          "La valorisation du parc de compteurs intelligents de la région du Littoral est complète. Rapport disponible.",
        type: "success",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
      },
      {
        id: "4",
        title: "Défaillance critique",
        message:
          "Panne majeure détectée sur la ligne HT 225kV - Zone Nord. Intervention d'urgence requise.",
        type: "critical",
        assetId: "LN-225-NORD",
        date: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      {
        id: "5",
        title: "Mise à jour inventaire",
        message:
          "Synchronisation terminée pour les équipements de protection du réseau MT.",
        type: "inventory",
        date: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: false,
      },
      {
        id: "6",
        title: "Calcul de dépréciation",
        message:
          "Nouveau calcul de dépréciation disponible pour les équipements installés avant 2020.",
        type: "valuation",
        date: new Date(Date.now() - 1000 * 60 * 60 * 6),
        read: true,
      },
    ];

    setNotifications(demoNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <TriangleAlert className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <Lightbulb className="h-5 w-5 text-red-500" />;
      case "inventory":
        return <Database className="h-5 w-5 text-blue-500" />;
      case "valuation":
        return <Calculator className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "success":
        return "Succès";
      case "warning":
        return "Alerte";
      case "critical":
        return "Critique";
      case "inventory":
        return "Inventaire";
      case "valuation":
        return "Valorisation";
      default:
        return "Info";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "inventory":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "valuation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "hier";
    if (days < 7) return `il y a ${days} jours`;

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setShowActions(null);
  };

  const filterOptions = [
    { value: "all", label: "Toutes", count: notifications.length },
    { value: "unread", label: "Non lues", count: unreadCount },
    {
      value: "critical",
      label: "Critiques",
      count: notifications.filter((n) => n.type === "critical").length,
    },
    {
      value: "warning",
      label: "Alertes",
      count: notifications.filter((n) => n.type === "warning").length,
    },
    {
      value: "inventory",
      label: "Inventaire",
      count: notifications.filter((n) => n.type === "inventory").length,
    },
    {
      value: "valuation",
      label: "Valorisation",
      count: notifications.filter((n) => n.type === "valuation").length,
    },
  ];

  return (
    <div className=" mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Filtrer par :
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification pour ce filtre</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3
                          className={`text-sm font-semibold ${
                            !notification.read
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeBadgeColor(
                            notification.type
                          )}`}
                        >
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{formatDate(notification.date)}</span>
                        {notification.assetId && (
                          <>
                            <span>•</span>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                              {notification.assetId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActions(
                          showActions === notification.id
                            ? null
                            : notification.id
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>

                    {showActions === notification.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-36">
                        <button
                          onClick={() => {
                            if (notification.read) {
                              markAsUnread(notification.id);
                            } else {
                              markAsRead(notification.id);
                            }
                            setShowActions(null);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          {notification.read ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span>
                            {notification.read
                              ? "Marquer non lu"
                              : "Marquer lu"}
                          </span>
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pied de page avec statistiques */}
      {notifications.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total : {notifications.length} notifications</span>
            <span>Dernière mise à jour : {formatDate(new Date())}</span>
          </div>
        </div>
      )}
    </div>
  );
}
