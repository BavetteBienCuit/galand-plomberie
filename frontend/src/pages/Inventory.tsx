import { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';
import { InventoryItem } from '../types';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    lowStock: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: '',
    quantity: 0,
    min_quantity: 5,
    unit_price: 0,
    category: '',
  });

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getAll(filters.search, filters.lowStock);
      setInventory(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        reference: item.reference || '',
        description: item.description || '',
        quantity: item.quantity,
        min_quantity: item.min_quantity,
        unit_price: item.unit_price || 0,
        category: item.category || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        reference: '',
        description: '',
        quantity: 0,
        min_quantity: 5,
        unit_price: 0,
        category: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem.id, formData);
      } else {
        await inventoryAPI.create(formData);
      }

      closeModal();
      loadInventory();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await inventoryAPI.delete(id);
      loadInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Stock & Inventaire</h1>
          <p className="text-gray-600 mt-2">Gérez vos pièces et matériaux</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Nouvel article</span>
        </button>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Rechercher (nom, référence, catégorie)..."
              className="input-field"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.lowStock}
                onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Afficher uniquement les stocks faibles</span>
            </label>
          </div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucun article trouvé</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix unitaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${
                    item.quantity <= item.min_quantity ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reference || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.quantity <= item.min_quantity && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                      <span className="text-xs text-gray-500 ml-2">(min: {item.min_quantity})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unit_price ? `${item.unit_price.toFixed(2)} €` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Référence</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock minimum
                  </label>
                  <input
                    type="number"
                    value={formData.min_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, min_quantity: parseInt(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix unitaire (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price: parseFloat(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
