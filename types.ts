export interface Technician {
    name: string;
    shop: string;
}

export interface Post {
    id: number; // Laravel IDs can come as strings or numbers
    title: string;
    slug: string;
    category: string; // Dynamic categories from your DB (GPU, Laptop, etc.)
    price: string;    // Now a pre-formatted string from Laravel (e.g., "₦420,000")
    location: string;
    description: string;
    image: string;
    technician: Technician;
    posted_at: string; // The "diffForHumans" date from Laravel
    author: string;
}