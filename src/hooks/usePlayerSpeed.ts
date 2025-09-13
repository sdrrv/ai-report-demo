/**
 * React hook for fetching and managing player speed data
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerSpeedData, DataHookResult, DataServiceError } from '@/types/services';
import { PlayerId } from '@/types/backend';
import { statisticsDataService } from '@/services/dataService';

interface UsePlayerSpeedOptions {
  playerId: PlayerId;
  matchId?: string;
  forceRefresh?: boolean;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onSuccess?: (data: PlayerSpeedData[]) => void;
  onError?: (error: Error) => void;
}

export function usePlayerSpeed(options: UsePlayerSpeedOptions): DataHookResult<PlayerSpeedData[]> {
  const {
    playerId,
    matchId = 'default',
    forceRefresh = false,
    timeout = 10000,
    retryAttempts = 2,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options;

  // State management
  const [data, setData] = useState<PlayerSpeedData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs to track component lifecycle and prevent memory leaks
  const mounted = useRef(true);
  const currentAttempt = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup function
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Main fetch function
  const fetchData = useCallback(async (attempt: number = 0): Promise<void> => {
    if (!mounted.current) return;

    try {
      setLoading(true);
      setError(null);

      const result = await statisticsDataService.getPlayerSpeed(playerId, matchId, {
        forceRefresh: forceRefresh || attempt > 0, // Force refresh on retries
        timeout
      });

      if (mounted.current) {
        setData(result);
        setLoading(false);
        onSuccess?.(result);
        currentAttempt.current = 0;
      }

    } catch (err) {
      if (!mounted.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      
      // Check if we should retry
      if (attempt < retryAttempts && isRetryableError(error)) {
        currentAttempt.current = attempt + 1;
        
        // Schedule retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        retryTimeoutRef.current = setTimeout(() => {
          if (mounted.current) {
            fetchData(attempt + 1);
          }
        }, delay);
        
        return;
      }

      // No more retries or non-retryable error
      setError(error);
      setLoading(false);
      onError?.(error);
      currentAttempt.current = 0;
    }
  }, [playerId, matchId, forceRefresh, timeout, retryAttempts, retryDelay, onSuccess, onError]);

  // Manual refetch function
  const refetch = useCallback(async (): Promise<void> => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    await fetchData(0);
  }, [fetchData]);

  // Effect to trigger initial fetch and handle dependency changes
  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  // Cleanup retry timeout on unmount or dependency changes
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [playerId, matchId]);

  return {
    data,
    loading,
    error,
    refetch
  };
}

// ===== UTILITY FUNCTIONS =====

function isRetryableError(error: Error): boolean {
  if (error instanceof DataServiceError) {
    // Don't retry validation errors or non-recoverable errors
    if (!error.recoverable) {
      return false;
    }
    
    // Retry network errors, cache errors, and fetch failures
    return [
      'FETCH_FAILED',
      'CACHE_ERROR'
    ].includes(error.code);
  }

  // Retry generic network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return true;
  }

  return false;
}

// ===== ADDITIONAL HOOKS =====

/**
 * Hook for player speed data with automatic polling
 */
export function usePlayerSpeedPolling(options: UsePlayerSpeedOptions & {
  pollInterval?: number;
  pollWhenVisible?: boolean;
} = {} as UsePlayerSpeedOptions): DataHookResult<PlayerSpeedData[]> & { 
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
} {
  const {
    pollInterval = 30000, // 30 seconds default
    pollWhenVisible = true,
    ...hookOptions
  } = options;

  const [isPolling, setIsPolling] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const visibilityListenerRef = useRef<() => void>();

  const hookResult = usePlayerSpeed(hookOptions);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return; // Already polling

    setIsPolling(true);
    
    pollIntervalRef.current = setInterval(() => {
      if (!pollWhenVisible || !document.hidden) {
        hookResult.refetch();
      }
    }, pollInterval);

    // Add visibility change listener if needed
    if (pollWhenVisible && !visibilityListenerRef.current) {
      visibilityListenerRef.current = () => {
        if (!document.hidden && isPolling) {
          hookResult.refetch();
        }
      };
      document.addEventListener('visibilitychange', visibilityListenerRef.current);
    }
  }, [pollInterval, pollWhenVisible, hookResult.refetch, isPolling]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = undefined;
    }
    
    if (visibilityListenerRef.current) {
      document.removeEventListener('visibilitychange', visibilityListenerRef.current);
      visibilityListenerRef.current = undefined;
    }
    
    setIsPolling(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    ...hookResult,
    isPolling,
    startPolling,
    stopPolling
  };
}

/**
 * Hook that fetches speed data for multiple players
 */
export function useMultiplePlayerSpeeds(playerIds: PlayerId[], matchId: string = 'default'): {
  data: Record<PlayerId, PlayerSpeedData[] | null>;
  loading: boolean;
  errors: Record<PlayerId, Error | null>;
  refetchAll: () => Promise<void>;
} {
  const [combinedData, setCombinedData] = useState<Record<PlayerId, PlayerSpeedData[] | null>>({} as Record<PlayerId, PlayerSpeedData[] | null>);
  const [combinedErrors, setCombinedErrors] = useState<Record<PlayerId, Error | null>>({} as Record<PlayerId, Error | null>);
  const [combinedLoading, setCombinedLoading] = useState(true);

  const results = playerIds.map(playerId => 
    usePlayerSpeed({ 
      playerId,
      matchId,
      onSuccess: (data) => {
        setCombinedData(prev => ({ ...prev, [playerId]: data }));
        setCombinedErrors(prev => ({ ...prev, [playerId]: null }));
      },
      onError: (error) => {
        setCombinedErrors(prev => ({ ...prev, [playerId]: error }));
      }
    })
  );

  // Update combined loading state
  useEffect(() => {
    const stillLoading = results.some(result => result.loading);
    setCombinedLoading(stillLoading);
  }, [results]);

  const refetchAll = useCallback(async () => {
    await Promise.all(results.map(result => result.refetch()));
  }, [results]);

  return {
    data: combinedData,
    loading: combinedLoading,
    errors: combinedErrors,
    refetchAll
  };
}

/**
 * Hook for getting the selected player's speed data from a list
 */
export function useSelectedPlayerSpeed(
  speedData: PlayerSpeedData[] | null, 
  selectedPlayerId: PlayerId
): PlayerSpeedData | null {
  return speedData?.find(player => player.playerId === selectedPlayerId) || null;
}