import { useState, useEffect } from 'react';
import useDB from "@/hooks/useDB";
import { Tooltip } from "@mui/material";
import { toast } from 'react-toastify';

export default function ApphtmlForm() {
    const [app, setApp] = useState(null);
    const [descriptions, setDescriptions] = useState({});
    const [checkedInputs, setCheckedInputs] = useState({});
    const [social, setSocial] = useState({});

    const { subscribe, getById, update } = useDB("appdata");

    useEffect(() => {
        const unsubscribe = getById("app", (appData) => {
            if (appData) {
                setSocial({
                    facebookUrl: appData?.social?.facebookUrl,
                    instagramUrl: appData?.social?.instagramUrl,
                    youtubeUrl: appData?.social?.youtubeUrl,
                    lineUrl: appData?.social?.lineUrl,
                    twitterUrl: appData?.social?.twitterUrl,
                    tiktokUrl: appData?.social?.tiktokUrl,
                });
                setCheckedInputs({
                    facebookUrl: appData?.social?.facebookUrl ? true : false,
                    instagramUrl: appData?.social?.instagramUrl ? true : false,
                    youtubeUrl: appData?.social?.youtubeUrl ? true : false,
                    lineUrl: appData?.social?.lineUrl ? true : false,
                    twitterUrl: appData?.social?.twitterUrl ? true : false,
                    tiktokUrl: appData?.social?.tiktokUrl ? true : false,
                });
                setDescriptions({
                    th: appData?.descriptions?.th,
                    en: appData?.descriptions?.en,
                });
                setApp(appData);
            }
        });

        return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount

    }, []);

    const handleSubmit = async () => {
        const data = {
            name: app.name,
            descriptions: {
                th: descriptions.th,
                en: descriptions.en
            },
            social: {
                facebookUrl: social.facebookUrl || null,
                instagramUrl: social.instagramUrl || null,
                youtubeUrl: social.youtubeUrl || null,
                lineUrl: social.lineUrl || null,
                twitterUrl: social.twitterUrl || null
            },
        }

        console.log('submit data:', data);

        try {
            await update('app', data);
            toast.success('บันทึกข้อมูลสำเร็จแล้ว!');
        } catch (error) {
            console.log(error);
            toast.error('บันทึกขอมูลไม่สำเร็จ!')
        }
        
    };


    const socialData = [
        {label: "facebook", input: "facebookUrl", icon:
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
        },
        {label: "instagram", input: "instagramUrl", icon:
            <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd"/>
            </svg>
        },
        {label: "youtube", input: "youtubeUrl", icon:
            <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clipRule="evenodd"/>
            </svg>
        },
        {label: "line", input: "lineUrl", icon:
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                id="Capa_1"
                className="w-8 h-8"
                fill="currentColor"
                version="1.1"
                viewBox="0 0 296.528 296.528"
            >
                <path d="m295.838 115.347.003-.001-.092-.76a.4.4 0 0 0-.008-.068l-.344-2.858-.238-1.974-.072-.594-.147.018c-3.617-20.571-13.553-40.093-28.942-56.762-15.317-16.589-35.217-29.687-57.548-37.878-19.133-7.018-39.434-10.577-60.337-10.577-28.22 0-55.627 6.637-79.257 19.193C23.289 47.297-3.585 91.799.387 136.461c2.056 23.111 11.11 45.11 26.184 63.621 14.188 17.423 33.381 31.483 55.503 40.66 13.602 5.642 27.051 8.301 41.291 11.116l1.667.33c3.921.776 4.975 1.842 5.247 2.264.503.784.24 2.329.038 3.18q-.28 1.177-.57 2.352c-1.529 6.235-3.11 12.683-1.868 19.792 1.428 8.172 6.531 12.859 14.001 12.86h.002c8.035 0 17.18-5.39 23.231-8.956l.808-.475c14.436-8.478 28.036-18.041 38.271-25.425 22.397-16.159 47.783-34.475 66.815-58.17 19.165-23.865 28.193-54.532 24.831-84.263M92.343 160.561H66.761a7 7 0 0 1-7-7V99.865a7 7 0 1 1 14 0v46.696h18.581a7 7 0 0 1 .001 14m26.687-7.19a7 7 0 1 1-14 0V99.675a7 7 0 1 1 14 0zm63.274 0a7 7 0 0 1-12.665 4.113l-25.207-34.717v30.605a7 7 0 1 1-14 0v-52.16a7 7 0 0 1 12.665-4.113l25.207 34.717V99.675a7 7 0 1 1 14 0zm51.007 5.898h-34.645a7 7 0 0 1-7-7V98.573a7 7 0 0 1 7-7h33.57a7 7 0 1 1 0 14h-26.57v12.849h21.562a7 7 0 1 1 0 14h-21.562v12.847h27.645a7 7 0 1 1 0 14"></path>
            </svg>
        },
        {label: "twitter", input: "twitterUrl", icon:
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
        },
        {label: "tiktok", input: "tiktokUrl", icon:
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlSpace="preserve"
            >
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
            </svg>
        }
    ];

    const handleCheckBox = (e, input) => {
        const isChecked = e.target.checked;
        setCheckedInputs(prev => ({
            ...prev,
            [input]: isChecked 
        }));
    };

    const handleInputChange = (e, input) => {
        const value = e.target.value;
        setSocial(prev => ({
            ...prev,
                [input]: value
        }));
    };

    return (
        <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-2">
            <div className='flex flex-col'>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ข้อมูล Applications</h1>
                <span className='text-gray-500'>จัดการข้อมูล application</span>
            </div>

            <div className="flex flex-col gap-2 mt-2 sm:grid-cols-2 sm:gap-4">
                <Tooltip title={'กรอกชื่อ application'} placement={'top-start'} arrow>
                <div className="flex flex-row items-center gap-2 w-full">
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Name:</label>
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
                    <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Descriptions:</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <Tooltip title={'กรอกรายละเอียด (ภาษาไทย)'} placement={'top-start'} arrow>
                        <textarea
                            type="text"
                            name="description_th"
                            id="description_th"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="รายละเอียด (ภาษาไทย)"
                            rows={2}
                            onChange={(e) => setDescriptions({ ...descriptions, th: e.target.value })}
                            value={descriptions?.th}
                        />
                        </Tooltip>

                        <Tooltip title={'กรอกรายละเอียด (ภาษาอังกฤษ)'} placement={'top-start'} arrow>
                        <textarea
                            type="text"
                            name="description_en"
                            id="description_en"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="รายละเอียด (ภาษาอังกฤษ)"
                            rows={2}
                            onChange={(e) => setDescriptions({ ...descriptions, en: e.target.value })}
                            value={descriptions?.en}
                        />
                        </Tooltip>
                    </div>
                </div>
                <div className='flex flex-col w-full gap-4'>
                {socialData.map((item, index) => (
                    <div key={index} className='flex flex-col items-start gap-2'>
                        <div className="flex items-center gap-2">
                            <input
                                type='checkbox'
                                checked={checkedInputs[item?.input]}
                                onChange={(e) => handleCheckBox(e, item?.input)}
                            />
                            {item?.icon} {item?.label}
                        </div>
                        {checkedInputs[item.input] && (
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={`Enter ${item?.label} URL`}
                                value={social[item.input]}
                                onChange={(e) => handleInputChange(e, item.input)}
                            />
                        )}
                    </div>
                ))}
                </div>

            </div>
            <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-4">
                <button
                    className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-20'
                    onClick={handleSubmit}
                    
                >
                    บันทึก
                </button>
            </div>
            
        </div>
    );
}
