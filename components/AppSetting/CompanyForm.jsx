import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { Tooltip } from "@mui/material";
import { toast } from 'react-toastify';

export default function CompanyhtmlForm() {
    const [company, setCompany] = useState(null);
    const [logo, setLogo] = useState('');
    const [name, setName] = useState({});
    const [address, setAddress] = useState({});
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const { getById, update } = useDB("appdata");

    useEffect(() => {
        const fetchData = async () => {
            const companyData = await getById('company');
            setCompany(companyData);
        }
            
        if (!company) {
            fetchData();
        }

    },[company]);

    useEffect(() => {
        if (company) {
            setLogo(company.logo);
            setName(company.name);
            setAddress(company.address);
            setPhone(company.phone);
            setEmail(company.email);
        }
    },[company])

    console.log('company', company);

    const handleSubmit = async () => {
        const data = {
            logo: logo || null,
            name: {
                th: name.th || null,
                en: name.en || null
            },
            address: {
                th: address.th || null,
                en: address.en || null
            },
            phone: phone || null,
            email: email || null
        };

        try {
            await update('company', data);
            toast.success('บันทึกข้อมูลสำเร็จแล้ว!');
        } catch (error) {
            console.log(error);
            toast.error('บันทึกขอมูลไม่สำเร็จ!')
        }
    }

    return (
        <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex h-[100px] w-[100px] items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
                        Logo
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="name" className="block mb-1 text-sm font-bold text-gray-900 dark:text-white">ชื่อบริษัท</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ชื่อบริษัท (ภาษาไทย)"
                            onChange={(e) => setName({ ...name, th: e.target.value })}
                            value={name?.th}
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ชื่อบริษัท (ภาษาอังกฤษ)"
                            onChange={(e) => setName({ ...name, en: e.target.value })}
                            value={name?.en}
                            required
                        />
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <textarea
                            type="text"
                            name="address_th"
                            id="address_th"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ที่อยู่ (ภาษาไทย)"
                            rows={2}
                            onChange={(e) => setAddress({ ...address, th: e.target.value })}
                            value={address?.th}
                        />
                        <textarea
                            type="text"
                            name="address_en"
                            id="address_en"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ที่อยู่ (ภาษาอังกฤษ)"
                            rows={2}
                            onChange={(e) => setAddress({ ...address, en: e.target.value })}
                            value={address?.en}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">เบอร์โทร</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="เบอร์โทร"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">อีเมล</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="อีเมล"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <button
                        className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-20'
                        onClick={handleSubmit}
                    >
                        บันทีก
                    </button>
                </div>

        </div>
    );
}