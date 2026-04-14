// constants/data.ts
export interface Post {
    id: string;
    title: string;
    price?: string;
    category: 'Sale' | 'Repair' | 'Question';
    location: string; // Wuse 2, Banex, Garki, etc.
    author: string;
    description: string;
    image: string;
}

export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        title: 'Clean NVIDIA RTX 3060 - Barely Used',
        price: '₦350,000',
        category: 'Sale',
        location: 'Banex Plaza, Wuse 2',
        author: 'TechGuru_Abuja',
        description: 'Upgraded to a 4090. This card is in perfect condition. No mining history.',
        image: 'https://picsum.photos/seed/gpu/400/300',
    },
    {
        id: '2',
        title: 'How to fix HP Pavilion Hinge?',
        category: 'Question',
        location: 'Garki Area 11',
        author: 'Felix_Dev',
        description: 'My hinge is making a cracking sound. Any reliable technician in Garki?',
        image: 'https://picsum.photos/seed/laptop/400/300',
    },
];