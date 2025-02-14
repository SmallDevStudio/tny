import { CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className='flex items-center flex-col'>
                <span className='font-bold text-xl'>The New You</span>
                <span className='font-bold text-lg'>Academy</span>
            </div>
            <CircularProgress size={30}/>
        </div>
    );
}