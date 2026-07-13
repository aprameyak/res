"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContactInfo, ResumeDocument, ResumeSection } from "@resme/shared";
import { DEFAULT_SECTIONS } from "@resme/shared";

interface ResumeBuilderState {
  document: ResumeDocument;
  setContact: (contact: Partial<ContactInfo>) => void;
  updateSection: (id: string, content: string) => void;
  addSection: (section: ResumeSection) => void;
  removeSection: (id: string) => void;
  setSections: (sections: ResumeSection[]) => void;
  reset: () => void;
}

const defaultDocument: ResumeDocument = {
  title: "My Resume",
  contact: {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  sections: DEFAULT_SECTIONS,
};

export const useResumeBuilder = create<ResumeBuilderState>()(
  persist(
    (set) => ({
      document: defaultDocument,
      setContact: (contact) =>
        set((s) => ({
          document: { ...s.document, contact: { ...s.document.contact, ...contact } },
        })),
      updateSection: (id, content) =>
        set((s) => ({
          document: {
            ...s.document,
            sections: s.document.sections.map((sec) =>
              sec.id === id ? { ...sec, content } : sec
            ),
          },
        })),
      addSection: (section) =>
        set((s) => ({
          document: { ...s.document, sections: [...s.document.sections, section] },
        })),
      removeSection: (id) =>
        set((s) => ({
          document: {
            ...s.document,
            sections: s.document.sections.filter((sec) => sec.id !== id),
          },
        })),
      setSections: (sections) =>
        set((s) => ({ document: { ...s.document, sections } })),
      reset: () => set({ document: defaultDocument }),
    }),
    { name: "resme-resume" }
  )
);
