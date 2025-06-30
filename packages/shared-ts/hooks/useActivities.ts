import { useState, useCallback } from 'react';
import type { Activity } from '../types';

export function useActivities() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>({
    id: '1',
    type: 'commit',
    message: 'Refactors messaging and adds worker services',
    description: 'Improved message handling system and added background worker services for better performance',
    author: 'Andy Randriamarina',
    authorAvatar: 'AR',
    timestamp: '2h ago',
    date: 'Today',
    time: '3:13 AM',
    branch: 'develop',
    commitId: 'a1b2c3d',
    version: '2.1.3',
    branchColor: '#10b981',
    lane: 1
  });

  const handleActivitySelect = useCallback((activity: Activity | null) => {
    setSelectedActivity(activity);
  }, []);

  return {
    selectedActivity,
    handleActivitySelect,
    setSelectedActivity
  };
}
