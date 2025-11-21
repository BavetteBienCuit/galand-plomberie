import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interventionsAPI } from '../services/api';
import { Intervention } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Calendar() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterventions();
  }, [currentDate]);

  const loadInterventions = async () => {
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const response = await interventionsAPI.getAll({
        start_date: start,
        end_date: end,
      });

      setInterventions(response.data);
    } catch (error) {
      console.error('Error loading interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getInterventionsForDate = (date: Date) => {
    return interventions.filter((intervention) =>
      isSameDay(new Date(intervention.intervention_date), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      invoiced: 'bg-purple-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const selectedInterventions = selectedDate ? getInterventionsForDate(selectedDate) : [];

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier des Interventions</h1>
        <p className="text-gray-600 mt-2">Vue mensuelle de vos interventions planifiées</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <button onClick={previousMonth} className="btn-secondary">
                ← Mois précédent
              </button>
              <h2 className="text-xl font-bold">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </h2>
              <button onClick={nextMonth} className="btn-secondary">
                Mois suivant →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center font-bold text-gray-700 py-2">
                  {day}
                </div>
              ))}

              {Array.from({
                length: (getDay(startOfMonth(currentDate)) + 6) % 7
              }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {daysInMonth.map((day) => {
                const dayInterventions = getInterventionsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDay = isToday(day);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 border rounded-lg hover:bg-gray-50 transition-colors
                      ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
                      ${isTodayDay ? 'font-bold ring-2 ring-primary-300' : ''}
                    `}
                  >
                    <div className="text-sm">{format(day, 'd')}</div>
                    {dayInterventions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayInterventions.slice(0, 3).map((intervention) => (
                          <div
                            key={intervention.id}
                            className={`w-2 h-2 rounded-full ${getStatusColor(intervention.status)}`}
                            title={`${intervention.client_first_name} ${intervention.client_last_name}`}
                          />
                        ))}
                        {dayInterventions.length > 3 && (
                          <div className="text-xs text-gray-500">+{dayInterventions.length - 3}</div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center space-x-4 text-sm">
              <span className="font-medium">Légende:</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Planifiée</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>En cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Terminée</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Facturée</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-bold mb-4">
              {selectedDate
                ? format(selectedDate, 'dd MMMM yyyy', { locale: fr })
                : 'Sélectionnez une date'}
            </h3>

            {!selectedDate ? (
              <p className="text-gray-500 text-sm">Cliquez sur une date pour voir les interventions</p>
            ) : selectedInterventions.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune intervention ce jour</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedInterventions.map((intervention) => (
                  <div key={intervention.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {intervention.client_first_name} {intervention.client_last_name}
                        </p>
                        <p className="text-sm text-gray-600">{intervention.type}</p>
                      </div>
                      {intervention.intervention_time && (
                        <span className="text-sm font-medium text-gray-700">
                          {intervention.intervention_time}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {intervention.problem_description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`badge badge-${intervention.status}`}>
                        {intervention.status === 'planned' && 'Planifiée'}
                        {intervention.status === 'in_progress' && 'En cours'}
                        {intervention.status === 'completed' && 'Terminée'}
                        {intervention.status === 'invoiced' && 'Facturée'}
                      </span>

                      {intervention.is_urgent && (
                        <span className="badge badge-urgent text-xs">URGENT</span>
                      )}
                    </div>

                    <Link
                      to={`/interventions/${intervention.id}/edit`}
                      className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block"
                    >
                      Voir détails →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
