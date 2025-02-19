import { useState, useEffect } from 'react';
import useDB from "@/hooks/useDB";
import { Tooltip } from "@mui/material";

export default function AppForm() {
    const [app, setApp] = useState({
        name: '',
        description_en: '',
        description_th: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        lineUrl: '',
        twitterUrl: '',
        facebook_api_key: '',
        google_api_key: '',
        line_api_key: '',
    });
    const { getById } = useDB("appdata");

    useEffect(() => {
        const fetchData = async () => {
            const appData = await getById("app"); // ✅ ใช้ await เพื่อดึงข้อมูลให้เสร็จ
            setApp(appData);
        };

        if (!app) {
            fetchData();
        }
    }, [app, getById]);

    console.log('appData', app);

    const handleSubmit = () => {
        const data = {
            name: app?.name,
            description: {
                en: app.description_en,
                th: app.description_th
            },
            social: {
                facebook: app.facebookUrl,
                instagram: app.instagramUrl,
                youtube: app.youtubeUrl,
                line: app.lineUrl,
                twitter: app.twitterUrl,
            },
            api_key: {
                facebook_api_key: app.facebook_api_key,
                google_api_key: app.google_api_key,
                line: app.line_api_key,
            }
        }
    }

    return (
        <div className="flex flex-col gap-2 sm:grid-cols-2 sm:gap-2">
            <div className='flex flex-col'>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ข้อมูล Applications</h1>
                <span className='text-gray-500'>จัดการข้อมูล application</span>
            </div>

            
            <div className="flex flex-col gap-2 sm:grid-cols-2 sm:gap-4">
                <Tooltip title={'กรอกชื่อ application'} placement={'top-start'} arrow>
                <div className="flex flex-row items-center gap-2 w-full">
                    <label for="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="ชื่อ Applications"
                        value={app?.name}
                        onChange={(e) => setApp({ ...app, name: e.target.value })}
                    />
                </div>
                </Tooltip>
                <div className='w-full'>
                    <label for="description" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Descriptions:</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <textarea
                            type="text"
                            name="adescription_th"
                            id="description_th"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="รายละเอียด (ภาษาไทย)"
                            rows={2}
                            onChange={(e) => setCompany({ ...app, description_th: e.target.value })}
                            value={app?.description_th}
                        />
                        <textarea
                            type="text"
                            name="adescription_th"
                            id="description_th"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="รายละเอียด (ภาษาอังกฤษ)"
                            rows={2}
                            onChange={(e) => setCompany({ ...app, description_th: e.target.value })}
                            value={app?.description_th}
                        />
                    </div>
                </div>

            </div>
            
        </div>
    );
}
