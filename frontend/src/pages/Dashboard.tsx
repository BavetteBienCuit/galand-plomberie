import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statisticsAPI, interventionsAPI } from '../services/api';
import { Statistics, Intervention } from '../types';
import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [urgentInterventions, setUrgentInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, urgentResponse] = await Promise.all([
        statisticsAPI.getOverview(),
        interventionsAPI.getAll({ urgent: 'true' }),
      ]);

      setStatistics(statsResponse.data);
      setUrgentInterventions(urgentResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Interventions ce mois',
      value: statistics?.interventions_this_month || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Clients actifs',
      value: statistics?.active_clients || 0,
      icon: UserGroupIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Revenu ce mois',
      value: `${(statistics?.revenue_this_month || 0).toFixed(2)} €`,
      icon: CurrencyEuroIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Interventions urgentes',
      value: statistics?.urgent_interventions || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Interventions urgentes</h2>
            <Link to="/interventions?urgent=true" className="text-primary-600 hover:text-primary-700">
              Voir tout
            </Link>
          </div>

          {urgentInterventions.length === 0 ? (
            <p className="text-gray-500">Aucune intervention urgente</p>
          ) : (
            <div className="space-y-3">
              {urgentInterventions.slice(0, 5).map((intervention) => (
                <div
                  key={intervention.id}
                  className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {intervention.client_first_name} {intervention.client_last_name}
                      </p>
                      <p className="text-sm text-gray-600">{intervention.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(intervention.intervention_date).toLocaleDateString('fr-FR')}
                        {intervention.intervention_time && ` - ${intervention.intervention_time}`}
                      </p>
                    </div>
                    <span className="badge badge-urgent">URGENT</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé global</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total interventions</span>
              <span className="font-bold text-gray-900">{statistics?.total_interventions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Terminées</span>
              <span className="font-bold text-green-600">{statistics?.completed_interventions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">En attente</span>
              <span className="font-bold text-yellow-600">{statistics?.pending_interventions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Revenu total</span>
              <span className="font-bold text-purple-600">
                {(statistics?.total_revenue || 0).toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Alertes stock</span>
              <span className="font-bold text-red-600">{statistics?.low_stock_items || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/interventions/new"
          className="card hover:shadow-lg transition-shadow text-center cursor-pointer"
        >
          <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-primary-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Nouvelle intervention</h3>
        </Link>

        <Link
          to="/clients/new"
          className="card hover:shadow-lg transition-shadow text-center cursor-pointer"
        >
          <UserGroupIcon className="h-12 w-12 mx-auto text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Nouveau client</h3>
        </Link>

        <Link
          to="/calendar"
          className="card hover:shadow-lg transition-shadow text-center cursor-pointer"
        >
          <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Voir le calendrier</h3>
        </Link>
      </div>
    </div>
  );
}
