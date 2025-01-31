import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { Divider } from '@mui/material';
import Image from 'next/image';

export default function SignIn() {
    return (
        <div className='flex flex-col justify-center items-center h-screen gap-2'>
            <div className='flex flex-col justify-center lg:w-2/6 md:w-2/5 sm:w-1/2'>
                {/* Header */}
                <div className='flex flex-col w-full mb-2'>
                    
                    <span className='text-3xl text-[#FFA500] font-bold'>The New You </span>
                    <span className='text-2xl text-black font-bold'>Admin Console</span>
                    
                </div>

                {/* Body */}
                <div className='flex flex-col border border-gray-200 rounded-xl w-full text-sm p-4 mt-2 shadow-xl bg-white'>
                    <span className='flex text-2xl text-black font-bold mb-1'>Sign In</span>

                    <Divider 
                        flexItem={true}
                        sx={{
                            width: '100%',
                            marginBottom: 2,
                            marginTop: 1
                        }}
                    />

                    <div className='flex flex-col w-full gap-2'>
                        <div className='grid grid-cols-4 items-center gap-2 w-full mt-2'>
                            <label htmlFor="username" className='font-bold col-span-1'>
                                Username:
                            </label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username"
                                placeholder='Username'
                                className='col-span-3 border border-gray-200 rounded-xl w-full px-4 py-2'
                            />
                        </div>

                        <div className='grid grid-cols-4 items-center gap-2 mt-2 w-full'>
                            <label htmlFor="password" className='font-bold col-span-1'>
                                Password:
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder='Password'
                                className='col-span-3 border border-gray-200 rounded-xl w-full px-4 py-2'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-4 items-center gap-2 mt-3 w-full'>
                        <div className='col-span-1'>

                        </div>
                        <div className='flex flex-row justify-between items-center text-sm col-span-3'>
                            <div className='flex flex-row items-center gap-2'>
                                <input 
                                    type="checkbox" 
                                    name="remember" 
                                    id="remember" 
                                />
                                <label htmlFor="remember" className='text-xs text-gray-500'>
                                    Remember Me
                                </label>
                            </div>
                            
                        </div>
                    </div>

                    <div className='flex flex-col justify-center w-full mt-6'>
                        <button 
                            type="submit"
                            className='bg-[#FFA500] text-white font-bold py-2 px-4 rounded-xl w-full'
                        >
                            Sign In
                        </button>
                        <div className='flex justify-end mt-1 w-full'>
                            <span className='text-[#FFA500] text-sm cursor-pointer'>Forget Password?</span>
                        </div>
                    </div>

                    <Divider 
                        variant="middle"
                        flexItem
                        orientation="horizontal"
                        sx={{ my: 2 }}
                        className='text-[#FFA500] font-bold jestify-center items-center'
                    >
                        OR
                    </Divider>

                    <div className='flex flex-col justify-center w-full mt-4 mb-4 gap-2'>
                        <button 
                            type="submit"
                            className='bg-white text-black border border-gray-700 font-bold py-2 px-4 rounded-xl w-full'
                            onClick={() => signIn('google')}
                        >
                            <div className='flex flex-row justify-center items-center gap-2'>
                                <Image
                                    src="/images/logo/googlelightx4.png"
                                    alt="Google Logo"
                                    width={30}
                                    height={30}
                                />
                                <span>Sign In with Google</span>
                            </div>
                        </button>

                        <button 
                            type="submit"
                            className='bg-[#06C755] text-white font-bold py-2 px-4 rounded-xl w-full mt-2'
                            onClick={() => signIn('line')}
                        >
                            <div className='flex flex-row justify-center items-center gap-2 '>
                                <Image
                                    src="/images/logo/line_88.png"
                                    alt="Line Logo"
                                    width={30}
                                    height={30}
                                />
                                <span>Sign In with LINE</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex flex-col justify-center items-center text-xs text-gray-500 w-full mt-5 gap-2'>
                    <span>
                        Copyright &copy; 2025 The New You. All rights reserved.
                    </span>
                    <span>Version: {process.env.NEXT_PUBLIC_VERSION}</span>
                </div>
            </div>
        </div>
    );
}
