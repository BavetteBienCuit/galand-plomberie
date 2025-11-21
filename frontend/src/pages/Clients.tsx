import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientsAPI } from '../services/api';
import { Client } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, [search]);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll(search);
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      await clientsAPI.delete(id);
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Gérez votre base de données clients</p>
        </div>
        <Link to="/clients/new" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Nouveau client</span>
        </Link>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client (nom, email, téléphone)..."
          className="input-field"
        />
      </div>

      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {client.first_name} {client.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {client.intervention_count || 0} intervention(s)
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Téléphone:</span>
                  <p className="text-gray-600">{client.phone}</p>
                </div>

                {client.email && (
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{client.email}</p>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-700">Adresse:</span>
                  <p className="text-gray-600">
                    {client.address}
                    {client.city && `, ${client.postal_code} ${client.city}`}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <Link
                  to={`/clients/${client.id}/edit`}
                  className="flex-1 text-center btn-secondary text-sm"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="flex-1 btn-danger text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
