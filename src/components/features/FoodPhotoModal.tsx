import React, { useState } from 'react';
import { X, Utensils, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { FoodPhotoLog } from '@/types';

interface FoodPhotoModalProps {
  onClose: () => void;
  onSaveFoodLog?: (log: FoodPhotoLog) => void;
}

const SAMPLE_MEALS = [
  {
    name: 'Grilled Salmon with Quinoa & Steamed Broccoli',
    photoUrl: '🥗',
    calories: 480,
    carbsG: 34,
    proteinG: 42,
    risk: 'Low' as const,
    insight: 'High omega-3 and complex fiber. Minimal glycemic excursion expected.'
  },
  {
    name: 'Brown Basmati Rice Bowl with Dal & Cucumber Raita',
    photoUrl: '🍛',
    calories: 520,
    carbsG: 68,
    proteinG: 18,
    risk: 'Moderate' as const,
    insight: 'Moderate complex carbohydrate load. Pair with 10-minute stroll for optimal glucose clearance.'
  },
  {
    name: 'Penne Pasta Arrabiata with Garlic Bread',
    photoUrl: '🍝',
    calories: 690,
    carbsG: 92,
    proteinG: 14,
    risk: 'High' as const,
    insight: 'High glycemic load. Expect elevated glucose curve and slight post-meal heart rate elevation.'
  }
];

export const FoodPhotoModal: React.FC<FoodPhotoModalProps> = ({
  onClose,
  onSaveFoodLog
}) => {
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [customName, setCustomName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeMeal = SAMPLE_MEALS[selectedMealIndex];

  const handleSave = () => {
    const log: FoodPhotoLog = {
      id: `food-${Date.now()}`,
      timestamp: new Date().toISOString(),
      photoUrl: activeMeal.photoUrl,
      mealName: customName.trim() || activeMeal.name,
      estimatedCalories: activeMeal.calories,
      estimatedCarbsG: activeMeal.carbsG,
      estimatedProteinG: activeMeal.proteinG,
      glucoseSpikeRisk: activeMeal.risk,
      insight: activeMeal.insight
    };

    if (onSaveFoodLog) onSaveFoodLog(log);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Utensils size={18} />
              </span>
              <h3 className="text-lg font-serif font-semibold text-slate-900">
                Food Photo & Glycemic Impact Log
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Estimate carbohydrate volume and anticipated blood sugar response.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif text-lg font-semibold text-slate-900">Meal Successfully Logged</h4>
            <p className="text-xs text-slate-500">
              Correlated with your continuous glucose and heart rate baseline.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Meal Selector Options */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Choose or scan meal type:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_MEALS.map((meal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMealIndex(idx)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedMealIndex === idx
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{meal.photoUrl}</span>
                    <span className="text-[11px] font-medium block truncate">{meal.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Meal Description
              </label>
              <input
                type="text"
                value={customName}
                placeholder={activeMeal.name}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full health-input text-xs"
              />
            </div>

            {/* Nutrition & Glucose Spike Impact Matrix */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Calories</span>
                  <span className="text-base font-serif font-bold text-slate-900">{activeMeal.calories}</span>
                  <span className="text-[10px] text-slate-400 block">kcal</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Carbs</span>
                  <span className="text-base font-serif font-bold text-slate-900">{activeMeal.carbsG}g</span>
                  <span className="text-[10px] text-slate-400 block">glycemic driver</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Protein</span>
                  <span className="text-base font-serif font-bold text-slate-900">{activeMeal.proteinG}g</span>
                  <span className="text-[10px] text-slate-400 block">satiety</span>
                </div>
              </div>

              {/* Glucose Spike Risk Indicator */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={16}
                    className={
                      activeMeal.risk === 'High'
                        ? 'text-red-500'
                        : activeMeal.risk === 'Moderate'
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Estimated Glucose Spike Risk:
                    </span>
                    <span className="text-[11px] text-slate-500">{activeMeal.insight}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    activeMeal.risk === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : activeMeal.risk === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {activeMeal.risk} Spike
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info size={12} />
                <span>Feeds into Cause-and-Effect discovery</span>
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors"
              >
                Log Meal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
