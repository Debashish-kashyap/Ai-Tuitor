import React, { useState } from 'react';
import { KnowledgeLevel, TutorConfig } from '../types';
import { Button } from './Button';
import { BookOpen, GraduationCap, Target } from 'lucide-react';

interface OnboardingProps {
  onStart: (config: TutorConfig) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<KnowledgeLevel>(KnowledgeLevel.BEGINNER);
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && goal) {
      onStart({ topic, level, goal });
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-primary-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Insight Tutor</h1>
          <p className="text-primary-100 mt-2 text-sm">Design your perfect learning session</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" />
              What do you want to learn?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, Quantum Physics, Spanish History"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" />
              Current Knowledge Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(KnowledgeLevel).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    level === lvl
                      ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                      : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Specific Goal (Optional but helpful)
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., I want to be able to build a todo app, or I want to understand the basics of entanglement."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors h-24 resize-none"
              required
            />
          </div>

          <Button type="submit" fullWidth disabled={!topic || !goal}>
            Start Learning Session
          </Button>
        </form>
      </div>
    </div>
  );
};