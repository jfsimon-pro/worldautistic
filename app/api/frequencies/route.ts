import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    try {
        const encodedCategoryId = encodeURIComponent(category.trim());
        const url = `/resources/by_asset_folder/?asset_folder=${encodedCategoryId}&max_results=50`;

        const { data } = await api.get(url);

        const audioFiles = data.resources.filter(
            (resource: { format: string }) => resource.format === 'mp3'
        );

        return NextResponse.json({
            resources: audioFiles.map(
                (resource: { public_id: string; secure_url: string }) => ({
                    public_id: resource.public_id,
                    secure_url: resource.secure_url,
                })
            ),
        });
    } catch (error: any) {
        console.error('Erro ao buscar frequências:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to fetch frequencies', details: error.message },
            { status: 500 }
        );
    }
}
