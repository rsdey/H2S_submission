import { describe, it, expect, vi } from 'vitest';
import { getStratResponseStream, handleMasteryDetection } from '@/services/aiService';

describe('AI Service', () => {
  it('should handle mastery detection correctly', async () => {
    const fullResponse = "You have shown great progress! [MASTERY: Quantum Computing]";
    const userId = "test-user-123";
    
    const concept = await handleMasteryDetection(fullResponse, userId);
    expect(concept).toBe("Quantum Computing");
  });

  it('should return null if no mastery tag is found', async () => {
    const fullResponse = "Keep going, you are doing well!";
    const userId = "test-user-123";
    
    const concept = await handleMasteryDetection(fullResponse, userId);
    expect(concept).toBeNull();
  });
});
