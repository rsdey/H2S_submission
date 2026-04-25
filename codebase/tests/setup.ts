import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return () => {};
    }),
  })),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  serverTimestamp: vi.fn(),
}));

// Mock Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockImplementation(() => ({
      startChat: vi.fn().mockImplementation(() => ({
        sendMessageStream: vi.fn().mockResolvedValue({
          stream: [],
        }),
      })),
    })),
  })),
}));
