import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { interventionsAPI, clientsAPI, inventoryAPI } from '../services/api';
import { Client, InventoryItem } from '../types';

export default function InterventionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [formData, setFormData] = useState({
    client_id: '',
    intervention_date: '',
    intervention_time: '',
    type: '',
    status: 'planned',
    problem_description: '',
    work_done: '',
    time_spent: '',
    labor_cost: '',
    is_urgent: false,
    notes: '',
    materials: [] as { inventory_id: number; quantity: number; unit_price: number }[],
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [clientsRes, inventoryRes] = await Promise.all([
        clientsAPI.getAll(),
        inventoryAPI.getAll(),
      ]);

      setClients(clientsRes.data);
      setInventory(inventoryRes.data);

      if (id) {
        const response = await interventionsAPI.getById(parseInt(id));
        const intervention = response.data;

        setFormData({
          client_id: intervention.client_id.toString(),
          intervention_date: intervention.intervention_date.split('T')[0],
          intervention_time: intervention.intervention_time || '',
          type: intervention.type,
          status: intervention.status,
          problem_description: intervention.problem_description,
          work_done: intervention.work_done || '',
          time_spent: intervention.time_spent?.toString() || '',
          labor_cost: intervention.labor_cost?.toString() || '',
          is_urgent: intervention.is_urgent,
          notes: intervention.notes || '',
          materials: intervention.materials?.map((m: any) => ({
            inventory_id: m.inventory_id,
            quantity: m.quantity,
            unit_price: m.unit_price || m.item_unit_price || 0,
          })) || [],
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { inventory_id: 0, quantity: 1, unit_price: 0 }],
    });
  };

  const removeMaterial = (index: number) => {
    const materials = [...formData.materials];
    materials.splice(index, 1);
    setFormData({ ...formData, materials });
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const materials = [...formData.materials];
    materials[index] = { ...materials[index], [field]: value };

    if (field === 'inventory_id') {
      const item = inventory.find((i) => i.id === parseInt(value));
      if (item && item.unit_price) {
        materials[index].unit_price = item.unit_price;
      }
    }

    setFormData({ ...formData, materials });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        client_id: parseInt(formData.client_id),
        time_spent: formData.time_spent ? parseFloat(formData.time_spent) : null,
        labor_cost: formData.labor_cost ? parseFloat(formData.labor_cost) : null,
        materials: formData.materials.filter((m) => m.inventory_id > 0),
      };

      if (id) {
        await interventionsAPI.update(parseInt(id), data);
      } else {
        await interventionsAPI.create(data);
      }

      navigate('/interventions');
    } catch (error) {
      console.error('Error saving intervention:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {id ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
      </h1>

      <form onSubmit={handleSubmit} className="card max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
            <select
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="Fuite">Fuite</option>
              <option value="Débouchage">Débouchage</option>
              <option value="Installation">Installation</option>
              <option value="Réparation">Réparation</option>
              <option value="Entretien">Entretien</option>
              <option value="Urgence">Urgence</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={formData.intervention_date}
              onChange={(e) => setFormData({ ...formData, intervention_date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
            <input
              type="time"
              value={formData.intervention_time}
              onChange={(e) => setFormData({ ...formData, intervention_time: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
            >
              <option value="planned">Planifiée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="invoiced">Facturée</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_urgent}
                onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Intervention urgente</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du problème *
          </label>
          <textarea
            value={formData.problem_description}
            onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
            className="input-field"
            rows={3}
            required
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Travaux effectués</label>
          <textarea
            value={formData.work_done}
            onChange={(e) => setFormData({ ...formData, work_done: e.target.value })}
            className="input-field"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temps passé (heures)</label>
            <input
              type="number"
              step="0.5"
              value={formData.time_spent}
              onChange={(e) => setFormData({ ...formData, time_spent: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main d'œuvre (€)</label>
            <input
              type="number"
              step="0.01"
              value={formData.labor_cost}
              onChange={(e) => setFormData({ ...formData, labor_cost: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Pièces utilisées</label>
            <button type="button" onClick={addMaterial} className="btn-secondary text-sm">
              + Ajouter une pièce
            </button>
          </div>

          {formData.materials.map((material, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-5">
                <select
                  value={material.inventory_id}
                  onChange={(e) => updateMaterial(index, 'inventory_id', e.target.value)}
                  className="input-field"
                >
                  <option value="0">Sélectionner</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} en stock)
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={material.quantity}
                  onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                  placeholder="Qté"
                  className="input-field"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  step="0.01"
                  value={material.unit_price}
                  onChange={(e) => updateMaterial(index, 'unit_price', e.target.value)}
                  placeholder="Prix unitaire"
                  className="input-field"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="btn-danger w-full"
                >
                  Suppr.
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button type="button" onClick={() => navigate('/interventions')} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
