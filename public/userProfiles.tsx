// data/mockUserProfiles.ts - Dati simulati per UserProfile
import type { UserProfile } from '../types/MenuItem';

// Collezione completa di profili utente simulati
export const mockUserProfiles: Record<string, UserProfile> = {
    // Amministratori
    admin: {
        name: 'Marco Rossi',
        email: 'marco.rossi@kgnsrl.it',
        role: 'System Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    superAdmin: {
        name: 'Giulia Bianchi',
        email: 'giulia.bianchi@kgnsrl.it',
        role: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Manager
    projectManager: {
        name: 'Luca Verdi',
        email: 'luca.verdi@kgnsrl.it',
        role: 'Project Manager',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    salesManager: {
        name: 'Anna Ferrari',
        email: 'anna.ferrari@kgnsrl.it',
        role: 'Sales Manager',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    hrManager: {
        name: 'Roberto Silva',
        email: 'roberto.silva@kgnsrl.it',
        role: 'HR Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Developer
    frontendDev: {
        name: 'Sara Conti',
        email: 'sara.conti@kgnsrl.it',
        role: 'Frontend Developer',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    backendDev: {
        name: 'Matteo Romano',
        email: 'matteo.romano@kgnsrl.it',
        role: 'Backend Developer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    fullStackDev: {
        name: 'Elena Ricci',
        email: 'elena.ricci@kgnsrl.it',
        role: 'Full Stack Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Designer
    uiDesigner: {
        name: 'Chiara Moretti',
        email: 'chiara.moretti@kgnsrl.it',
        role: 'UI/UX Designer',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    graphicDesigner: {
        name: 'Alessandro Bruno',
        email: 'alessandro.bruno@kgnsrl.it',
        role: 'Graphic Designer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Utenti business
    analyst: {
        name: 'Francesca Gallo',
        email: 'francesca.gallo@kgnsrl.it',
        role: 'Business Analyst',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    accountant: {
        name: 'Giuseppe Costa',
        email: 'giuseppe.costa@kgnsrl.it',
        role: 'Senior Accountant',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    marketingSpec: {
        name: 'Valentina Russo',
        email: 'valentina.russo@kgnsrl.it',
        role: 'Marketing Specialist',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Support
    supportAgent: {
        name: 'Davide Martini',
        email: 'davide.martini@kgnsrl.it',
        role: 'Support Agent',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Senza avatar (per testare fallback)
    noAvatar: {
        name: 'Mario Bianchi',
        email: 'mario.bianchi@kgnsrl.it',
        role: 'Quality Assurance'
        // Nessun avatar per testare il fallback
    },

    // Nomi lunghi (per testare truncation)
    longName: {
        name: 'Maria Antonietta Giovannetti-Torriani',
        email: 'maria.giovannetti@kgnsrl.it',
        role: 'Senior Business Development Manager',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Guest/temp users
    guest: {
        name: 'Ospite',
        email: 'guest@kgnsrl.it',
        role: 'Guest User'
    },

    intern: {
        name: 'Giulio Stagista',
        email: 'giulio.stagista@kgnsrl.it',
        role: 'Intern',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },

    // Utenti internazionali
    international: {
        name: 'John Smith',
        email: 'john.smith@kgnsrl.com',
        role: 'International Consultant',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
};

// Funzione per ottenere un profilo casuale
export const getRandomUserProfile = (): UserProfile => {
    const profiles = Object.values(mockUserProfiles);
    const randomIndex = Math.floor(Math.random() * profiles.length);
    return profiles[randomIndex];
};

// Funzione per ottenere profili per ruolo
export const getUserProfilesByRole = (role: string): UserProfile[] => {
    return Object.values(mockUserProfiles).filter(profile =>
        profile.role?.toLowerCase().includes(role.toLowerCase())
    );
};

// Profili predefiniti per scenari specifici
export const scenarioProfiles = {
    // Per testing responsive
    mobileTest: mockUserProfiles.admin,

    // Per testing nomi lunghi
    longNamesTest: mockUserProfiles.longName,

    // Per testing fallback avatar
    noAvatarTest: mockUserProfiles.noAvatar,

    // Per demo management
    managementDemo: mockUserProfiles.projectManager,

    // Per demo sviluppatori
    developmentDemo: mockUserProfiles.fullStackDev,

    // Per demo design
    designDemo: mockUserProfiles.uiDesigner
};

// Array di profili per demo/testing
export const demoUserProfiles = [
    mockUserProfiles.admin,
    mockUserProfiles.projectManager,
    mockUserProfiles.frontendDev,
    mockUserProfiles.uiDesigner,
    mockUserProfiles.noAvatar
];

// Esempio di utilizzo in React
export const UserProfileExample = () => {
    // Profilo fisso
    const currentUser = mockUserProfiles.admin;

    // Profilo casuale
    const randomUser = getRandomUserProfile();

    // Profili per tipo
    const developers = getUserProfilesByRole('developer');

    return { currentUser, randomUser, developers };
};

// Per TypeScript - verifica che tutti i profili rispettino l'interfaccia
export const validateProfiles = (): boolean => {
    return Object.values(mockUserProfiles).every(profile =>
        profile.name &&
        profile.email &&
        profile.email.includes('@')
    );
};

// Export default per compatibilità
export default mockUserProfiles;