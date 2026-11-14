import { useState, FormEvent } from 'react';
import { Check, Plus, RotateCcw, Sun, Moon, Trash2 } from 'lucide-react';
import { RoutinePeriod, RoutineStep } from '../data/beautyData';

interface RoutinePlannerProps {
  steps: RoutineStep[];
  activePeriod: RoutinePeriod;
  onPeriodChange: (period: RoutinePeriod) => void;
  onToggleStep: (stepId: string) => void;
  onAddCustomStep: (period: RoutinePeriod, title: string, note: string) => void;
  onRemoveStep: (stepId: string) => void;
  onResetPeriod: (period: RoutinePeriod) => void;
}

export function RoutinePlanner({
  steps,
  activePeriod,
  onPeriodChange,
  onToggleStep,
  onAddCustomStep,
  onRemoveStep,
  onResetPeriod,
}: RoutinePlannerProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const periodSteps = steps
    .filter((s) => s.period === activePeriod)
    .sort((a, b) => a.order - b.order);

  const completedCount = periodSteps.filter((s) => s.completed).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCustomStep(
      activePeriod,
      newTitle.trim(),
      newNote.trim() || 'Aplicar suavemente sobre la piel limpia.'
    );
    setNewTitle('');
    setNewNote('');
    setIsAdding(false);
  };

  return (
    <section
      id="rutina"
      className="py-16 sm:py-20 border-t border-stone-200 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-medium tracking-wide text-stone-500">
              Planificador Diario
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-stone-900 leading-tight">
              Construye tu rutina constante sin excesos
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Alterna entre tu ritual de mañana y noche, marca cada paso completado y añade tus propios cuidados. Tu progreso se guarda automáticamente en este dispositivo.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center p-1 bg-stone-100 rounded-md border border-stone-200"
                role="tablist"
                aria-label="Momento del día"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePeriod === 'AM'}
                  onClick={() => onPeriodChange('AM')}
                  className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activePeriod === 'AM'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mañana</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePeriod === 'PM'}
                  onClick={() => onPeriodChange('PM')}
                  className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activePeriod === 'PM'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Noche</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onResetPeriod(activePeriod)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded-md hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reiniciar</span>
              </button>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span>
                Progreso {activePeriod === 'AM' ? 'de mañana' : 'de noche'}
              </span>
              <span className="font-medium text-stone-900 tabular-nums">
                {completedCount} de {periodSteps.length} pasos completados
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-stone-200">
              {periodSteps.length === 0 ? (
                <div className="py-10 text-center text-sm text-stone-500 border-b border-stone-200">
                  No hay pasos registrados para este horario. Añade uno abajo o desde el catálogo.
                </div>
              ) : (
                <ul className="divide-y divide-stone-200 border-b border-stone-200">
                  {periodSteps.map((step, index) => (
                    <li
                      key={step.id}
                      className="py-4 flex items-start justify-between gap-4 group"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.id)}
                        className="flex items-start gap-4 text-left flex-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm"
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                            step.completed
                              ? 'bg-stone-900 border-stone-900 text-stone-50'
                              : 'border-stone-300 bg-white group-hover:border-stone-500'
                          }`}
                        >
                          {step.completed && <Check className="w-3.5 h-3.5" />}
                        </span>
                        <div className="space-y-1">
                          <div className="text-xs text-stone-500 tabular-nums">
                            <span>Paso 0{index + 1}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="text-stone-700 font-medium">
                              {step.productName}
                            </span>
                          </div>
                          <p
                            className={`text-base font-medium transition-colors ${
                              step.completed
                                ? 'line-through text-stone-400'
                                : 'text-stone-900'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {step.note}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveStep(step.id)}
                        aria-label={`Quitar paso ${step.title}`}
                        className="p-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-5">
                {isAdding ? (
                  <form
                    onSubmit={handleSubmit}
                    className="p-4 bg-stone-50 border border-stone-200 rounded-md space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Nombre del paso (ej. Masaje facial)"
                        className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Nota breve (opcional)"
                        className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-medium bg-stone-900 text-stone-50 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        Guardar paso
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 hover:text-stone-900 py-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar paso personalizado</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
