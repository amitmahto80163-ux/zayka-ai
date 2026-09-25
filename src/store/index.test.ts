import { describe, it, expect, beforeEach } from 'vitest';
import { useZaykaStore } from './index';

describe('useZaykaStore', () => {
  beforeEach(() => {
    useZaykaStore.setState({
      favourites: [],
      currentStreak: 0,
      lastCookDate: null
    });
  });

  it('addFavourite should deduplicate entries', () => {
    const store = useZaykaStore.getState();
    store.addFavourite('recipe-1');
    store.addFavourite('recipe-2');
    store.addFavourite('recipe-1');
    
    expect(useZaykaStore.getState().favourites).toEqual(['recipe-1', 'recipe-2']);
  });

  it('updateStreak should correctly calculate streaks', () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // First cook
    useZaykaStore.getState().updateStreak();
    expect(useZaykaStore.getState().currentStreak).toBe(1);
    expect(useZaykaStore.getState().lastCookDate).toBe(today);

    // Cook again today (streak shouldn't increase but also not reset)
    useZaykaStore.getState().updateStreak();
    expect(useZaykaStore.getState().currentStreak).toBe(1);
    
    // Cook tomorrow (simulated by setting lastCookDate to yesterday)
    useZaykaStore.setState({ lastCookDate: yesterday });
    useZaykaStore.getState().updateStreak();
    expect(useZaykaStore.getState().currentStreak).toBe(2);
  });
});
