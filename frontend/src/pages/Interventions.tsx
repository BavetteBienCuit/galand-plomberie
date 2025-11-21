import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interventionsAPI, pdfAPI } from '../services/api';
import { Intervention } from '../types';
import { PlusIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    urgent: '',
    search: '',
  });

  useEffect(() => {
    loadInterventions();
  }, [filters]);

  const loadInterventions = async () => {
    try {
      const response = await interventionsAPI.getAll(filters);
      setInterventions(response.data);
    } catch (error) {
      console.error('Error loading interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id: number) => {
    try {
      const response = await pdfAPI.generate(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport-intervention-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      planned: 'badge badge-planned',
      in_progress: 'badge badge-in-progress',
      completed: 'badge badge-completed',
      invoiced: 'badge badge-invoiced',
    };
    return badges[status] || 'badge';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planned: 'Planifiée',
      in_progress: 'En cours',
      completed: 'Terminée',
      invoiced: 'Facturée',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interventions</h1>
          <p className="text-gray-600 mt-2">Gérez vos rapports d'intervention</p>
        </div>
        <Link to="/interventions/new" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Nouvelle intervention</span>
        </Link>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">Tous</option>
              <option value="planned">Planifiée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="invoiced">Facturée</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgence</label>
            <select
              value={filters.urgent}
              onChange={(e) => setFilters({ ...filters, urgent: e.target.value })}
              className="input-field"
            >
              <option value="">Toutes</option>
              <option value="true">Urgentes uniquement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Client, type..."
              className="input-field"
            />
          </div>
        </div>
      </div>

      {interventions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucune intervention trouvée</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interventions.map((intervention) => (
                <tr key={intervention.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{intervention.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {intervention.client_first_name} {intervention.client_last_name}
                    </div>
                    <div className="text-sm text-gray-500">{intervention.client_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(intervention.intervention_date).toLocaleDateString('fr-FR')}
                    {intervention.intervention_time && (
                      <div className="text-xs">{intervention.intervention_time}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {intervention.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(intervention.status)}>
                      {getStatusLabel(intervention.status)}
                    </span>
                    {intervention.is_urgent && (
                      <span className="badge badge-urgent ml-2">URGENT</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {intervention.total_cost ? `${intervention.total_cost.toFixed(2)} €` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link
                        to={`/interventions/${intervention.id}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => downloadPDF(intervention.id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                        title="Télécharger PDF"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
