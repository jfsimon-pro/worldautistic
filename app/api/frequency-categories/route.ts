import { NextResponse } from 'next/server';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dghzftqkj';
const CLOUDINARY_API_KEY = '669128232276245';
const CLOUDINARY_API_SECRET = 'BALTsh-YCMYDEmfvaaOLeRAAVbE';

const api = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`,
    headers: {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')}`,
    },
});

export async function GET() {
    try {
        const { data } = await api.get('/folders');
        const categories = data.folders.map((folder: { name: string }) => folder.name);
        return NextResponse.json({ categories });
    } catch (error: any) {
        console.error('Erro ao buscar categorias:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to fetch categories', details: error.message },
            { status: 500 }
        );
    }
}
