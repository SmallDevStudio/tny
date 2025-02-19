import { useState, useEffect } from "react";

export default function CompanyForm() {


    return (
        <div className="flex flex-col gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex h-[100px] w-[100px] items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full">
                        Logo
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label for="name" className="block mb-1 text-sm font-bold text-gray-900 dark:text-white">ชื่อบริษัท</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ชื่อบริษัท (ภาษาไทย)"
                            onChange={(e) => setCompany({ ...company, name_th: e.target.value })}
                            value={company?.name_th}
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ชื่อบริษัท (ภาษาอังกฤษ)"
                            onChange={(e) => setCompany({ ...company, name_en: e.target.value })}
                            value={company?.name_en}
                            required
                        />
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label for="address" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่</label>
                    <div className="flex flex-col items-center gap-2 sm:flex-row ">
                        <textarea
                            type="text"
                            name="address_th"
                            id="address_th"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ที่อยู่ (ภาษาไทย)"
                            rows={2}
                            onChange={(e) => setCompany({ ...company, address_th: e.target.value })}
                            value={company?.address_th}
                        />
                        <textarea
                            type="text"
                            name="address_en"
                            id="address_en"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="ที่อยู่ (ภาษาอังกฤษ)"
                            rows={2}
                            onChange={(e) => setCompany({ ...company, address_en: e.target.value })}
                            value={company?.address_en}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <label for="phone" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">เบอร์โทร</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="เบอร์โทร"
                    />
                </div>

                <div className="w-full">
                    <label for="email" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">อีเมล</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="อีเมล"
                    />
                </div>

        </div>
    );
}