import { useState, useEffect, useCallback } from 'react';

export const useSideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const toggleAccordion = useCallback((label: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }, []);

  const isAccordionOpen = useCallback((label: string) => {
    return openAccordions.has(label);
  }, [openAccordions]);

  return {
    collapsed,
    mobileOpen,
    setCollapsed,
    setMobileOpen,
    toggleCollapse,
    toggleAccordion,
    isAccordionOpen,
  };
};